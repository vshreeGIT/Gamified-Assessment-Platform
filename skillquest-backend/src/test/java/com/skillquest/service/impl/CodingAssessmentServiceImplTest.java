package com.skillquest.service.impl;

import com.skillquest.dto.CodingSubmitRequest;
import com.skillquest.entity.CodingAssessmentSession;
import com.skillquest.entity.CodingAttempt;
import com.skillquest.repository.CodingAssessmentSessionRepository;
import com.skillquest.repository.CodingAttemptRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.Instant;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CodingAssessmentServiceImplTest {
    private static final String EMAIL = "coder@example.test";
    private CodingAssessmentSessionRepository sessions;
    private CodingAttemptRepository attempts;
    private CodingAssessmentServiceImpl service;
    @BeforeEach void setup() {
        sessions = mock(CodingAssessmentSessionRepository.class); attempts = mock(CodingAttemptRepository.class);
        service = new CodingAssessmentServiceImpl(sessions, attempts);
        when(sessions.save(any())).thenAnswer(call -> call.getArgument(0));
        when(sessions.findById(anyString())).thenReturn(Optional.empty());
        when(attempts.findByUserEmailAndSessionKey(anyString(), anyString())).thenReturn(Optional.empty());
    }
    @Test void startCreatesIndependentServerDeadlineAndRefreshReusesIt() {
        var created = service.start(EMAIL, "java", "variables", "easy");
        var persisted = CodingAssessmentSession.builder().id(sessionId()).userEmail(EMAIL).sessionKey(created.getSessionKey()).language("java").concept("variables").difficulty("easy").startedAt(created.getStartedAt()).deadlineAt(created.getDeadlineAt()).status("ACTIVE").build();
        when(sessions.findById(sessionId())).thenReturn(Optional.of(persisted));
        var refreshed = service.start(EMAIL, "java", "variables", "easy");
        assertEquals(created.getSessionKey(), refreshed.getSessionKey());
        assertEquals(created.getDeadlineAt(), refreshed.getDeadlineAt());
    }
    @Test void persistedSubmissionRecordsCompletionAndDuplicateDoesNotInsertAgain() {
        var session = activeSession(); when(sessions.findById(sessionId())).thenReturn(Optional.of(session));
        var result = service.submit(EMAIL, "java", "variables", "easy", request(session.getSessionKey()));
        assertNotNull(result.getAttemptId());
        assertEquals("COMPLETED", session.getStatus());
        verify(attempts).insert(any(CodingAttempt.class));
        when(attempts.findByUserEmailAndSessionKey(EMAIL, session.getSessionKey())).thenReturn(Optional.of(CodingAttempt.builder().id(session.getSessionKey()).sessionKey(session.getSessionKey()).completedAt(Instant.now()).build()));
        service.submit(EMAIL, "java", "variables", "easy", request(session.getSessionKey()));
        verify(attempts, times(1)).insert(any(CodingAttempt.class));
    }
    @Test void expiredSessionCannotBeSubmitted() {
        CodingAssessmentSession session = activeSession(); session.setDeadlineAt(Instant.now().minusSeconds(1));
        when(sessions.findById(sessionId())).thenReturn(Optional.of(session));
        assertThrows(IllegalArgumentException.class, () -> service.submit(EMAIL, "java", "variables", "easy", request(session.getSessionKey())));
        verify(attempts, never()).insert(any(CodingAttempt.class));
    }
    @Test void clientCannotSupplyCompletionFlagOrInvalidSelectionAsEvidence() {
        var s = service.start(EMAIL, "java", "variables", "easy");
        CodingSubmitRequest request = request(s.getSessionKey()); request.setCode(" ");
        assertThrows(IllegalArgumentException.class, () -> service.submit(EMAIL, "java", "variables", "easy", request));
        assertThrows(IllegalArgumentException.class, () -> service.start(EMAIL, "fake", "variables", "easy"));
        verify(attempts, never()).insert(any(CodingAttempt.class));
    }
    private CodingAssessmentSession activeSession() { var now = Instant.now(); return CodingAssessmentSession.builder().id(sessionId()).userEmail(EMAIL).sessionKey("session-key").language("java").concept("variables").difficulty("easy").startedAt(now).deadlineAt(now.plusSeconds(1200)).status("ACTIVE").build(); }
    private CodingSubmitRequest request(String key) { return new CodingSubmitRequest(key, 1, "class Main { }"); }
    private String sessionId() { return java.util.UUID.nameUUIDFromBytes((EMAIL + "|CODING_ARENA|java|variables|easy").getBytes(java.nio.charset.StandardCharsets.UTF_8)).toString(); }
}
