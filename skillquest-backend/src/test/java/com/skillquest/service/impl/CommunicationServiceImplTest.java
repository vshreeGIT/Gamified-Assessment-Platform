package com.skillquest.service.impl;

import com.skillquest.entity.CommunicationAssessmentSession;
import com.skillquest.entity.CommunicationAttempt;
import com.skillquest.entity.CommunicationOption;
import com.skillquest.entity.CommunicationQuestion;
import com.skillquest.entity.User;
import com.skillquest.exception.AssessmentExpiredException;
import com.skillquest.repository.CommunicationAssessmentSessionRepository;
import com.skillquest.repository.CommunicationAttemptRepository;
import com.skillquest.repository.CommunicationQuestionRepository;
import com.skillquest.repository.UserRepository;
import com.skillquest.dto.CommunicationSubmitRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CommunicationServiceImplTest {

    private static final String EMAIL = "candidate@example.test";
    private static final String KEY = "session-key";
    private CommunicationQuestionRepository questionRepository;
    private CommunicationAssessmentSessionRepository sessionRepository;
    private CommunicationAttemptRepository attemptRepository;
    private UserRepository userRepository;
    private CommunicationServiceImpl service;
    private CommunicationAssessmentSession session;
    private User user;

    @BeforeEach
    void setUp() {
        questionRepository = mock(CommunicationQuestionRepository.class);
        sessionRepository = mock(CommunicationAssessmentSessionRepository.class);
        attemptRepository = mock(CommunicationAttemptRepository.class);
        userRepository = mock(UserRepository.class);
        service = new CommunicationServiceImpl(questionRepository, sessionRepository, attemptRepository, userRepository);
        session = session(Instant.now().plusSeconds(300));
        user = new User();
        user.setEmail(EMAIL);
        user.setXp(10);
        user.setLevel(1);
        when(sessionRepository.findById(anyString())).thenReturn(Optional.of(session));
        when(attemptRepository.findByUserEmailAndSubmissionKey(EMAIL, KEY)).thenReturn(Optional.empty());
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
    }

    @Test
    void scoresAnswersOnServerAndAwardsTieredXpOnce() {
        Map<String, String> answers = Map.of("Q1", "A", "Q2", "A", "Q3", "A", "Q4", "A", "Q5", "A",
                "Q6", "A", "Q7", "A", "Q8", "A", "Q9", "A", "Q10", "A");

        var result = service.submitAssessment(EMAIL, request(answers));

        assertEquals(100, result.getAccuracy());
        assertEquals(100, result.getEarnedXp());
        assertEquals(true, result.isPassed());
        assertEquals(110, user.getXp());
        verify(attemptRepository).insert(any(CommunicationAttempt.class));
        verify(userRepository).save(user);
        assertEquals("COMPLETED", session.getStatus());
    }

    @Test
    void sevenOfTenFullAnswersPassAndReceiveSeventyXp() {
        Map<String, String> answers = Map.of("Q1", "A", "Q2", "A", "Q3", "A", "Q4", "A", "Q5", "A",
                "Q6", "A", "Q7", "A");

        var result = service.submitAssessment(EMAIL, request(answers));

        assertEquals(70, result.getAccuracy());
        assertEquals(70, result.getEarnedXp());
        assertEquals(true, result.isPassed());
        assertEquals(80, user.getXp());
    }

    @Test
    void rejectsLateSubmissionWithoutSavingAttemptOrXp() {
        session.setDeadlineAt(Instant.now().minusSeconds(1));

        assertThrows(AssessmentExpiredException.class,
                () -> service.submitAssessment(EMAIL, request(Map.of("Q1", "A"))));

        verify(attemptRepository, never()).insert(any(CommunicationAttempt.class));
        verify(userRepository, never()).save(any(User.class));
        assertEquals("EXPIRED", session.getStatus());
    }

    @Test
    void duplicateSubmissionReturnsSavedResultWithoutAwardingXpAgain() {
        CommunicationAttempt saved = CommunicationAttempt.builder().id(KEY).userEmail(EMAIL).score(30).maxScore(30)
                .accuracy(100).passed(true).earnedXp(100).timeTakenSeconds(60).submissionKey(KEY).build();
        when(attemptRepository.findByUserEmailAndSubmissionKey(EMAIL, KEY)).thenReturn(Optional.of(saved));

        var result = service.submitAssessment(EMAIL, request(Map.of()));

        assertEquals(100, result.getEarnedXp());
        verify(attemptRepository, never()).insert(any(CommunicationAttempt.class));
        verify(userRepository, never()).save(any(User.class));
    }

    private CommunicationSubmitRequest request(Map<String, String> answers) {
        return CommunicationSubmitRequest.builder().submissionKey(KEY).answers(answers).timeTakenSeconds(0).build();
    }

    private CommunicationAssessmentSession session(Instant deadline) {
        List<CommunicationQuestion> questions = java.util.stream.IntStream.rangeClosed(1, 10)
                .mapToObj(index -> CommunicationQuestion.builder().id("Q" + index).category("Workplace")
                        .prompt("Prompt").scenario("Scenario")
                        .options(List.of(CommunicationOption.builder().id("A").text("Best response")
                                .points(3).feedback("Good").build())).build())
                .toList();
        return CommunicationAssessmentSession.builder().id("session-id").userEmail(EMAIL).submissionKey(KEY)
                .status("ACTIVE").startedAt(Instant.now().minusSeconds(120)).deadlineAt(deadline)
                .questions(questions).build();
    }
}
