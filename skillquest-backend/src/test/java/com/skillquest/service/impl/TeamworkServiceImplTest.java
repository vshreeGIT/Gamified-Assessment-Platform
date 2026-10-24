package com.skillquest.service.impl;

import com.skillquest.dto.TeamworkSubmitRequest;
import com.skillquest.entity.TeamworkAssessmentSession;
import com.skillquest.entity.TeamworkAttempt;
import com.skillquest.repository.TeamworkAssessmentSessionRepository;
import com.skillquest.repository.TeamworkAttemptRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.dao.DuplicateKeyException;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TeamworkServiceImplTest {
    private static final String EMAIL = "team@example.test";
    private TeamworkAssessmentSessionRepository sessions;
    private TeamworkAttemptRepository attempts;
    private TeamworkServiceImpl service;

    @BeforeEach
    void setup() {
        sessions = mock(TeamworkAssessmentSessionRepository.class);
        attempts = mock(TeamworkAttemptRepository.class);
        service = new TeamworkServiceImpl(sessions, attempts);
        when(sessions.save(any())).thenAnswer(call -> call.getArgument(0));
        when(sessions.findById(anyString())).thenReturn(Optional.empty());
        when(attempts.findByUserEmailAndSubmissionKey(anyString(), anyString())).thenReturn(Optional.empty());
    }

    @Test
    void startingIsAvailableWithoutOtherQuestProgress() {
        assertNotNull(service.start(EMAIL));
        verify(sessions).save(any(TeamworkAssessmentSession.class));
    }

    @Test
    void serverScoresAndSavesPassingAttemptWithoutChangingXp() {
        var quiz = service.start(EMAIL);
        TeamworkAssessmentSession session = TeamworkAssessmentSession.builder()
                .id(sessionId()).userEmail(EMAIL).submissionKey(quiz.getSubmissionKey()).status("ACTIVE").build();
        when(sessions.findById(sessionId())).thenReturn(Optional.of(session));
        TeamworkSubmitRequest request = request(quiz.getSubmissionKey(), Map.of("T1", "C", "T2", "B", "T3", "C", "T4", "A", "T5", "A"));

        var result = service.submit(EMAIL, request);

        assertEquals(4, result.getScore());
        assertEquals(80, result.getAccuracy());
        assertTrue(result.isPassed());
        ArgumentCaptor<TeamworkAttempt> captor = ArgumentCaptor.forClass(TeamworkAttempt.class);
        verify(attempts).insert(captor.capture());
        assertTrue(captor.getValue().isPassed());
        assertEquals(4, captor.getValue().getScore());
        verify(sessions).save(argThat(saved -> "COMPLETED".equals(saved.getStatus())));
    }

    @Test
    void duplicateSubmissionReturnsSavedAttemptWithoutInsertingAgain() {
        TeamworkAttempt stored = TeamworkAttempt.builder().id("existing-key").submissionKey("existing-key")
                .userEmail(EMAIL).score(4).totalQuestions(5).accuracy(80).passed(true).build();
        when(attempts.findByUserEmailAndSubmissionKey(EMAIL, "existing-key")).thenReturn(Optional.of(stored));

        var result = service.submit(EMAIL, request("existing-key", Map.of()));

        assertEquals("existing-key", result.getAttemptId());
        assertEquals(80, result.getAccuracy());
        verify(attempts, never()).insert(any(TeamworkAttempt.class));
    }

    @Test
    void questionPayloadDoesNotExposeCorrectChoice() {
        var quiz = service.start(EMAIL);
        assertEquals(5, quiz.getQuestions().size());
        assertTrue(quiz.getQuestions().stream().flatMap(question -> question.getChoices().stream())
                .noneMatch(choice -> choice.getId().equalsIgnoreCase("correct")));
    }

    private String sessionId() {
        return java.util.UUID.nameUUIDFromBytes((EMAIL + "|TEAMWORK").getBytes(java.nio.charset.StandardCharsets.UTF_8)).toString();
    }

    private TeamworkSubmitRequest request(String key, Map<String, String> answers) {
        TeamworkSubmitRequest request = new TeamworkSubmitRequest();
        request.setSubmissionKey(key);
        request.setAnswers(answers);
        return request;
    }
}
