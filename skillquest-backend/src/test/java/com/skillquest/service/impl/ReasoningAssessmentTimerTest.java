package com.skillquest.service.impl;

import com.skillquest.dto.ReasoningResultResponse;
import com.skillquest.dto.ReasoningSubmitRequest;
import com.skillquest.entity.ReasoningAssessmentSession;
import com.skillquest.entity.ReasoningAttempt;
import com.skillquest.entity.ReasoningQuestion;
import com.skillquest.repository.ReasoningAssessmentSessionRepository;
import com.skillquest.repository.ReasoningAttemptRepository;
import com.skillquest.repository.ReasoningQuestionRepository;
import com.skillquest.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ReasoningAssessmentTimerTest {

    private final ReasoningQuestionRepository questionRepository = org.mockito.Mockito.mock(ReasoningQuestionRepository.class);
    private final ReasoningAttemptRepository attemptRepository = org.mockito.Mockito.mock(ReasoningAttemptRepository.class);
    private final ReasoningAssessmentSessionRepository sessionRepository = org.mockito.Mockito.mock(ReasoningAssessmentSessionRepository.class);
    private final UserRepository userRepository = org.mockito.Mockito.mock(UserRepository.class);
    private ReasoningServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new ReasoningServiceImpl(questionRepository, attemptRepository, sessionRepository, userRepository);
    }

    @Test
    void refreshingQuizReusesTheStoredDeadline() {
        AtomicReference<ReasoningAssessmentSession> storedSession = new AtomicReference<>();
        when(sessionRepository.findById(anyString())).thenAnswer(invocation ->
                Optional.ofNullable(storedSession.get()));
        when(sessionRepository.save(any(ReasoningAssessmentSession.class))).thenAnswer(invocation -> {
            ReasoningAssessmentSession session = invocation.getArgument(0);
            storedSession.set(session);
            return session;
        });
        when(attemptRepository.findByUserEmailAndSubmissionKey(anyString(), anyString()))
                .thenReturn(Optional.empty());
        when(questionRepository.findByDifficulty("BEGINNER")).thenReturn(List.of(
                ReasoningQuestion.builder().id("B01").difficulty("BEGINNER")
                        .question("Question").options(List.of("A", "B")).correctAnswer("A").build()));

        var started = service.startQuiz("BEGINNER", "candidate@example.test");
        var repeatedStart = service.startQuiz("BEGINNER", "candidate@example.test");
        var refreshed = service.getQuiz("BEGINNER", "candidate@example.test", started.getSubmissionKey());

        assertEquals(started.getSubmissionKey(), repeatedStart.getSubmissionKey());
        assertEquals(started.getDeadlineAt(), repeatedStart.getDeadlineAt());
        assertEquals(started.getSubmissionKey(), refreshed.getSubmissionKey());
        assertEquals(started.getDeadlineAt(), refreshed.getDeadlineAt());
        verify(sessionRepository).save(any(ReasoningAssessmentSession.class));
    }

    @Test
    void startKeepsTheExistingDifficultyTimeLimits() {
        when(sessionRepository.findById(anyString())).thenReturn(Optional.empty());
        when(sessionRepository.save(any(ReasoningAssessmentSession.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(attemptRepository.findByUserEmailAndSubmissionKey(anyString(), anyString()))
                .thenReturn(Optional.empty());
        for (String difficulty : List.of("BEGINNER", "INTERMEDIATE", "ADVANCED")) {
            when(questionRepository.findByDifficulty(difficulty)).thenReturn(List.of(
                    ReasoningQuestion.builder().id(difficulty).difficulty(difficulty)
                            .question("Question").options(List.of("A", "B")).correctAnswer("A").build()));
        }

        assertEquals(10, service.startQuiz("BEGINNER", "candidate@example.test").getDurationMinutes());
        assertEquals(15, service.startQuiz("INTERMEDIATE", "candidate@example.test").getDurationMinutes());
        assertEquals(20, service.startQuiz("ADVANCED", "candidate@example.test").getDurationMinutes());
    }

    @Test
    void lateSubmissionIsRejectedWithoutSavingAttemptOrAwardingXp() {
        ReasoningAssessmentSession expired = ReasoningAssessmentSession.builder()
                .id("session")
                .userEmail("candidate@example.test")
                .difficulty("BEGINNER")
                .submissionKey("server-key")
                .status("ACTIVE")
                .startedAt(Instant.now().minusSeconds(601))
                .deadlineAt(Instant.now().minusSeconds(1))
                .questions(List.of())
                .build();
        when(attemptRepository.findByUserEmailAndSubmissionKey("candidate@example.test", "server-key"))
                .thenReturn(Optional.empty());
        when(sessionRepository.findById(anyString())).thenReturn(Optional.of(expired));

        assertThrows(com.skillquest.exception.AssessmentExpiredException.class, () -> service.submitQuiz(
                "candidate@example.test",
                ReasoningSubmitRequest.builder().difficulty("BEGINNER").submissionKey("server-key")
                        .timeTakenSeconds(0).answers(Map.of()).build()));

        assertEquals("EXPIRED", expired.getStatus());
        verify(sessionRepository).save(expired);
        verify(attemptRepository, never()).insert(any(ReasoningAttempt.class));
        verify(userRepository, never()).save(any());
    }

    @Test
    void duplicateSubmissionReturnsSavedResultWithoutAwardingXpAgain() {
        ReasoningAttempt previous = ReasoningAttempt.builder()
                .id("server-key").userEmail("candidate@example.test").difficulty("BEGINNER")
                .score(8).totalQuestions(10).accuracy(80).passed(true).earnedXp(68)
                .timeTakenSeconds(60).build();
        when(attemptRepository.findByUserEmailAndSubmissionKey("candidate@example.test", "server-key"))
                .thenReturn(Optional.of(previous));

        ReasoningResultResponse result = service.submitQuiz("candidate@example.test",
                ReasoningSubmitRequest.builder().difficulty("BEGINNER").submissionKey("server-key").build());

        assertEquals(8, result.getScore());
        assertEquals(68, result.getEarnedXp());
        verify(attemptRepository, never()).insert(any(ReasoningAttempt.class));
        verify(userRepository, never()).save(any());
        verify(sessionRepository, never()).save(any(ReasoningAssessmentSession.class));
    }
}
