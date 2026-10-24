package com.skillquest.service.impl;

import com.skillquest.dto.BadgeDto;
import com.skillquest.dto.CandidateDashboardResponse;
import com.skillquest.dto.LeaderboardItemDto;
import com.skillquest.dto.RecentAttemptDto;
import com.skillquest.entity.CommunicationAttempt;
import com.skillquest.entity.DataDetectiveAttempt;
import com.skillquest.entity.ReasoningAttempt;
import com.skillquest.entity.User;
import com.skillquest.repository.CommunicationAttemptRepository;
import com.skillquest.repository.DataDetectiveAttemptRepository;
import com.skillquest.exception.UserNotFoundException;
import com.skillquest.repository.ReasoningAttemptRepository;
import com.skillquest.repository.UserRepository;
import com.skillquest.service.DashboardService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final ReasoningAttemptRepository attemptRepository;
    private final CommunicationAttemptRepository communicationAttemptRepository;
    private final DataDetectiveAttemptRepository dataDetectiveAttemptRepository;

    public DashboardServiceImpl(UserRepository userRepository,
                                ReasoningAttemptRepository attemptRepository,
                                CommunicationAttemptRepository communicationAttemptRepository,
                                DataDetectiveAttemptRepository dataDetectiveAttemptRepository) {
        this.userRepository = userRepository;
        this.attemptRepository = attemptRepository;
        this.communicationAttemptRepository = communicationAttemptRepository;
        this.dataDetectiveAttemptRepository = dataDetectiveAttemptRepository;
    }

    @Override
    public CandidateDashboardResponse getCandidateDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + email));

        List<ReasoningAttempt> attempts = attemptRepository.findByUserEmailOrderByCompletedAtDesc(email);
        List<CommunicationAttempt> communicationAttempts =
                communicationAttemptRepository.findByUserEmailOrderByCompletedAtDesc(email);
        List<DataDetectiveAttempt> dataDetectiveAttempts =
                dataDetectiveAttemptRepository.findByUserEmailOrderByCompletedAtDesc(email);
        Map<String, Integer> communicationProgress = buildCommunicationProgress(communicationAttempts);
        int communicationCompleted = (int) communicationProgress.values().stream().filter(value -> value == 100).count();
        Map<String, Integer> dataDetectiveProgress = buildDataDetectiveProgress(dataDetectiveAttempts);
        int dataDetectiveCompleted = (int) dataDetectiveProgress.values().stream().filter(value -> value == 100).count();

        int xp = user.getXp();
        int level = user.getLevel() > 0 ? user.getLevel() : (xp / 500) + 1;
        String levelTitle = getLevelTitle(level);

        int currentLevelBaseXp = (level - 1) * 500;
        int nextLevelXp = level * 500;
        int xpToNextLevel = Math.max(0, nextLevelXp - xp);

        // Calculate actual leaderboard rank among all users
        List<User> allUsers = userRepository.findAll().stream()
                .sorted(Comparator.comparingInt(User::getXp).reversed())
                .collect(Collectors.toList());

        int rank = 1;
        for (int i = 0; i < allUsers.size(); i++) {
            if (allUsers.get(i).getEmail() != null && allUsers.get(i).getEmail().equalsIgnoreCase(email)) {
                rank = i + 1;
                break;
            }
        }

        // Calculate badges dynamically based on actual achievements
        List<BadgeDto> badges = buildBadges(attempts, communicationAttempts);
        int badgesEarnedCount = (int) badges.stream().filter(BadgeDto::isEarned).count();

        // Recent attempts (up to 5)
        List<RecentAttemptDto> recentAttempts = attempts.stream()
                .map(a -> RecentAttemptDto.builder()
                        .id(a.getId())
                        .questType("Logical Reasoning")
                        .difficulty(a.getDifficulty())
                        .score(a.getScore())
                        .total(a.getTotalQuestions())
                        .accuracy(a.getAccuracy())
                        .earnedXp(a.getEarnedXp())
                        .passed(a.isPassed())
                        .badge(a.getBadge())
                        .completedAt(a.getCompletedAt())
                        .build())
                .collect(Collectors.toList());
        communicationAttempts.stream()
                .map(a -> RecentAttemptDto.builder()
                        .id(a.getId())
                        .questType("Communication Quest")
                        .difficulty(communicationSubdivisionName(a.getSubdivisionId()))
                        .score(a.getScore())
                        .total(a.getMaxScore())
                        .accuracy(a.getAccuracy())
                        .earnedXp(a.getEarnedXp())
                        .passed(a.isPassed())
                        .badge(a.isPassed() ? "Communication Pro" : "Keep Practicing")
                        .completedAt(a.getCompletedAt())
                        .build())
                .forEach(recentAttempts::add);
        dataDetectiveAttempts.stream()
                .map(a -> RecentAttemptDto.builder()
                        .id(a.getId())
                        .questType("Data Detective")
                        .difficulty(dataInvestigationName(a.getInvestigationId()))
                        .score(a.getScore())
                        .total(a.getMaxScore())
                        .accuracy(a.getAccuracy())
                        .earnedXp(a.getEarnedXp())
                        .passed(a.isPassed())
                        .badge(a.isPassed() ? "Data Insight" : "Keep Investigating")
                        .completedAt(a.getCompletedAt())
                        .build())
                .forEach(recentAttempts::add);
        recentAttempts.sort(Comparator.comparing(RecentAttemptDto::getCompletedAt,
                Comparator.nullsLast(Comparator.reverseOrder())));
        recentAttempts = recentAttempts.stream().limit(5).collect(Collectors.toList());

        return CandidateDashboardResponse.builder()
                .fullName(user.getFullName() != null ? user.getFullName() : "Candidate")
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : "CANDIDATE")
                .xp(xp)
                .level(level)
                .levelTitle(levelTitle)
                .currentLevelBaseXp(currentLevelBaseXp)
                .nextLevelXp(nextLevelXp)
                .xpToNextLevel(xpToNextLevel)
                .completedChallengesCount(uniqueReasoningCompleted(attempts) + communicationCompleted + dataDetectiveCompleted)
                .totalChallengesCount(11)
                .badgesEarnedCount(badgesEarnedCount)
                .leaderboardRank(rank)
                .badges(badges)
                .recentAttempts(recentAttempts)
                .reasoningProgress(buildReasoningProgress(attempts))
                .communicationProgress(communicationAttempts.isEmpty() ? 0 : 100)
                .communicationProgressBySubdivision(communicationProgress)
                .communicationAttemptsCount(communicationAttempts.size())
                .communicationXp(communicationAttempts.stream().mapToInt(CommunicationAttempt::getEarnedXp).sum())
                .communicationCompletedSubdivisions(communicationCompleted)
                .dataDetectiveProgress(dataDetectiveCompleted * 100 / dataDetectiveProgress.size())
                .dataDetectiveProgressByInvestigation(dataDetectiveProgress)
                .dataDetectiveAttemptsCount(dataDetectiveAttempts.size())
                .dataDetectiveXp(dataDetectiveAttempts.stream().mapToInt(DataDetectiveAttempt::getEarnedXp).sum())
                .dataDetectiveCompletedInvestigations(dataDetectiveCompleted)
                .build();
    }

    private Map<String, Integer> buildDataDetectiveProgress(List<DataDetectiveAttempt> attempts) {
        List<String> investigations = List.of("sales-revenue", "customer-behaviour", "product-performance");
        return investigations.stream().collect(Collectors.toMap(id -> id, id ->
                attempts.stream().anyMatch(attempt -> id.equals(attempt.getInvestigationId())) ? 100 : 0));
    }

    private String dataInvestigationName(String id) {
        if (id == null) return "Data investigation";
        return switch (id) {
            case "sales-revenue" -> "Sales & Revenue Analysis";
            case "customer-behaviour" -> "Customer Behaviour Analysis";
            case "product-performance" -> "Product Performance Analysis";
            default -> "Data investigation";
        };
    }

    private Map<String, Integer> buildCommunicationProgress(List<CommunicationAttempt> attempts) {
        List<String> subdivisions = List.of("office-team", "customer-relations", "interview-career", "presentations", "conflict-etiquette");
        return subdivisions.stream().collect(Collectors.toMap(id -> id, id ->
                attempts.stream().anyMatch(attempt -> id.equals(attempt.getSubdivisionId())) ? 100 : 0));
    }

    private String communicationSubdivisionName(String subdivisionId) {
        if (subdivisionId == null) return "Workplace";
        return switch (subdivisionId) {
            case "office-team" -> "Office & Team Communication";
            case "customer-relations" -> "Customer Relations";
            case "interview-career" -> "Interview & Career Communication";
            case "presentations" -> "Presentations & Public Speaking";
            case "conflict-etiquette" -> "Conflict Resolution & Workplace Etiquette";
            default -> "Workplace";
        };
    }

    private Map<String, Integer> buildReasoningProgress(List<ReasoningAttempt> attempts) {
        return Map.of(
                "beginner", hasAttempt(attempts, "BEGINNER") ? 100 : 0,
                "intermediate", hasAttempt(attempts, "INTERMEDIATE") ? 100 : 0,
                "advanced", hasAttempt(attempts, "ADVANCED") ? 100 : 0
        );
    }

    private int uniqueReasoningCompleted(List<ReasoningAttempt> attempts) {
        int count = 0;
        if (hasAttempt(attempts, "BEGINNER"))     count++;
        if (hasAttempt(attempts, "INTERMEDIATE")) count++;
        if (hasAttempt(attempts, "ADVANCED"))     count++;
        return count;
    }

    private boolean hasAttempt(List<ReasoningAttempt> attempts, String difficulty) {
        return attempts.stream().anyMatch(attempt ->
                attempt.getDifficulty() != null && attempt.getDifficulty().equalsIgnoreCase(difficulty));
    }

    @Override
    public List<LeaderboardItemDto> getLeaderboard(String currentUserEmail) {
        List<User> allUsers = userRepository.findAll().stream()
                .sorted(Comparator.comparingInt(User::getXp).reversed())
                .collect(Collectors.toList());

        List<LeaderboardItemDto> leaderboard = new ArrayList<>();
        String[] avatars = {"🧑‍🚀", "👩‍💼", "👨‍💻", "👩‍💻", "👩‍🎓", "🧑‍🔬", "👨‍🎓", "👩‍🔬"};

        for (int i = 0; i < allUsers.size(); i++) {
            User u = allUsers.get(i);
            boolean isCurrent = u.getEmail() != null && u.getEmail().equalsIgnoreCase(currentUserEmail);
            String avatar = avatars[i % avatars.length];

            int lvl = u.getLevel() > 0 ? u.getLevel() : (u.getXp() / 500) + 1;

            leaderboard.add(LeaderboardItemDto.builder()
                    .rank(i + 1)
                    .name(u.getFullName() != null ? u.getFullName() : "Player " + (i + 1))
                    .avatar(avatar)
                    .xp(u.getXp())
                    .level("Level " + lvl)
                    .currentUser(isCurrent)
                    .build());
        }

        return leaderboard;
    }

    private String getLevelTitle(int level) {
        switch (level) {
            case 1:
                return "Explorer";
            case 2:
                return "Pioneer";
            case 3:
                return "Strategist";
            case 4:
                return "Specialist";
            case 5:
                return "Master";
            default:
                return "Grandmaster";
        }
    }

    private List<BadgeDto> buildBadges(List<ReasoningAttempt> attempts,
                                       List<CommunicationAttempt> communicationAttempts) {
        List<BadgeDto> list = new ArrayList<>();

        boolean hasAttempt = !attempts.isEmpty();
        boolean hasStrongScore = attempts.stream().anyMatch(a -> a.getAccuracy() >= 70);
        boolean hasMasterScore = attempts.stream().anyMatch(a -> a.getAccuracy() >= 90);
        boolean hasThreeChallenges = attempts.size() >= 3;
        CommunicationAttempt passingCommunication = communicationAttempts.stream()
                .filter(CommunicationAttempt::isPassed)
                .max(Comparator.comparing(CommunicationAttempt::getCompletedAt,
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .orElse(null);

        list.add(BadgeDto.builder()
                .id("b1")
                .name("Code Starter")
                .icon("💻")
                .description("Completed your first technical challenge.")
                .earned(false)
                .xpText(false ? "Earned • +50 XP" : "Locked • Complete Coding Challenge")
                .build());

        list.add(BadgeDto.builder()
                .id("b2")
                .name("Quick Thinker")
                .icon("🧠")
                .description("Finished a reasoning challenge with a strong score (>=70%).")
                .earned(hasStrongScore)
                .xpText(hasStrongScore ? "Earned • +80 XP" : "Locked • Score 70%+ in Reasoning")
                .build());

        list.add(BadgeDto.builder()
                .id("b3")
                .name("Goal Getter")
                .icon("🎯")
                .description("Completed three challenges in SkillQuest.")
                .earned(hasThreeChallenges)
                .xpText(hasThreeChallenges ? "Earned • +100 XP" : "Locked • Complete 3 Quests")
                .build());

        list.add(BadgeDto.builder()
                .id("b4")
                .name("Logic Master")
                .icon("🏆")
                .description("Achieved 90%+ accuracy on a Logical Reasoning Quest.")
                .earned(hasMasterScore)
                .xpText(hasMasterScore ? "Earned • +100 XP" : "Locked • Achieve 90%+ Accuracy")
                .build());

        list.add(BadgeDto.builder()
                .id("b5")
                .name("Quest Beginner")
                .icon("🌱")
                .description("Started your quest journey and finished your first challenge.")
                .earned(hasAttempt)
                .xpText(hasAttempt ? "Earned • +20 XP" : "Locked • Finish First Quest")
                .build());

        list.add(BadgeDto.builder()
                .id("b6")
                .name("Communication Pro")
                .icon("💬")
                .description("Pass any Communication Hub subdivision assessment to unlock this badge.")
                .earned(passingCommunication != null)
                .earnedAt(passingCommunication == null ? null : passingCommunication.getCompletedAt())
                .xpText(passingCommunication == null ? "Locked - Pass the Communication Quest" : "Earned - Passed the Communication Quest")
                .build());

        return list;
    }
}
