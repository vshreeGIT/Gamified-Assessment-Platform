package com.skillquest.service.impl;

import com.skillquest.dto.DataDetectiveSubmitRequest;
import com.skillquest.entity.DataDetectiveAttempt;
import com.skillquest.entity.DataDetectiveSession;
import com.skillquest.entity.User;
import com.skillquest.exception.AssessmentExpiredException;
import com.skillquest.repository.DataDetectiveAttemptRepository;
import com.skillquest.repository.DataDetectiveSessionRepository;
import com.skillquest.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class DataDetectiveServiceImplTest {
    private static final String EMAIL = "data-candidate@example.test";
    private DataDetectiveSessionRepository sessionRepository;
    private DataDetectiveAttemptRepository attemptRepository;
    private UserRepository userRepository;
    private DataDetectiveServiceImpl service;

    @BeforeEach
    void setUp() {
        sessionRepository = mock(DataDetectiveSessionRepository.class);
        attemptRepository = mock(DataDetectiveAttemptRepository.class);
        userRepository = mock(UserRepository.class);
        service = new DataDetectiveServiceImpl(sessionRepository, attemptRepository, userRepository);
    }

    @Test
    void investigationsHaveIndependentTenMinuteSessions() {
        Map<String, DataDetectiveSession> saved = new java.util.HashMap<>();
        when(sessionRepository.findById(anyString())).thenAnswer(call -> Optional.ofNullable(saved.get(call.getArgument(0))));
        when(sessionRepository.save(any())).thenAnswer(call -> {
            DataDetectiveSession session = call.getArgument(0);
            saved.put(session.getId(), session);
            return session;
        });

        var sales = service.start("sales-revenue", EMAIL);
        var customer = service.start("customer-behaviour", EMAIL);

        assertNotEquals(saved.get(sessionId("sales-revenue")).getSubmissionKey(), saved.get(sessionId("customer-behaviour")).getSubmissionKey());
        assertEquals(600, Duration.between(saved.get(sessionId("sales-revenue")).getStartedAt(), sales.getDeadlineAt()).getSeconds());
        assertEquals(600, Duration.between(saved.get(sessionId("customer-behaviour")).getStartedAt(), customer.getDeadlineAt()).getSeconds());
        assertNotEquals(saved.get(sessionId("sales-revenue")).getId(), saved.get(sessionId("customer-behaviour")).getId());
    }

    @Test
    void lateSubmissionIsRejectedWithoutSavingAttemptOrXp() {
        var started = service.start("sales-revenue", EMAIL);
        DataDetectiveSession session = capturedSession();
        session.setDeadlineAt(Instant.now().minusSeconds(1));
        when(sessionRepository.findById(session.getId())).thenReturn(Optional.of(session));
        when(attemptRepository.findByUserEmailAndId(EMAIL, started.getSubmissionKey())).thenReturn(Optional.empty());
        DataDetectiveSubmitRequest request = request(started.getSubmissionKey(), Map.of());

        assertThrows(AssessmentExpiredException.class, () -> service.submit("sales-revenue", EMAIL, request));
        verify(attemptRepository, never()).insert(any(DataDetectiveAttempt.class));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void serverScoresAnswersAndAwardsScoreProportionalXp() {
        var started = service.start("sales-revenue", EMAIL);
        DataDetectiveSession session = capturedSession();
        when(sessionRepository.findById(session.getId())).thenReturn(Optional.of(session));
        when(attemptRepository.findByUserEmailAndId(EMAIL, started.getSubmissionKey())).thenReturn(Optional.empty());
        User user = new User();
        user.setEmail(EMAIL);
        user.setXp(10);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        DataDetectiveSubmitRequest request = request(started.getSubmissionKey(), Map.of(
                "trend", "INCREASE", "growth", "March-April", "order-value", "60.0",
                "dip", "March", "action", "Assume the dip is a data-entry error"));

        var result = service.submit("sales-revenue", EMAIL, request);

        assertEquals(4, result.getScore());
        assertEquals(80, result.getAccuracy());
        assertTrue(result.isPassed());
        assertEquals(96, result.getEarnedXp());
        assertEquals(106, user.getXp());
        verify(userRepository).save(user);
        verify(sessionRepository, atLeastOnce()).save(argThat(saved -> "COMPLETED".equals(saved.getStatus())));
        ArgumentCaptor<DataDetectiveAttempt> attempt = ArgumentCaptor.forClass(DataDetectiveAttempt.class);
        verify(attemptRepository).insert(attempt.capture());
        assertEquals(request.getAnswers(), attempt.getValue().getAnswers());
    }

    @Test
    void duplicateSubmissionReturnsStoredResultWithoutAwardingXpAgain() {
        DataDetectiveAttempt previous = DataDetectiveAttempt.builder().id("saved-key").userEmail(EMAIL)
                .investigationId("product-performance").score(4).maxScore(5).accuracy(80)
                .passed(true).earnedXp(96).build();
        when(attemptRepository.findByUserEmailAndId(EMAIL, "saved-key")).thenReturn(Optional.of(previous));

        var result = service.submit("product-performance", EMAIL, request("saved-key", Map.of()));

        assertEquals("saved-key", result.getAttemptId());
        assertEquals(96, result.getEarnedXp());
        verify(attemptRepository, never()).insert(any(DataDetectiveAttempt.class));
        verify(userRepository, never()).save(any(User.class));
    }

    private String sessionId(String investigationId) {
        return UUID.nameUUIDFromBytes((EMAIL + "|" + investigationId).getBytes(StandardCharsets.UTF_8)).toString();
    }

    private DataDetectiveSession capturedSession() {
        ArgumentCaptor<DataDetectiveSession> captor = ArgumentCaptor.forClass(DataDetectiveSession.class);
        verify(sessionRepository).save(captor.capture());
        return captor.getValue();
    }

    private DataDetectiveSubmitRequest request(String key, Map<String, String> answers) {
        DataDetectiveSubmitRequest request = new DataDetectiveSubmitRequest();
        request.setSubmissionKey(key);
        request.setAnswers(answers);
        return request;
    }
}
