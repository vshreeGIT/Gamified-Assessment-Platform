package com.skillquest.service;

import com.skillquest.entity.CodingAttempt;
import com.skillquest.entity.CommunicationAttempt;
import com.skillquest.entity.DataDetectiveAttempt;
import com.skillquest.entity.InterviewAttempt;
import com.skillquest.entity.InterviewCategoryResult;
import com.skillquest.entity.ReasoningAttempt;
import com.skillquest.entity.RecruiterAssessment;
import com.skillquest.entity.RecruiterAssessmentSubmission;
import com.skillquest.entity.TeamworkAttempt;
import com.skillquest.repository.CodingAttemptRepository;
import com.skillquest.repository.CommunicationAttemptRepository;
import com.skillquest.repository.DataDetectiveAttemptRepository;
import com.skillquest.repository.InterviewAttemptRepository;
import com.skillquest.repository.ReasoningAttemptRepository;
import com.skillquest.repository.RecruiterAssessmentRepository;
import com.skillquest.repository.RecruiterAssessmentSubmissionRepository;
import com.skillquest.repository.TeamworkAttemptRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CandidateSkillEvidenceServiceTest {
    private static final String CANDIDATE = "candidate@example.com";
    private static final String RECRUITER = "recruiter@example.com";

    private CodingAttemptRepository coding;
    private ReasoningAttemptRepository reasoning;
    private CommunicationAttemptRepository communication;
    private DataDetectiveAttemptRepository data;
    private TeamworkAttemptRepository teamwork;
    private InterviewAttemptRepository interview;
    private RecruiterAssessmentSubmissionRepository submissions;
    private RecruiterAssessmentRepository assessments;
    private CandidateSkillEvidenceService service;

    @BeforeEach
    void setUp() {
        coding = mock(CodingAttemptRepository.class);
        reasoning = mock(ReasoningAttemptRepository.class);
        communication = mock(CommunicationAttemptRepository.class);
        data = mock(DataDetectiveAttemptRepository.class);
        teamwork = mock(TeamworkAttemptRepository.class);
        interview = mock(InterviewAttemptRepository.class);
        submissions = mock(RecruiterAssessmentSubmissionRepository.class);
        assessments = mock(RecruiterAssessmentRepository.class);
        service = new CandidateSkillEvidenceService(coding, reasoning, communication, data, teamwork, interview,
                submissions, assessments);
    }

    @Test
    void usesCompletedChallengeAndRecruiterAssessmentScoresAsEvidence() {
        Instant completedAt = Instant.parse("2026-11-20T12:00:00Z");
        when(coding.findByUserEmailOrderByCompletedAtDesc(CANDIDATE)).thenReturn(List.of(CodingAttempt.builder()
                .id("code-1").userEmail(CANDIDATE).language("JavaScript").completedAt(completedAt).build()));
        when(reasoning.findByUserEmailOrderByCompletedAtDesc(CANDIDATE)).thenReturn(List.of(ReasoningAttempt.builder()
                .id("reason-1").userEmail(CANDIDATE).accuracy(82).passed(true)
                .completedAt(LocalDateTime.of(2026, 11, 20, 12, 0)).build()));
        when(data.findByUserEmailOrderByCompletedAtDesc(CANDIDATE)).thenReturn(List.of(DataDetectiveAttempt.builder()
                .id("data-1").userEmail(CANDIDATE).investigationId("sales-revenue").accuracy(90).passed(true)
                .completedAt(LocalDateTime.of(2026, 11, 20, 13, 0)).build()));
        when(teamwork.findByUserEmailOrderByCompletedAtDesc(CANDIDATE)).thenReturn(List.of(TeamworkAttempt.builder()
                .id("team-1").userEmail(CANDIDATE).accuracy(80).passed(true)
                .completedAt(LocalDateTime.of(2026, 11, 20, 14, 0)).build()));
        when(interview.findByUserEmailOrderByCompletedAtDesc(CANDIDATE)).thenReturn(List.of(InterviewAttempt.builder()
                .id("interview-1").userEmail(CANDIDATE).accuracy(75).passed(true).completedAt(completedAt)
                .categoryResults(List.of(InterviewCategoryResult.builder().category("Technical").accuracy(88).build())).build()));
        when(communication.findByUserEmailOrderByCompletedAtDesc(CANDIDATE)).thenReturn(List.of(CommunicationAttempt.builder()
                .id("communication-1").userEmail(CANDIDATE).subdivisionId("presentations").accuracy(91).passed(true)
                .completedAt(LocalDateTime.of(2026, 11, 20, 15, 0)).build()));
        when(assessments.findAllByRecruiterEmailOrderByCreatedAtDesc(RECRUITER)).thenReturn(List.of(RecruiterAssessment.builder()
                .id("assessment-1").recruiterEmail(RECRUITER).title("React Evaluation").technology("React").build()));
        when(submissions.findAllByRecruiterEmailAndCandidateEmailOrderByCompletedAtDesc(RECRUITER, CANDIDATE))
                .thenReturn(List.of(RecruiterAssessmentSubmission.builder().id("submission-1").recruiterEmail(RECRUITER)
                        .assessmentId("assessment-1").candidateEmail(CANDIDATE).score(76)
                        .completedAt(LocalDateTime.of(2026, 11, 20, 16, 0)).build()));

        var profile = service.getProfile(CANDIDATE, RECRUITER);

        assertEquals(82, profile.skillScores().get("problem solving").score());
        assertEquals(90, profile.skillScores().get("data analysis").score());
        assertEquals(88, profile.skillScores().get("technical").score());
        assertEquals(76, profile.skillScores().get("react").score());
        assertEquals("React Evaluation", profile.assessmentResults().get(0).assessmentName());
        assertTrue(profile.challengeHistory().stream().anyMatch(history -> "Coding Arena · JavaScript".equals(history.module())
                && !history.evaluated() && history.score() == null));
        assertFalse(profile.skillScores().containsKey("javascript"));
    }

    @Test
    void assessmentResultsAreScopedToTheRecruiterWhoseJobIsMatched() {
        when(assessments.findAllByRecruiterEmailOrderByCreatedAtDesc(RECRUITER)).thenReturn(List.of());
        when(submissions.findAllByRecruiterEmailAndCandidateEmailOrderByCompletedAtDesc(RECRUITER, CANDIDATE))
                .thenReturn(List.of());

        var profile = service.getProfile(CANDIDATE, RECRUITER);

        assertTrue(profile.assessmentResults().isEmpty());
        assertNull(profile.skillScores().get("react"));
    }
}
