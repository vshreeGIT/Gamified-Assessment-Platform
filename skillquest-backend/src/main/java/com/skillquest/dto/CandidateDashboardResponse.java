package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateDashboardResponse {

    private String fullName;
    private String email;
    private String role;
    private int xp;
    private int level;
    private String levelTitle;
    private int currentLevelBaseXp;
    private int nextLevelXp;
    private int xpToNextLevel;
    private int completedChallengesCount;
    private int totalChallengesCount;
    private int badgesEarnedCount;
    private Integer leaderboardRank;
    private List<BadgeDto> badges;
    private List<RecentAttemptDto> recentAttempts;
    private Map<String, Integer> reasoningProgress;
    private int communicationProgress;
    private Map<String, Integer> communicationProgressBySubdivision;
    private int communicationAttemptsCount;
    private int communicationXp;
    private int communicationCompletedSubdivisions;
    private int dataDetectiveProgress;
    private Map<String, Integer> dataDetectiveProgressByInvestigation;
    private int dataDetectiveAttemptsCount;
    private int dataDetectiveXp;
    private int dataDetectiveCompletedInvestigations;
}
