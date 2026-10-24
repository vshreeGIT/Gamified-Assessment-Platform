package com.skillquest.service.impl;

import com.skillquest.dto.QuestProgressItemDto;
import com.skillquest.dto.QuestProgressResponse;
import com.skillquest.entity.*;
import com.skillquest.repository.*;
import com.skillquest.config.InterviewProgressionBypass;
import com.skillquest.service.QuestProgressService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;

@Service
public class QuestProgressServiceImpl implements QuestProgressService {
    private static final int INTERVIEW_XP_REQUIRED = 750;
    private static final List<String> REQUIRED_NAMES = List.of("Coding Arena", "Logical Reasoning Sprint", "Communication Quest", "Data Detective", "Teamwork Mission");
    private static final List<String> DATA_INVESTIGATIONS = List.of("sales-revenue", "customer-behaviour", "product-performance");
    private static final List<String> COMMUNICATION_SUBDIVISIONS = List.of("office-team", "customer-relations", "interview-career", "presentations", "conflict-etiquette");
    private final UserRepository users;
    private final CodingAttemptRepository codingAttempts;
    private final CodingAssessmentSessionRepository codingSessions;
    private final ReasoningAttemptRepository reasoningAttempts;
    private final ReasoningAssessmentSessionRepository reasoningSessions;
    private final CommunicationAttemptRepository communicationAttempts;
    private final CommunicationAssessmentSessionRepository communicationSessions;
    private final DataDetectiveAttemptRepository dataAttempts;
    private final DataDetectiveSessionRepository dataSessions;
    private final TeamworkAttemptRepository teamworkAttempts;
    private final TeamworkAssessmentSessionRepository teamworkSessions;
    private final InterviewAttemptRepository interviewAttempts;
    private final InterviewAssessmentSessionRepository interviewSessions;
    private final InterviewProgressionBypass interviewProgressionBypass;

    public QuestProgressServiceImpl(UserRepository users, CodingAttemptRepository codingAttempts,
            CodingAssessmentSessionRepository codingSessions, ReasoningAttemptRepository reasoningAttempts,
            ReasoningAssessmentSessionRepository reasoningSessions, CommunicationAttemptRepository communicationAttempts,
            CommunicationAssessmentSessionRepository communicationSessions, DataDetectiveAttemptRepository dataAttempts,
            DataDetectiveSessionRepository dataSessions, TeamworkAttemptRepository teamworkAttempts,
            TeamworkAssessmentSessionRepository teamworkSessions, InterviewAttemptRepository interviewAttempts,
            InterviewAssessmentSessionRepository interviewSessions, InterviewProgressionBypass interviewProgressionBypass) {
        this.users = users; this.codingAttempts = codingAttempts; this.codingSessions = codingSessions;
        this.reasoningAttempts = reasoningAttempts; this.reasoningSessions = reasoningSessions;
        this.communicationAttempts = communicationAttempts; this.communicationSessions = communicationSessions;
        this.dataAttempts = dataAttempts; this.dataSessions = dataSessions;
        this.teamworkAttempts = teamworkAttempts; this.teamworkSessions = teamworkSessions;
        this.interviewAttempts = interviewAttempts; this.interviewSessions = interviewSessions;
        this.interviewProgressionBypass = interviewProgressionBypass;
    }

    @Override
    public QuestProgressResponse getProgress(String email) {
        int xp = users.findByEmail(email).map(User::getXp).orElse(0);
        List<CodingAttempt> coding = codingAttempts.findByUserEmailOrderByCompletedAtDesc(email);
        List<ReasoningAttempt> reasoning = reasoningAttempts.findByUserEmailOrderByCompletedAtDesc(email);
        List<CommunicationAttempt> communication = communicationAttempts.findByUserEmailOrderByCompletedAtDesc(email);
        List<DataDetectiveAttempt> data = dataAttempts.findByUserEmailOrderByCompletedAtDesc(email);
        List<TeamworkAttempt> teamwork = teamworkAttempts.findByUserEmailOrderByCompletedAtDesc(email);
        List<InterviewAttempt> interview = interviewAttempts.findByUserEmailOrderByCompletedAtDesc(email);

        boolean codingDone = !coding.isEmpty();
        boolean reasoningPassed = reasoning.stream().anyMatch(ReasoningAttempt::isPassed);
        boolean communicationPassed = communication.stream().anyMatch(CommunicationAttempt::isPassed);
        boolean dataPassed = data.stream().filter(DataDetectiveAttempt::isPassed).map(DataDetectiveAttempt::getInvestigationId)
                .collect(java.util.stream.Collectors.toSet()).containsAll(DATA_INVESTIGATIONS);
        boolean teamworkPassed = teamwork.stream().anyMatch(TeamworkAttempt::isPassed);
        boolean interviewPassed = interview.stream().anyMatch(InterviewAttempt::isPassed);
        List<String> missing = new ArrayList<>();
        if (!codingDone) missing.add(REQUIRED_NAMES.get(0));
        if (reasoning.isEmpty()) missing.add(REQUIRED_NAMES.get(1));
        if (communication.isEmpty()) missing.add(REQUIRED_NAMES.get(2));
        if (data.isEmpty()) missing.add(REQUIRED_NAMES.get(3));
        if (teamwork.isEmpty()) missing.add(REQUIRED_NAMES.get(4));
        int completedCount = REQUIRED_NAMES.size() - missing.size();
        List<String> interviewMissing = new ArrayList<>();
        if (!interviewProgressionBypass.isEnabled() && xp < INTERVIEW_XP_REQUIRED) interviewMissing.add("XP: " + xp + " / " + INTERVIEW_XP_REQUIRED);
        if (!interviewProgressionBypass.isEnabled() && !missing.isEmpty()) {
            interviewMissing.add("Completed quests: " + completedCount + " / " + REQUIRED_NAMES.size());
            interviewMissing.add("Incomplete quests: " + String.join(", ", missing));
        }

        Map<String, QuestProgressItemDto> quests = new LinkedHashMap<>();
        quests.put("coding", item(status(false, codingDone, false), List.of(), coding.size(), null, false));
        quests.put("reasoning", item(status(reasoningPassed, !reasoning.isEmpty(), activeReasoning(email)), List.of(), reasoning.size(), latestReasoning(reasoning), reasoningPassed));
        quests.put("communication", item(status(communicationPassed, !communication.isEmpty(), activeCommunication(email)), List.of(), communication.size(), latestCommunication(communication), communicationPassed));
        quests.put("data-detective", item(status(dataPassed, !data.isEmpty(), activeData(email)), List.of(), data.size(), data.isEmpty() ? null : data.get(0).getAccuracy(), dataPassed));
        quests.put("teamwork", item(status(teamworkPassed, !teamwork.isEmpty(), activeTeamwork(email)), List.of(), teamwork.size(), teamwork.isEmpty() ? null : teamwork.get(0).getAccuracy(), teamworkPassed));
        quests.put("interview", item(interviewMissing.isEmpty()
                        ? status(interviewPassed, !interview.isEmpty(), activeInterview(email)) : "LOCKED",
                interviewMissing, interview.size(), interview.isEmpty() ? null : interview.get(0).getAccuracy(), interviewPassed));
        return QuestProgressResponse.builder().quests(quests).totalXp(xp).requiredXp(INTERVIEW_XP_REQUIRED)
                .completedRequiredQuests(completedCount).requiredQuestCount(REQUIRED_NAMES.size())
                .interviewProgressionBypassed(interviewProgressionBypass.isEnabled()).build();
    }

    @Override
    public void requireInterviewUnlocked(String email) {
        QuestProgressItemDto item = getProgress(email).getQuests().get("interview");
        if ("LOCKED".equals(item.getStatus())) throw new AccessDeniedException("Interview Battle is locked. " + String.join("; ", item.getMissingPrerequisites()));
    }

    private String status(boolean passed, boolean attempted, boolean active) {
        if (passed) return "PASSED";
        if (active) return "IN_PROGRESS";
        return attempted ? "ATTEMPTED" : "AVAILABLE";
    }
    private QuestProgressItemDto item(String status, List<String> missing, int count, Integer accuracy, boolean passed) {
        return QuestProgressItemDto.builder().status(status).missingPrerequisites(missing).attemptCount(count).latestAccuracy(accuracy).passed(passed).build();
    }
    private boolean activeReasoning(String email) {
        return List.of("BEGINNER", "INTERMEDIATE", "ADVANCED").stream().anyMatch(d -> reasoningSessions.findById(sessionId(email, d)).filter(s -> "ACTIVE".equals(s.getStatus()) && s.getDeadlineAt() != null && Instant.now().isBefore(s.getDeadlineAt())).isPresent());
    }
    private boolean activeCommunication(String email) {
        return COMMUNICATION_SUBDIVISIONS.stream().anyMatch(id -> communicationSessions.findById(sessionId(email + "|COMMUNICATION", id)).filter(s -> "ACTIVE".equals(s.getStatus()) && s.getDeadlineAt() != null && Instant.now().isBefore(s.getDeadlineAt())).isPresent());
    }
    private boolean activeData(String email) {
        return DATA_INVESTIGATIONS.stream().anyMatch(id -> dataSessions.findById(sessionId(email, id)).filter(s -> "ACTIVE".equals(s.getStatus()) && s.getDeadlineAt() != null && Instant.now().isBefore(s.getDeadlineAt())).isPresent());
    }
    private boolean activeTeamwork(String email) { return teamworkSessions.findById(sessionId(email, "TEAMWORK")).filter(s -> "ACTIVE".equals(s.getStatus())).isPresent(); }
    private boolean activeInterview(String email) { return interviewSessions.findById(sessionId(email, "INTERVIEW_BATTLE")).filter(s -> "ACTIVE".equals(s.getStatus()) && s.getDeadlineAt() != null && Instant.now().isBefore(s.getDeadlineAt())).isPresent(); }
    private Integer latestReasoning(List<ReasoningAttempt> a) { return a.isEmpty() ? null : a.get(0).getAccuracy(); }
    private Integer latestCommunication(List<CommunicationAttempt> a) { return a.isEmpty() ? null : a.get(0).getAccuracy(); }
    private String sessionId(String first, String second) { return UUID.nameUUIDFromBytes((first + "|" + second).getBytes(StandardCharsets.UTF_8)).toString(); }
}
