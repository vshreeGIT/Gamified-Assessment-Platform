package com.skillquest.service.impl;

import com.skillquest.dto.InterviewSubmitRequest;
import com.skillquest.config.InterviewProgressionBypass;
import com.skillquest.entity.*;
import com.skillquest.repository.*;
import com.skillquest.service.QuestProgressService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.access.AccessDeniedException;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class InterviewBattleServiceImplTest {
    private static final String EMAIL = "candidate@example.test";
    private InterviewAssessmentSessionRepository sessions;
    private InterviewAttemptRepository attempts;
    private QuestProgressService progress;
    private UserRepository users;
    private InterviewBattleServiceImpl service;

    @BeforeEach void setup() {
        sessions = mock(InterviewAssessmentSessionRepository.class);
        attempts = mock(InterviewAttemptRepository.class);
        progress = mock(QuestProgressService.class);
        users = mock(UserRepository.class);
        service = new InterviewBattleServiceImpl(sessions, attempts, progress, users, new InterviewProgressionBypass(false));
        when(sessions.findById(anyString())).thenReturn(Optional.empty());
        when(sessions.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(attempts.findByUserEmailAndSessionKey(anyString(), anyString())).thenReturn(Optional.empty());
        when(attempts.insert(any(InterviewAttempt.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(users.findByEmail(EMAIL)).thenReturn(Optional.of(user()));
        when(users.awardInterviewXpOnce(anyString(), anyString(), anyInt())).thenReturn(true);
    }

    @Test void lockedCandidateCannotStartAndNoSessionIsCreated() {
        doThrow(new AccessDeniedException("locked")).when(progress).requireInterviewUnlocked(EMAIL);
        assertThrows(AccessDeniedException.class, () -> service.start(EMAIL));
        verify(sessions, never()).save(any());
    }

    @Test void temporaryBypassAllowsStartWithoutCallingTheEligibilityGate() {
        doThrow(new AccessDeniedException("locked")).when(progress).requireInterviewUnlocked(EMAIL);
        InterviewBattleServiceImpl testingService = new InterviewBattleServiceImpl(sessions, attempts, progress, users,
                new InterviewProgressionBypass(true));
        var session = testingService.start(EMAIL);
        assertNotNull(session.getSessionKey());
        verify(progress, never()).requireInterviewUnlocked(EMAIL);
        assertThrows(IllegalArgumentException.class, () -> testingService.getAttempt("other@example.test", "attempt-id"));
        assertThrows(IllegalArgumentException.class, () -> testingService.submit("other@example.test",
                new InterviewSubmitRequest("session-key", Map.of())));
    }

    @Test void eligibleCandidateGetsTenServerSelectedQuestionsAndTwentyMinuteDeadlineWithoutKeys() {
        var response = service.start(EMAIL);
        assertEquals(10, response.getQuestions().size());
        assertEquals(20, response.getDurationMinutes());
        assertTrue(response.getDeadlineAt().isAfter(response.getStartedAt().plusSeconds(19 * 60)));
        assertTrue(response.getDeadlineAt().isBefore(response.getStartedAt().plusSeconds(21 * 60)));
        assertEquals(5, response.getQuestions().stream().filter(q -> "MULTIPLE_CHOICE".equals(q.getType())).count());
        assertEquals(5, response.getQuestions().stream().filter(q -> "OPEN_ENDED".equals(q.getType())).count());
        assertFalse(Arrays.stream(response.getQuestions().get(0).getClass().getDeclaredFields()).anyMatch(field ->
                field.getName().toLowerCase(Locale.ROOT).contains("correct") || field.getName().toLowerCase(Locale.ROOT).contains("answerkey")));
        verify(progress).requireInterviewUnlocked(EMAIL);
    }

    @Test void startAndRefreshReuseAnActiveSessionAndItsOriginalDeadline() {
        AtomicReference<InterviewAssessmentSession> stored = new AtomicReference<>();
        when(sessions.findById(sessionId(EMAIL))).thenAnswer(invocation -> Optional.ofNullable(stored.get()));
        when(sessions.save(any())).thenAnswer(invocation -> { var s = invocation.getArgument(0, InterviewAssessmentSession.class); stored.set(s); return s; });
        var first = service.start(EMAIL);
        var second = service.start(EMAIL);
        assertEquals(first.getSessionKey(), second.getSessionKey());
        assertEquals(first.getDeadlineAt(), second.getDeadlineAt());
        verify(progress, times(1)).requireInterviewUnlocked(EMAIL);
        assertEquals(first.getSessionKey(), service.getActiveSession(EMAIL).orElseThrow().getSessionKey());
    }

    @Test void draftAnswersPersistOnTheOwnedActiveSession() {
        InterviewAssessmentSession session = activeSession(List.of(mcq("q1")));
        when(sessions.findById(sessionId(EMAIL))).thenReturn(Optional.of(session));
        var response = service.saveDraft(EMAIL, new com.skillquest.dto.InterviewDraftRequest(session.getSessionKey(), Map.of("q1", "A")));
        assertEquals("A", response.getDraftAnswers().get("q1"));
        verify(sessions).save(session);
    }

    @Test void serverScoresMultipleChoiceAndAwardsTheExistingCardMaximumAtHighAccuracy() {
        List<InterviewQuestion> questions = new ArrayList<>();
        for (int i = 1; i <= 10; i++) questions.add(mcq("q" + i));
        InterviewAssessmentSession session = activeSession(questions);
        when(sessions.findById(sessionId(EMAIL))).thenReturn(Optional.of(session));
        Map<String, String> answers = new HashMap<>();
        for (int i = 1; i <= 10; i++) answers.put("q" + i, "A");
        var result = service.submit(EMAIL, request(session, answers));
        assertEquals(40, result.getScore());
        assertEquals(40, result.getMaxScore());
        assertEquals(100, result.getAccuracy());
        assertEquals(130, result.getEarnedXp());
        assertTrue(result.isPassed());
        verify(users).awardInterviewXpOnce(EMAIL, session.getSessionKey(), 130);
    }

    @Test void emptyOpenEndedAnswerGetsZeroAndMinimumTierXp() {
        InterviewAssessmentSession session = activeSession(List.of(open("q1")));
        when(sessions.findById(sessionId(EMAIL))).thenReturn(Optional.of(session));
        var result = service.submit(EMAIL, request(session, Map.of("q1", "")));
        assertEquals(0, result.getScore());
        assertEquals(4, result.getMaxScore());
        assertEquals(20, result.getEarnedXp());
        assertFalse(result.isPassed());
    }

    @Test void interviewRewardsFollowTheExistingReasoningAccuracyTiers() {
        assertEquals(130, service.xpForAccuracy(90));
        assertEquals(111, service.xpForAccuracy(89));
        assertEquals(111, service.xpForAccuracy(80));
        assertEquals(91, service.xpForAccuracy(70));
        assertEquals(52, service.xpForAccuracy(50));
        assertEquals(20, service.xpForAccuracy(49));
    }

    @Test void sevenCorrectChoicesMeetTheExistingSeventyPercentPassThreshold() {
        List<InterviewQuestion> questions = new ArrayList<>(); Map<String, String> answers = new HashMap<>();
        for (int i = 1; i <= 10; i++) { questions.add(mcq("q" + i)); answers.put("q" + i, i <= 7 ? "A" : "B"); }
        InterviewAssessmentSession session = activeSession(questions);
        when(sessions.findById(sessionId(EMAIL))).thenReturn(Optional.of(session));
        var result = service.submit(EMAIL, request(session, answers));
        assertEquals(70, result.getAccuracy());
        assertTrue(result.isPassed());
        assertEquals(91, result.getEarnedXp());
    }

    @Test void irrelevantLongOpenAnswerReceivesNoPoints() {
        InterviewAssessmentSession session = activeSession(List.of(open("q1")));
        when(sessions.findById(sessionId(EMAIL))).thenReturn(Optional.of(session));
        String irrelevant = "Blue clouds move slowly across a quiet field and many ordinary details remain unrelated to the question. ".repeat(3);
        var result = service.submit(EMAIL, request(session, Map.of("q1", irrelevant)));
        assertEquals(0, result.getScore());
        assertTrue(result.getFeedback().get(0).contains("No expected topic concepts"));
    }

    @Test void wrongChoiceAndUnknownQuestionAreRejectedAndClientCannotSetScoreOrXp() {
        InterviewAssessmentSession session = activeSession(List.of(mcq("q1")));
        when(sessions.findById(sessionId(EMAIL))).thenReturn(Optional.of(session));
        assertThrows(IllegalArgumentException.class, () -> service.submit(EMAIL, request(session, Map.of("q1", "NOT-A-CHOICE"))));
        assertThrows(IllegalArgumentException.class, () -> service.submit(EMAIL, request(session, Map.of("other", "A"))));
        var dto = new com.skillquest.dto.InterviewSubmitRequest();
        assertThrows(IllegalArgumentException.class, () -> dto.rejectUnexpectedField("xp", 9999));
        verify(attempts, never()).insert(any(InterviewAttempt.class));
    }

    @Test void submissionsFromOtherAccountsAndExpiredSessionsAreRejected() {
        InterviewAssessmentSession session = activeSession(List.of(mcq("q1")));
        session.setDeadlineAt(Instant.now().minusSeconds(1));
        when(sessions.findById(sessionId(EMAIL))).thenReturn(Optional.of(session));
        assertThrows(com.skillquest.exception.AssessmentExpiredException.class, () -> service.submit(EMAIL, request(session, Map.of("q1", "A"))));
        assertEquals("EXPIRED", session.getStatus());
        verify(attempts, never()).insert(any(InterviewAttempt.class));
        assertThrows(IllegalArgumentException.class, () -> service.getAttempt("other@example.test", session.getSessionKey()));
    }

    @Test void duplicateSubmissionReturnsStoredResultAndUsesSameXpAwardKey() {
        InterviewAssessmentSession session = activeSession(List.of(mcq("q1")));
        when(sessions.findById(sessionId(EMAIL))).thenReturn(Optional.of(session));
        var first = service.submit(EMAIL, request(session, Map.of("q1", "A")));
        InterviewAttempt persisted = InterviewAttempt.builder().id(first.getAttemptId()).sessionKey(first.getAttemptId()).userEmail(EMAIL)
                .score(first.getScore()).maxScore(first.getMaxScore()).accuracy(first.getAccuracy()).passed(first.isPassed())
                .earnedXp(first.getEarnedXp()).categoryResults(session.getQuestions().stream().map(q -> InterviewCategoryResult.builder().category(q.getCategory()).score(4).maxScore(4).accuracy(100).strengths(List.of()).areasToImprove(List.of()).build()).toList())
                .feedback(first.getFeedback()).completedAt(first.getCompletedAt()).build();
        when(attempts.findByUserEmailAndSessionKey(EMAIL, session.getSessionKey())).thenReturn(Optional.of(persisted));
        var duplicate = service.submit(EMAIL, request(session, Map.of("q1", "B")));
        assertEquals(first.getEarnedXp(), duplicate.getEarnedXp());
        verify(attempts, times(1)).insert(any(InterviewAttempt.class));
        verify(users, times(2)).awardInterviewXpOnce(EMAIL, session.getSessionKey(), first.getEarnedXp());
    }

    @Test void concurrentDuplicateRequestsUseAnAtomicPerAttemptRewardMarker() throws Exception {
        InterviewAssessmentSession session = activeSession(List.of(mcq("q1")));
        when(sessions.findById(sessionId(EMAIL))).thenReturn(Optional.of(session));
        AtomicReference<InterviewAttempt> saved = new AtomicReference<>();
        when(attempts.findByUserEmailAndSessionKey(EMAIL, session.getSessionKey())).thenAnswer(call -> Optional.ofNullable(saved.get()));
        when(attempts.insert(any(InterviewAttempt.class))).thenAnswer(call -> { saved.set(call.getArgument(0)); return saved.get(); });
        Set<String> creditedKeys = ConcurrentHashMap.newKeySet();
        AtomicInteger totalAwards = new AtomicInteger();
        when(users.awardInterviewXpOnce(anyString(), anyString(), anyInt())).thenAnswer(call -> {
            if (creditedKeys.add(call.getArgument(1))) { totalAwards.addAndGet(call.getArgument(2)); return true; }
            return false;
        });
        ExecutorService pool = Executors.newFixedThreadPool(6);
        try {
            List<Callable<Object>> submits = new ArrayList<>();
            for (int i = 0; i < 12; i++) submits.add(() -> service.submit(EMAIL, request(session, Map.of("q1", "A"))));
            for (Future<Object> future : pool.invokeAll(submits)) assertNotNull(future.get());
        } finally { pool.shutdownNow(); }
        assertEquals(1, creditedKeys.size());
        assertEquals(130, totalAwards.get());
        verify(attempts, times(1)).insert(any(InterviewAttempt.class));
    }

    @Test void savedAttemptCanOnlyBeRetrievedByItsOwner() {
        InterviewAttempt attempt = InterviewAttempt.builder().id("attempt").sessionKey("attempt").userEmail(EMAIL)
                .score(1).maxScore(4).accuracy(25).earnedXp(20).categoryResults(List.of()).feedback(List.of()).completedAt(Instant.now()).build();
        when(attempts.findByUserEmailAndSessionKey(EMAIL, "attempt")).thenReturn(Optional.of(attempt));
        assertEquals("attempt", service.getAttempt(EMAIL, "attempt").getAttemptId());
        assertThrows(IllegalArgumentException.class, () -> service.getAttempt("other@example.test", "attempt"));
    }

    private User user() { User user = new User(); user.setEmail(EMAIL); user.setXp(800); return user; }
    private InterviewQuestion mcq(String id) {
        return InterviewQuestion.builder().id(id).category("Technical Fundamentals").type("MULTIPLE_CHOICE")
                .prompt("Choose the best response.").choices(List.of(InterviewChoice.builder().id("A").text("Correct response").build(), InterviewChoice.builder().id("B").text("Incorrect response").build()))
                .correctChoiceId("A").rationale("This is the verified choice.").relevanceTerms(List.of()).actionTerms(List.of()).build();
    }
    private InterviewQuestion open(String id) {
        return InterviewQuestion.builder().id(id).category("HR and Introduction").type("OPEN_ENDED").prompt("Describe a project and a practical next step.")
                .choices(List.of()).relevanceTerms(List.of("project", "experience", "goal")).actionTerms(List.of("plan", "build", "learn")).build();
    }
    private InterviewAssessmentSession activeSession(List<InterviewQuestion> questions) {
        Instant now = Instant.now(); return InterviewAssessmentSession.builder().id(sessionId(EMAIL)).userEmail(EMAIL).sessionKey("session-key")
                .status("ACTIVE").startedAt(now).deadlineAt(now.plusSeconds(1200)).questions(questions).draftAnswers(new HashMap<>()).build();
    }
    private InterviewSubmitRequest request(InterviewAssessmentSession session, Map<String, String> answers) {
        return new InterviewSubmitRequest(session.getSessionKey(), answers);
    }
    private String sessionId(String email) { return UUID.nameUUIDFromBytes((email + "|INTERVIEW_BATTLE").getBytes(java.nio.charset.StandardCharsets.UTF_8)).toString(); }
}
