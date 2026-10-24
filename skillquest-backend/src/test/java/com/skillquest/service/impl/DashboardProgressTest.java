package com.skillquest.service.impl;

import com.skillquest.entity.ReasoningAttempt;
import com.skillquest.entity.CommunicationAttempt;
import com.skillquest.entity.DataDetectiveAttempt;
import com.skillquest.entity.User;
import com.skillquest.repository.CommunicationAttemptRepository;
import com.skillquest.repository.DataDetectiveAttemptRepository;
import com.skillquest.repository.ReasoningAttemptRepository;
import com.skillquest.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class DashboardProgressTest {

    private static final String EMAIL = "candidate@example.test";

    @Test
    void progressIsIndependentForEachDifficulty() {
        UserRepository userRepository = mock(UserRepository.class);
        ReasoningAttemptRepository attemptRepository = mock(ReasoningAttemptRepository.class);
        CommunicationAttemptRepository communicationAttemptRepository = mock(CommunicationAttemptRepository.class);
        DataDetectiveAttemptRepository dataDetectiveAttemptRepository = mock(DataDetectiveAttemptRepository.class);
        User user = candidate();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(userRepository.findAll()).thenReturn(List.of(user));
        when(attemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(
                ReasoningAttempt.builder().difficulty("BEGINNER").build()));
        when(communicationAttemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        when(dataDetectiveAttemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());

        var dashboard = new DashboardServiceImpl(userRepository, attemptRepository, communicationAttemptRepository, dataDetectiveAttemptRepository).getCandidateDashboard(EMAIL);

        assertEquals(Map.of("beginner", 100, "intermediate", 0, "advanced", 0), dashboard.getReasoningProgress());
    }

    @Test
    void noAttemptsMeansZeroProgressAtEveryDifficulty() {
        UserRepository userRepository = mock(UserRepository.class);
        ReasoningAttemptRepository attemptRepository = mock(ReasoningAttemptRepository.class);
        CommunicationAttemptRepository communicationAttemptRepository = mock(CommunicationAttemptRepository.class);
        DataDetectiveAttemptRepository dataDetectiveAttemptRepository = mock(DataDetectiveAttemptRepository.class);
        User user = candidate();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(userRepository.findAll()).thenReturn(List.of(user));
        when(attemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        when(communicationAttemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        when(dataDetectiveAttemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());

        var dashboard = new DashboardServiceImpl(userRepository, attemptRepository, communicationAttemptRepository, dataDetectiveAttemptRepository).getCandidateDashboard(EMAIL);

        assertEquals(Map.of("beginner", 0, "intermediate", 0, "advanced", 0), dashboard.getReasoningProgress());
        assertEquals(0, dashboard.getCommunicationProgress());
        assertEquals(false, dashboard.getBadges().stream().filter(badge -> badge.getName().equals("Communication Pro"))
                .findFirst().orElseThrow().isEarned());
    }

    @Test
    void intermediateAndAdvancedAttemptsDoNotMarkBeginnerComplete() {
        UserRepository userRepository = mock(UserRepository.class);
        ReasoningAttemptRepository attemptRepository = mock(ReasoningAttemptRepository.class);
        CommunicationAttemptRepository communicationAttemptRepository = mock(CommunicationAttemptRepository.class);
        DataDetectiveAttemptRepository dataDetectiveAttemptRepository = mock(DataDetectiveAttemptRepository.class);
        User user = candidate();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(userRepository.findAll()).thenReturn(List.of(user));
        when(attemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(
                ReasoningAttempt.builder().difficulty("INTERMEDIATE").build(),
                ReasoningAttempt.builder().difficulty("ADVANCED").build()));
        when(communicationAttemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        when(dataDetectiveAttemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());

        var dashboard = new DashboardServiceImpl(userRepository, attemptRepository, communicationAttemptRepository, dataDetectiveAttemptRepository).getCandidateDashboard(EMAIL);

        assertEquals(Map.of("beginner", 0, "intermediate", 100, "advanced", 100), dashboard.getReasoningProgress());
    }

    @Test
    void communicationProgressAndBadgeUsePersistedAttempts() {
        UserRepository userRepository = mock(UserRepository.class);
        ReasoningAttemptRepository attemptRepository = mock(ReasoningAttemptRepository.class);
        CommunicationAttemptRepository communicationAttemptRepository = mock(CommunicationAttemptRepository.class);
        DataDetectiveAttemptRepository dataDetectiveAttemptRepository = mock(DataDetectiveAttemptRepository.class);
        User user = candidate();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(userRepository.findAll()).thenReturn(List.of(user));
        when(attemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        when(communicationAttemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(
                CommunicationAttempt.builder().id("saved-1").subdivisionId("office-team").score(21).maxScore(30).accuracy(70)
                        .passed(true).earnedXp(70).build()));
        when(dataDetectiveAttemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());

        var dashboard = new DashboardServiceImpl(userRepository, attemptRepository, communicationAttemptRepository, dataDetectiveAttemptRepository).getCandidateDashboard(EMAIL);

        assertEquals(100, dashboard.getCommunicationProgress());
        assertEquals(1, dashboard.getCompletedChallengesCount());
        assertEquals(1, dashboard.getCommunicationCompletedSubdivisions());
        assertEquals(70, dashboard.getCommunicationXp());
        assertEquals(1, dashboard.getCommunicationAttemptsCount());
        assertEquals(100, dashboard.getCommunicationProgressBySubdivision().get("office-team"));
        assertEquals(0, dashboard.getCommunicationProgressBySubdivision().get("customer-relations"));
        assertEquals("Communication Quest", dashboard.getRecentAttempts().get(0).getQuestType());
        assertEquals(true, dashboard.getBadges().stream().filter(badge -> badge.getName().equals("Communication Pro"))
                .findFirst().orElseThrow().isEarned());
    }

    @Test
    void dataDetectiveProgressUsesSavedInvestigationsAndXp() {
        UserRepository userRepository = mock(UserRepository.class);
        ReasoningAttemptRepository attemptRepository = mock(ReasoningAttemptRepository.class);
        CommunicationAttemptRepository communicationAttemptRepository = mock(CommunicationAttemptRepository.class);
        DataDetectiveAttemptRepository dataDetectiveAttemptRepository = mock(DataDetectiveAttemptRepository.class);
        User user = candidate();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(userRepository.findAll()).thenReturn(List.of(user));
        when(attemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        when(communicationAttemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        when(dataDetectiveAttemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(
                DataDetectiveAttempt.builder().id("dd-1").investigationId("sales-revenue").score(4).maxScore(5)
                        .accuracy(80).passed(true).earnedXp(96).build()));

        var dashboard = new DashboardServiceImpl(userRepository, attemptRepository, communicationAttemptRepository,
                dataDetectiveAttemptRepository).getCandidateDashboard(EMAIL);

        assertEquals(33, dashboard.getDataDetectiveProgress());
        assertEquals(1, dashboard.getDataDetectiveCompletedInvestigations());
        assertEquals(1, dashboard.getDataDetectiveAttemptsCount());
        assertEquals(96, dashboard.getDataDetectiveXp());
        assertEquals(100, dashboard.getDataDetectiveProgressByInvestigation().get("sales-revenue"));
        assertEquals(0, dashboard.getDataDetectiveProgressByInvestigation().get("customer-behaviour"));
        assertEquals("Data Detective", dashboard.getRecentAttempts().get(0).getQuestType());
    }

    private User candidate() {
        User user = new User();
        user.setEmail(EMAIL);
        user.setXp(0);
        user.setLevel(1);
        return user;
    }
}
