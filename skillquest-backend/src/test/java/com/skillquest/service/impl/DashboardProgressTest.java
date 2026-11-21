package com.skillquest.service.impl;

import com.skillquest.entity.ReasoningAttempt;
import com.skillquest.entity.CommunicationAttempt;
import com.skillquest.entity.DataDetectiveAttempt;
import com.skillquest.entity.CodingAttempt;
import com.skillquest.entity.User;
import com.skillquest.dto.BadgeDto;
import com.skillquest.repository.CommunicationAttemptRepository;
import com.skillquest.repository.DataDetectiveAttemptRepository;
import com.skillquest.repository.CodingAttemptRepository;
import com.skillquest.repository.InterviewAttemptRepository;
import com.skillquest.repository.ReasoningAttemptRepository;
import com.skillquest.repository.TeamworkAttemptRepository;
import com.skillquest.repository.UserRepository;
import com.skillquest.service.RecruiterService;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
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

        var dashboard = buildService(userRepository, attemptRepository, communicationAttemptRepository, dataDetectiveAttemptRepository).getCandidateDashboard(EMAIL);

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

        var dashboard = buildService(userRepository, attemptRepository, communicationAttemptRepository, dataDetectiveAttemptRepository).getCandidateDashboard(EMAIL);

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

        var dashboard = buildService(userRepository, attemptRepository, communicationAttemptRepository, dataDetectiveAttemptRepository).getCandidateDashboard(EMAIL);

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

        var dashboard = buildService(userRepository, attemptRepository, communicationAttemptRepository, dataDetectiveAttemptRepository).getCandidateDashboard(EMAIL);

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

        var dashboard = buildService(userRepository, attemptRepository, communicationAttemptRepository, dataDetectiveAttemptRepository).getCandidateDashboard(EMAIL);

        assertEquals(33, dashboard.getDataDetectiveProgress());
        assertEquals(1, dashboard.getDataDetectiveCompletedInvestigations());
        assertEquals(1, dashboard.getDataDetectiveAttemptsCount());
        assertEquals(96, dashboard.getDataDetectiveXp());
        assertEquals(100, dashboard.getDataDetectiveProgressByInvestigation().get("sales-revenue"));
        assertEquals(0, dashboard.getDataDetectiveProgressByInvestigation().get("customer-behaviour"));
        assertEquals("Data Detective", dashboard.getRecentAttempts().get(0).getQuestType());
    }

    @Test
    void completedChallengesCountsUniqueNotRepeatedAttempts() {
        UserRepository userRepository = mock(UserRepository.class);
        ReasoningAttemptRepository attemptRepository = mock(ReasoningAttemptRepository.class);
        CommunicationAttemptRepository communicationAttemptRepository = mock(CommunicationAttemptRepository.class);
        DataDetectiveAttemptRepository dataDetectiveAttemptRepository = mock(DataDetectiveAttemptRepository.class);
        User user = candidate();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(userRepository.findAll()).thenReturn(List.of(user));
        // 6 reasoning attempts but only 2 unique difficulties
        when(attemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(
                ReasoningAttempt.builder().difficulty("BEGINNER").build(),
                ReasoningAttempt.builder().difficulty("BEGINNER").build(),
                ReasoningAttempt.builder().difficulty("BEGINNER").build(),
                ReasoningAttempt.builder().difficulty("INTERMEDIATE").build(),
                ReasoningAttempt.builder().difficulty("INTERMEDIATE").build(),
                ReasoningAttempt.builder().difficulty("INTERMEDIATE").build()));
        // 2 communication attempts for the same subdivision
        when(communicationAttemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(
                CommunicationAttempt.builder().subdivisionId("office-team").passed(true).earnedXp(70).build(),
                CommunicationAttempt.builder().subdivisionId("office-team").passed(true).earnedXp(70).build()));
        when(dataDetectiveAttemptRepository.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());

        var dashboard = buildService(userRepository, attemptRepository,
                communicationAttemptRepository, dataDetectiveAttemptRepository).getCandidateDashboard(EMAIL);

        // 2 unique reasoning + 1 unique comm subdivision + 0 data detective = 3
        assertEquals(3, dashboard.getCompletedChallengesCount());
        assertEquals(14, dashboard.getTotalChallengesCount());
        assertEquals(false, dashboard.getBadges().stream().filter(badge -> badge.getName().equals("Goal Getter"))
                .findFirst().orElseThrow().isEarned());
    }

    @Test
        void totalChallengesCountIncludesAllPersistedChallengeModules() {
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

        var dashboard = buildService(userRepository, attemptRepository,
                communicationAttemptRepository, dataDetectiveAttemptRepository).getCandidateDashboard(EMAIL);

        assertEquals(0, dashboard.getCompletedChallengesCount());
        assertEquals(14, dashboard.getTotalChallengesCount());
    }

        @Test
        void codeStarterBadgeUsesSavedCodingActivityWithoutClaimingEvaluation() {
                UserRepository userRepository = mock(UserRepository.class);
                ReasoningAttemptRepository reasoning = mock(ReasoningAttemptRepository.class);
                CommunicationAttemptRepository communication = mock(CommunicationAttemptRepository.class);
                DataDetectiveAttemptRepository data = mock(DataDetectiveAttemptRepository.class);
                CodingAttemptRepository coding = mock(CodingAttemptRepository.class);
                User user = candidate();
                when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
                when(userRepository.findAll()).thenReturn(List.of(user));
                when(reasoning.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
                when(communication.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
                when(data.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
                when(coding.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of(CodingAttempt.builder()
                                .id("code-1").userEmail(EMAIL).submittedCode("response").build()));

                var dashboard = buildService(userRepository, reasoning, communication, data, coding).getCandidateDashboard(EMAIL);
                BadgeDto codeStarter = dashboard.getBadges().stream().filter(badge -> badge.getName().equals("Code Starter"))
                                .findFirst().orElseThrow();

                assertTrue(codeStarter.isEarned());
                assertTrue(codeStarter.getXpText().contains("saved coding response"));
                assertEquals(1, dashboard.getCompletedChallengesCount());
                assertEquals(14, dashboard.getTotalChallengesCount());
        }

    private DashboardServiceImpl buildService(
            UserRepository userRepository,
            ReasoningAttemptRepository attemptRepository,
            CommunicationAttemptRepository communicationAttemptRepository,
            DataDetectiveAttemptRepository dataDetectiveAttemptRepository) {
        CodingAttemptRepository codingAttempts = mock(CodingAttemptRepository.class);
                when(codingAttempts.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        return buildService(userRepository, attemptRepository, communicationAttemptRepository,
                dataDetectiveAttemptRepository, codingAttempts);
    }

    private DashboardServiceImpl buildService(
            UserRepository userRepository,
            ReasoningAttemptRepository attemptRepository,
            CommunicationAttemptRepository communicationAttemptRepository,
            DataDetectiveAttemptRepository dataDetectiveAttemptRepository,
            CodingAttemptRepository codingAttempts) {
        TeamworkAttemptRepository teamworkAttempts = mock(TeamworkAttemptRepository.class);
        InterviewAttemptRepository interviewAttempts = mock(InterviewAttemptRepository.class);
        when(teamworkAttempts.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        when(interviewAttempts.findByUserEmailOrderByCompletedAtDesc(EMAIL)).thenReturn(List.of());
        RecruiterService recruiterService = mock(RecruiterService.class);
        when(recruiterService.assignedAssessmentsForCandidate(anyString())).thenReturn(List.of());
        return new DashboardServiceImpl(userRepository, attemptRepository,
                communicationAttemptRepository, dataDetectiveAttemptRepository, codingAttempts,
                teamworkAttempts, interviewAttempts, recruiterService);
    }

    private User candidate() {
        User user = new User();
        user.setEmail(EMAIL);
        user.setXp(0);
        user.setLevel(1);
        return user;
    }
}
