package com.skillquest.service.impl;

import com.skillquest.dto.CommunicationHubSubmitRequest;
import com.skillquest.dto.CommunicationRoleplayTurnRequest;
import com.skillquest.entity.CommunicationActivity;
import com.skillquest.entity.CommunicationAssessmentSession;
import com.skillquest.entity.CommunicationAttempt;
import com.skillquest.entity.CommunicationRoleplayChoice;
import com.skillquest.entity.CommunicationRoleplayProgress;
import com.skillquest.entity.CommunicationRoleplayTurn;
import com.skillquest.entity.CommunicationRubricCriterion;
import com.skillquest.entity.User;
import com.skillquest.exception.AssessmentExpiredException;
import com.skillquest.repository.CommunicationActivityRepository;
import com.skillquest.repository.CommunicationAssessmentSessionRepository;
import com.skillquest.repository.CommunicationAttemptRepository;
import com.skillquest.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CommunicationHubServiceImplTest {
    private static final String EMAIL = "candidate@example.test";
    private static final String KEY = "hub-session-key";
    private CommunicationActivityRepository activityRepository;
    private CommunicationAssessmentSessionRepository sessionRepository;
    private CommunicationAttemptRepository attemptRepository;
    private UserRepository userRepository;
    private CommunicationHubServiceImpl service;
    private User user;

    @BeforeEach
    void setUp() {
        activityRepository = mock(CommunicationActivityRepository.class);
        sessionRepository = mock(CommunicationAssessmentSessionRepository.class);
        attemptRepository = mock(CommunicationAttemptRepository.class);
        userRepository = mock(UserRepository.class);
        service = new CommunicationHubServiceImpl(activityRepository, sessionRepository, attemptRepository, userRepository);
        user = new User();
        user.setEmail(EMAIL);
        user.setXp(5);
        user.setLevel(1);
        when(sessionRepository.findById(anyString())).thenReturn(Optional.empty());
        when(sessionRepository.save(any(CommunicationAssessmentSession.class))).thenAnswer(call -> call.getArgument(0));
        when(attemptRepository.findByUserEmailAndSubmissionKey(EMAIL, KEY)).thenReturn(Optional.empty());
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
    }

    @Test
    void subdivisionsReceiveIndependentFiveMinuteSessions() {
        when(activityRepository.findBySubdivisionIdOrderByIdAsc("office-team")).thenReturn(List.of(textActivity("write", "office-team")));
        when(activityRepository.findBySubdivisionIdOrderByIdAsc("customer-relations")).thenReturn(List.of(textActivity("speak", "customer-relations")));

        var office = service.start(EMAIL, "office-team");
        var customer = service.start(EMAIL, "customer-relations");

        assertNotEquals(office.getSubmissionKey(), customer.getSubmissionKey());
        assertEquals(5, office.getDurationMinutes());
        assertEquals(5, customer.getDurationMinutes());
        var sessionCaptor = org.mockito.ArgumentCaptor.forClass(CommunicationAssessmentSession.class);
        verify(sessionRepository, org.mockito.Mockito.times(2)).save(sessionCaptor.capture());
        assertNotEquals(sessionCaptor.getAllValues().get(0).getId(), sessionCaptor.getAllValues().get(1).getId());
        long remainingSeconds = Duration.between(Instant.now(), office.getDeadlineAt()).getSeconds();
        org.junit.jupiter.api.Assertions.assertTrue(remainingSeconds <= 300 && remainingSeconds >= 298);
    }

    @Test
    void startupSeedingInsertsOnlyMissingActivityIds() {
        CommunicationActivity existing = CommunicationActivity.builder().id("hub-office-speak-delay")
                .title("Do not overwrite this saved activity").build();
        when(activityRepository.findAll()).thenReturn(List.of(existing));

        service.seedActivitiesIfMissing();

        var inserted = org.mockito.ArgumentCaptor.forClass(CommunicationActivity.class);
        verify(activityRepository, org.mockito.Mockito.times(9)).insert(inserted.capture());
        org.junit.jupiter.api.Assertions.assertTrue(inserted.getAllValues().stream()
                .noneMatch(activity -> "hub-office-speak-delay".equals(activity.getId())));
        verify(activityRepository, never()).deleteAll();
    }

    @Test
    void refreshingAnActiveSubdivisionDoesNotExtendItsDeadline() {
        Map<String, CommunicationAssessmentSession> sessions = new HashMap<>();
        when(sessionRepository.findById(anyString())).thenAnswer(call -> Optional.ofNullable(sessions.get(call.getArgument(0))));
        when(sessionRepository.save(any(CommunicationAssessmentSession.class))).thenAnswer(call -> {
            CommunicationAssessmentSession saved = call.getArgument(0);
            sessions.put(saved.getId(), saved);
            return saved;
        });
        when(activityRepository.findBySubdivisionIdOrderByIdAsc("office-team")).thenReturn(List.of(textActivity("write", "office-team")));

        var first = service.start(EMAIL, "office-team");
        var resumed = service.start(EMAIL, "office-team");

        assertEquals(first.getSubmissionKey(), resumed.getSubmissionKey());
        assertEquals(first.getDeadlineAt(), resumed.getDeadlineAt());
        verify(sessionRepository, org.mockito.Mockito.times(1)).save(any(CommunicationAssessmentSession.class));
    }

    @Test
    void expiringOneSubdivisionLeavesAnotherSessionActive() {
        Map<String, CommunicationAssessmentSession> sessions = new HashMap<>();
        when(sessionRepository.findById(anyString())).thenAnswer(call -> Optional.ofNullable(sessions.get(call.getArgument(0))));
        when(sessionRepository.save(any(CommunicationAssessmentSession.class))).thenAnswer(call -> {
            CommunicationAssessmentSession saved = call.getArgument(0);
            sessions.put(saved.getId(), saved);
            return saved;
        });
        when(attemptRepository.findByUserEmailAndSubmissionKey(EMAIL, KEY)).thenReturn(Optional.empty());
        when(activityRepository.findBySubdivisionIdOrderByIdAsc("office-team")).thenReturn(List.of(textActivity("office-writing", "office-team")));
        when(activityRepository.findBySubdivisionIdOrderByIdAsc("customer-relations")).thenReturn(List.of(textActivity("customer-writing", "customer-relations")));

        var office = service.start(EMAIL, "office-team");
        var customer = service.start(EMAIL, "customer-relations");
        CommunicationAssessmentSession officeSession = sessions.values().stream()
                .filter(session -> "office-team".equals(session.getSubdivisionId())).findFirst().orElseThrow();
        CommunicationAssessmentSession customerSession = sessions.values().stream()
                .filter(session -> "customer-relations".equals(session.getSubdivisionId())).findFirst().orElseThrow();
        officeSession.setDeadlineAt(Instant.now().minusSeconds(1));

        assertThrows(AssessmentExpiredException.class, () -> service.submit(EMAIL, "office-team",
                CommunicationHubSubmitRequest.builder().submissionKey(office.getSubmissionKey()).responses(Map.of()).build()));

        assertEquals("EXPIRED", officeSession.getStatus());
        assertEquals("ACTIVE", customerSession.getStatus());
        assertEquals(customer.getSubmissionKey(), service.getSession(EMAIL, "customer-relations", customer.getSubmissionKey()).getSubmissionKey());
    }

    @Test
    void responseTranscriptAndWrittenTextAreSavedAndChecklistScored() {
        CommunicationActivity activity = textActivity("written", "office-team");
        CommunicationActivity speaking = textActivity("spoken", "office-team");
        speaking.setType("SPEAKING");
        CommunicationAssessmentSession session = session("office-team", activity, Instant.now().plusSeconds(60));
        session.setActivities(List.of(activity, speaking));
        when(sessionRepository.findById(anyString())).thenReturn(Optional.of(session));
        when(attemptRepository.findByUserEmailAndSubmissionKey(EMAIL, KEY)).thenReturn(Optional.empty());
        Map<String, String> responses = Map.of(
                "written", "The project has a delay. Current status is blocked. Next update tomorrow.",
                "spoken", "The project has a delay. Current status is blocked. Next update tomorrow.");

        var result = service.submit(EMAIL, "office-team", CommunicationHubSubmitRequest.builder().submissionKey(KEY).responses(responses).build());

        assertEquals(100, result.getAccuracy());
        assertEquals(100, result.getEarnedXp());
        assertEquals(2, result.getActivitiesCompleted());
        var attemptCaptor = org.mockito.ArgumentCaptor.forClass(CommunicationAttempt.class);
        verify(attemptRepository).insert(attemptCaptor.capture());
        assertEquals(responses, attemptCaptor.getValue().getResponses());
        assertEquals("COMPLETED", session.getStatus());
        assertEquals(105, user.getXp());
    }

    @Test
    void lateSubmissionIsRejectedWithoutAttemptOrXp() {
        CommunicationAssessmentSession session = session("office-team", textActivity("written", "office-team"), Instant.now().minusSeconds(1));
        when(sessionRepository.findById(anyString())).thenReturn(Optional.of(session));

        assertThrows(AssessmentExpiredException.class, () -> service.submit(EMAIL, "office-team",
                CommunicationHubSubmitRequest.builder().submissionKey(KEY).responses(Map.of()).build()));

        verify(attemptRepository, never()).insert(any(CommunicationAttempt.class));
        verify(userRepository, never()).save(any(User.class));
        assertEquals("EXPIRED", session.getStatus());
    }

    @Test
    void duplicateSubmissionDoesNotAwardXpAgain() {
        CommunicationAttempt saved = CommunicationAttempt.builder().id(KEY).userEmail(EMAIL).submissionKey(KEY)
                .subdivisionId("office-team").score(3).maxScore(3).accuracy(100).passed(true).earnedXp(100).build();
        when(attemptRepository.findByUserEmailAndSubmissionKey(EMAIL, KEY)).thenReturn(Optional.of(saved));

        var result = service.submit(EMAIL, "office-team", CommunicationHubSubmitRequest.builder().submissionKey(KEY).build());

        assertEquals(100, result.getEarnedXp());
        verify(attemptRepository, never()).insert(any(CommunicationAttempt.class));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void roleplayBranchesAcrossServerValidatedTurnsAndSavesTheConversation() {
        CommunicationActivity activity = roleplayActivity();
        CommunicationAssessmentSession session = session("office-team", activity, Instant.now().plusSeconds(60));
        session.setRoleplayProgress(Map.of(activity.getId(), CommunicationRoleplayProgress.builder()
                .currentTurnId("start").choiceIds(new ArrayList<>()).build()));
        when(sessionRepository.findById(anyString())).thenReturn(Optional.of(session));

        var next = service.submitRoleplayTurn(EMAIL, "office-team", CommunicationRoleplayTurnRequest.builder()
                .submissionKey(KEY).activityId(activity.getId()).choiceId("good").build());
        assertEquals("Tell me more about the impact.", next.getMessage());
        assertThrows(IllegalArgumentException.class, () -> service.submitRoleplayTurn(EMAIL, "office-team",
                CommunicationRoleplayTurnRequest.builder().submissionKey(KEY).activityId(activity.getId()).choiceId("invalid-for-turn").build()));

        service.submitRoleplayTurn(EMAIL, "office-team", CommunicationRoleplayTurnRequest.builder()
                .submissionKey(KEY).activityId(activity.getId()).choiceId("good2").build());
        var completed = service.submitRoleplayTurn(EMAIL, "office-team", CommunicationRoleplayTurnRequest.builder()
                .submissionKey(KEY).activityId(activity.getId()).choiceId("good3").build());
        assertEquals(true, completed.isComplete());

        var result = service.submit(EMAIL, "office-team", CommunicationHubSubmitRequest.builder().submissionKey(KEY).responses(Map.of()).build());
        assertEquals(100, result.getAccuracy());
        var attemptCaptor = org.mockito.ArgumentCaptor.forClass(CommunicationAttempt.class);
        verify(attemptRepository).insert(attemptCaptor.capture());
        assertEquals(List.of("good", "good2", "good3"), attemptCaptor.getValue().getRoleplayChoices().get(activity.getId()));
    }

    @Test
    void progressUsesSavedSubdivisionAttemptsAndKeepsLegacyXpVisible() {
        when(attemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(
                CommunicationAttempt.builder().id("new-1").subdivisionId("office-team").accuracy(80).passed(true).earnedXp(85).build(),
                CommunicationAttempt.builder().id("legacy").accuracy(90).passed(true).earnedXp(100).build()));

        var progress = service.getProgress(EMAIL);

        assertEquals(1, progress.getCompletedSubdivisions());
        assertEquals(20, progress.getProgress());
        assertEquals(2, progress.getAttemptCount());
        assertEquals(185, progress.getTotalXpEarned());
        assertEquals(true, progress.isCommunicationPro());
        assertEquals(100, progress.getSubdivisions().get(0).getProgress());
        assertEquals(0, progress.getSubdivisions().get(1).getProgress());
    }

    private CommunicationAssessmentSession session(String subdivisionId, CommunicationActivity activity, Instant deadline) {
        return CommunicationAssessmentSession.builder().id("session-id").userEmail(EMAIL).submissionKey(KEY).status("ACTIVE")
                .startedAt(Instant.now().minusSeconds(30)).deadlineAt(deadline).subdivisionId(subdivisionId)
                .activities(List.of(activity)).roleplayProgress(new HashMap<>()).build();
    }

    private CommunicationActivity textActivity(String id, String subdivisionId) {
        return CommunicationActivity.builder().id(id).subdivisionId(subdivisionId).type("WRITING").title("Status update")
                .rubric(List.of(criterion("impact", "delay"), criterion("status", "blocked"), criterion("next step", "tomorrow"))).build();
    }

    private CommunicationRubricCriterion criterion(String label, String term) {
        return CommunicationRubricCriterion.builder().label(label).matchTerms(List.of(term)).build();
    }

    private CommunicationActivity roleplayActivity() {
        return CommunicationActivity.builder().id("roleplay").subdivisionId("office-team").type("ROLEPLAY")
                .title("Handoff roleplay").firstTurnId("start").turns(List.of(
                        turn("start", "I thought you owned the handoff.",
                                choice("good", "Let's clarify who owns each next step.", "detail", 3),
                                choice("poor", "This is your fault.", "detail", 0)),
                        turn("detail", "Tell me more about the impact.",
                                choice("good2", "The client needs an update today.", "close", 3),
                                choice("poor2", "There is no impact.", "close", 0)),
                        turn("unused", "Alternate branch", choice("unused-choice", "Alternative", "close", 1)),
                        turn("close", "When will you follow up?",
                                choice("good3", "I'll send an update by 3 PM.", null, 3),
                                choice("poor3", "Later.", null, 0)))).build();
    }

    private CommunicationRoleplayTurn turn(String id, String message, CommunicationRoleplayChoice... choices) {
        return CommunicationRoleplayTurn.builder().id(id).message(message).choices(List.of(choices)).build();
    }

    private CommunicationRoleplayChoice choice(String id, String text, String nextId, int points) {
        return CommunicationRoleplayChoice.builder().id(id).text(text).nextTurnId(nextId).points(points).build();
    }
}
