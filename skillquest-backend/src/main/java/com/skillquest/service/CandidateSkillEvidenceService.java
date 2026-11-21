package com.skillquest.service;

import com.skillquest.dto.CandidateAssessmentHistoryDto;
import com.skillquest.dto.CandidateChallengeHistoryDto;
import com.skillquest.dto.CandidateSkillProfileDto;
import com.skillquest.dto.CandidateSkillScoreDto;
import com.skillquest.entity.*;
import com.skillquest.repository.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class CandidateSkillEvidenceService {
    private final CodingAttemptRepository codingAttempts;
    private final ReasoningAttemptRepository reasoningAttempts;
    private final CommunicationAttemptRepository communicationAttempts;
    private final DataDetectiveAttemptRepository dataAttempts;
    private final TeamworkAttemptRepository teamworkAttempts;
    private final InterviewAttemptRepository interviewAttempts;
    private final RecruiterAssessmentSubmissionRepository submissions;
    private final RecruiterAssessmentRepository assessments;

    public CandidateSkillEvidenceService(CodingAttemptRepository codingAttempts,
                                         ReasoningAttemptRepository reasoningAttempts,
                                         CommunicationAttemptRepository communicationAttempts,
                                         DataDetectiveAttemptRepository dataAttempts,
                                         TeamworkAttemptRepository teamworkAttempts,
                                         InterviewAttemptRepository interviewAttempts,
                                         RecruiterAssessmentSubmissionRepository submissions,
                                         RecruiterAssessmentRepository assessments) {
        this.codingAttempts = codingAttempts;
        this.reasoningAttempts = reasoningAttempts;
        this.communicationAttempts = communicationAttempts;
        this.dataAttempts = dataAttempts;
        this.teamworkAttempts = teamworkAttempts;
        this.interviewAttempts = interviewAttempts;
        this.submissions = submissions;
        this.assessments = assessments;
    }

    public CandidateSkillProfileDto getProfile(String candidateEmail, String recruiterEmail) {
        Map<String, CandidateSkillScoreDto> scores = new LinkedHashMap<>();
        List<CandidateChallengeHistoryDto> history = new ArrayList<>();

        for (CodingAttempt attempt : codingAttempts.findByUserEmailOrderByCompletedAtDesc(candidateEmail)) {
            history.add(new CandidateChallengeHistoryDto("Coding Arena · " + attempt.getLanguage(), null, null,
                    attempt.getCompletedAt(), false));
        }
        for (ReasoningAttempt attempt : reasoningAttempts.findByUserEmailOrderByCompletedAtDesc(candidateEmail)) {
            addScore(scores, "Logical Reasoning", attempt.getAccuracy(), "Logical Sprint", instant(attempt.getCompletedAt()));
            addScore(scores, "Problem Solving", attempt.getAccuracy(), "Logical Sprint", instant(attempt.getCompletedAt()));
            history.add(new CandidateChallengeHistoryDto("Logical Sprint", attempt.getAccuracy(), attempt.isPassed(),
                    instant(attempt.getCompletedAt()), true));
        }
        for (CommunicationAttempt attempt : communicationAttempts.findByUserEmailOrderByCompletedAtDesc(candidateEmail)) {
            addScore(scores, "Communication", attempt.getAccuracy(), "Communication Challenge", instant(attempt.getCompletedAt()));
            addScore(scores, communicationSkill(attempt.getSubdivisionId()), attempt.getAccuracy(),
                    "Communication Challenge", instant(attempt.getCompletedAt()));
            history.add(new CandidateChallengeHistoryDto("Communication Challenge", attempt.getAccuracy(), attempt.isPassed(),
                    instant(attempt.getCompletedAt()), true));
        }
        for (DataDetectiveAttempt attempt : dataAttempts.findByUserEmailOrderByCompletedAtDesc(candidateEmail)) {
            addScore(scores, "Data Analysis", attempt.getAccuracy(), "Data Detective", instant(attempt.getCompletedAt()));
            addScore(scores, "Analytics", attempt.getAccuracy(), "Data Detective", instant(attempt.getCompletedAt()));
            history.add(new CandidateChallengeHistoryDto("Data Detective · " + attempt.getInvestigationId(),
                    attempt.getAccuracy(), attempt.isPassed(), instant(attempt.getCompletedAt()), true));
        }
        for (TeamworkAttempt attempt : teamworkAttempts.findByUserEmailOrderByCompletedAtDesc(candidateEmail)) {
            addScore(scores, "Teamwork", attempt.getAccuracy(), "Teamwork Mission", instant(attempt.getCompletedAt()));
            addScore(scores, "Collaboration", attempt.getAccuracy(), "Teamwork Mission", instant(attempt.getCompletedAt()));
            history.add(new CandidateChallengeHistoryDto("Teamwork Mission", attempt.getAccuracy(), attempt.isPassed(),
                    instant(attempt.getCompletedAt()), true));
        }
        for (InterviewAttempt attempt : interviewAttempts.findByUserEmailOrderByCompletedAtDesc(candidateEmail)) {
            history.add(new CandidateChallengeHistoryDto("Interview Battle", attempt.getAccuracy(), attempt.isPassed(),
                    attempt.getCompletedAt(), true));
            if (attempt.getCategoryResults() != null) {
                attempt.getCategoryResults().forEach(category -> addScore(scores, category.getCategory(), category.getAccuracy(),
                        "Interview Battle", attempt.getCompletedAt()));
            }
        }

        List<CandidateAssessmentHistoryDto> assessmentResults = recruiterAssessmentHistory(candidateEmail, recruiterEmail, scores);
        history.sort(Comparator.comparing(CandidateChallengeHistoryDto::completedAt,
                Comparator.nullsLast(Comparator.reverseOrder())));
        return new CandidateSkillProfileDto(scores, history.stream().limit(20).toList(), assessmentResults);
    }

    private List<CandidateAssessmentHistoryDto> recruiterAssessmentHistory(String candidateEmail, String recruiterEmail,
                                                                             Map<String, CandidateSkillScoreDto> scores) {
        if (recruiterEmail == null || recruiterEmail.isBlank()) return List.of();
        Map<String, RecruiterAssessment> assessmentById = new LinkedHashMap<>();
        assessments.findAllByRecruiterEmailOrderByCreatedAtDesc(recruiterEmail)
                .forEach(assessment -> assessmentById.put(assessment.getId(), assessment));
        List<CandidateAssessmentHistoryDto> history = new ArrayList<>();
        for (RecruiterAssessmentSubmission submission : submissions
                .findAllByRecruiterEmailAndCandidateEmailOrderByCompletedAtDesc(recruiterEmail, candidateEmail)) {
            RecruiterAssessment assessment = assessmentById.get(submission.getAssessmentId());
            if (assessment == null) continue;
            Instant completedAt = instant(submission.getCompletedAt());
            String technology = assessment.getTechnology();
            history.add(new CandidateAssessmentHistoryDto(assessment.getTitle(), technology, submission.getScore(), completedAt));
            if (submission.getScore() != null && technology != null && !technology.isBlank()) {
                addScore(scores, technology, submission.getScore(), "Recruiter assessment: " + assessment.getTitle(), completedAt);
            }
        }
        return history.stream().limit(20).toList();
    }

    private void addScore(Map<String, CandidateSkillScoreDto> scores, String skill, int score,
                          String evidence, Instant completedAt) {
        String key = normalizeSkill(skill);
        if (key.isBlank()) return;
        CandidateSkillScoreDto current = scores.get(key);
        if (current == null || isLater(completedAt, current.completedAt())) {
            scores.put(key, new CandidateSkillScoreDto(skill, Math.max(0, Math.min(100, score)), evidence, completedAt));
        }
    }

    private boolean isLater(Instant candidate, Instant current) {
        if (candidate == null) return false;
        return current == null || candidate.isAfter(current);
    }

    public static String normalizeSkill(String skill) {
        if (skill == null) return "";
        String normalized = skill.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", " ").trim();
        return switch (normalized) {
            case "js" -> "javascript";
            case "html css", "css html" -> "html css";
            case "problem solving", "problem solving skills" -> "problem solving";
            case "data analytics" -> "data analysis";
            default -> normalized;
        };
    }

    private String communicationSkill(String subdivisionId) {
        if (subdivisionId == null) return "";
        return switch (subdivisionId) {
            case "office-team" -> "Workplace Communication";
            case "customer-relations" -> "Customer Communication";
            case "interview-career" -> "Interview Communication";
            case "presentations" -> "Presentations";
            case "conflict-etiquette" -> "Conflict Resolution";
            default -> "";
        };
    }

    private Instant instant(LocalDateTime dateTime) {
        return dateTime == null ? null : dateTime.atZone(ZoneId.systemDefault()).toInstant();
    }
}