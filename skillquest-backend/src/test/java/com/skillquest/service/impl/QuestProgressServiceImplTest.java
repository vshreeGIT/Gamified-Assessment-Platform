package com.skillquest.service.impl;

import com.skillquest.entity.*;
import com.skillquest.config.InterviewProgressionBypass;
import com.skillquest.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class QuestProgressServiceImplTest {
    private static final String EMAIL = "progress@example.test";
    private UserRepository users; private CodingAttemptRepository coding; private CodingAssessmentSessionRepository codingSessions; private ReasoningAttemptRepository reasoning;
    private CommunicationAttemptRepository communication; private DataDetectiveAttemptRepository data;
    private TeamworkAttemptRepository teamwork; private InterviewAttemptRepository interview;
    private InterviewAssessmentSessionRepository interviewSessions; private QuestProgressServiceImpl service;
    @BeforeEach void setup() {
        users = mock(UserRepository.class); coding = mock(CodingAttemptRepository.class); codingSessions = mock(CodingAssessmentSessionRepository.class); reasoning = mock(ReasoningAttemptRepository.class);
        communication = mock(CommunicationAttemptRepository.class); data = mock(DataDetectiveAttemptRepository.class); teamwork = mock(TeamworkAttemptRepository.class);
        interview = mock(InterviewAttemptRepository.class); interviewSessions = mock(InterviewAssessmentSessionRepository.class);
        service = new QuestProgressServiceImpl(users, coding, codingSessions, reasoning,
                mock(ReasoningAssessmentSessionRepository.class), communication, mock(CommunicationAssessmentSessionRepository.class),
                data, mock(DataDetectiveSessionRepository.class), teamwork, mock(TeamworkAssessmentSessionRepository.class), interview, interviewSessions,
                new InterviewProgressionBypass(false));
        when(users.findByEmail(EMAIL)).thenReturn(Optional.of(user(749)));
        when(coding.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        when(reasoning.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        when(communication.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        when(data.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        when(teamwork.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        when(interview.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
    }
    @Test void below750XpStaysLockedEvenWithAllFiveSavedAttempts() {
        allAttempts();
        assertEquals("LOCKED", service.getProgress(EMAIL).getQuests().get("interview").getStatus());
        assertTrue(service.getProgress(EMAIL).getQuests().get("interview").getMissingPrerequisites().get(0).contains("749 / 750"));
        assertThrows(AccessDeniedException.class, () -> service.requireInterviewUnlocked(EMAIL));
    }
    @Test void xpThresholdDoesNotReplaceAnyMissingQuest() {
        when(users.findByEmail(EMAIL)).thenReturn(Optional.of(user(750)));
        when(coding.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(codingAttempt()));
        when(reasoning.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(ReasoningAttempt.builder().passed(false).build()));
        when(communication.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(CommunicationAttempt.builder().passed(false).build()));
        when(data.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(DataDetectiveAttempt.builder().passed(false).build()));
        assertEquals("LOCKED", service.getProgress(EMAIL).getQuests().get("interview").getStatus());
        assertEquals(4, service.getProgress(EMAIL).getCompletedRequiredQuests());
        assertTrue(service.getProgress(EMAIL).getQuests().get("interview").getMissingPrerequisites().get(1).contains("Teamwork Mission"));
    }
    @Test void eachOfTheFiveQuestRecordsIsIndividuallyRequired() {
        when(users.findByEmail(EMAIL)).thenReturn(Optional.of(user(900)));
        allAttempts();
        assertEquals("AVAILABLE", service.getProgress(EMAIL).getQuests().get("interview").getStatus());
        when(coding.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        assertLockedWithFourCompleted();
        allAttempts();
        when(reasoning.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        assertLockedWithFourCompleted();
        allAttempts();
        when(communication.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        assertLockedWithFourCompleted();
        allAttempts();
        when(data.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        assertLockedWithFourCompleted();
        allAttempts();
        when(teamwork.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        assertLockedWithFourCompleted();
    }
    @Test void unlocksAt750WithOnePersistedAttemptPerQuestRegardlessOfPassingScore() {
        when(users.findByEmail(EMAIL)).thenReturn(Optional.of(user(750)));
        allAttempts();
        assertEquals("AVAILABLE", service.getProgress(EMAIL).getQuests().get("interview").getStatus());
        assertDoesNotThrow(() -> service.requireInterviewUnlocked(EMAIL));
    }
    @Test void startedSessionsDoNotCountButSavedCodingAttemptDoesAndUserXpIsNotRecomputed() {
        when(users.findByEmail(EMAIL)).thenReturn(Optional.of(user(900)));
        when(codingSessions.findById(anyString())).thenReturn(Optional.of(CodingAssessmentSession.builder().status("ACTIVE").deadlineAt(java.time.Instant.now().plusSeconds(300)).build()));
        assertEquals(0, service.getProgress(EMAIL).getCompletedRequiredQuests());
        assertEquals("AVAILABLE", service.getProgress(EMAIL).getQuests().get("coding").getStatus());
        assertEquals(900, service.getProgress(EMAIL).getTotalXp());
        when(coding.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(codingAttempt()));
        assertEquals("ATTEMPTED", service.getProgress(EMAIL).getQuests().get("coding").getStatus());
        assertEquals(1, service.getProgress(EMAIL).getCompletedRequiredQuests());
        verify(users, never()).save(any());
    }
    @Test void everyNonInterviewQuestRemainsAccessibleWithNoPrerequisites() {
        var quests = service.getProgress(EMAIL).getQuests();
        for (String key : List.of("coding", "reasoning", "communication", "data-detective", "teamwork")) assertNotEquals("LOCKED", quests.get(key).getStatus(), key);
    }
    @Test void interviewAttemptProgressIsDerivedFromSavedResults() {
        when(users.findByEmail(EMAIL)).thenReturn(Optional.of(user(900)));
        allAttempts();
        when(interview.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(InterviewAttempt.builder().accuracy(65).passed(false).build()));
        assertEquals("ATTEMPTED", service.getProgress(EMAIL).getQuests().get("interview").getStatus());
        assertEquals(1, service.getProgress(EMAIL).getQuests().get("interview").getAttemptCount());
        when(interview.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(InterviewAttempt.builder().accuracy(80).passed(true).build()));
        assertEquals("PASSED", service.getProgress(EMAIL).getQuests().get("interview").getStatus());
    }
    @Test void temporaryBypassMakesInterviewAvailableWhileKeepingActualProgressCounts() {
        QuestProgressServiceImpl testingService = new QuestProgressServiceImpl(users, coding, codingSessions, reasoning,
                mock(ReasoningAssessmentSessionRepository.class), communication, mock(CommunicationAssessmentSessionRepository.class),
                data, mock(DataDetectiveSessionRepository.class), teamwork, mock(TeamworkAssessmentSessionRepository.class), interview, interviewSessions,
                new InterviewProgressionBypass(true));
        var progress = testingService.getProgress(EMAIL);
        assertTrue(progress.isInterviewProgressionBypassed());
        assertEquals("AVAILABLE", progress.getQuests().get("interview").getStatus());
        assertTrue(progress.getQuests().get("interview").getMissingPrerequisites().isEmpty());
        assertEquals(0, progress.getCompletedRequiredQuests());
        assertDoesNotThrow(() -> testingService.requireInterviewUnlocked(EMAIL));
        for (String key : List.of("coding", "reasoning", "communication", "data-detective", "teamwork"))
            assertNotEquals("LOCKED", progress.getQuests().get(key).getStatus(), key);
    }
    private void allAttempts() {
        when(coding.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(codingAttempt()));
        when(reasoning.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(ReasoningAttempt.builder().passed(false).accuracy(20).build()));
        when(communication.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(CommunicationAttempt.builder().passed(false).accuracy(10).build()));
        when(data.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(DataDetectiveAttempt.builder().passed(false).investigationId("sales-revenue").build()));
        when(teamwork.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(TeamworkAttempt.builder().passed(false).accuracy(0).build()));
    }
    private void assertLockedWithFourCompleted() {
        var response = service.getProgress(EMAIL);
        assertEquals("LOCKED", response.getQuests().get("interview").getStatus());
        assertEquals(4, response.getCompletedRequiredQuests());
    }
    private User user(int xp) { User u = new User(); u.setEmail(EMAIL); u.setXp(xp); return u; }
    private CodingAttempt codingAttempt() { return CodingAttempt.builder().id("id").userEmail(EMAIL).sessionKey("key").completedAt(java.time.Instant.now()).submittedCode("submitted").build(); }
}
