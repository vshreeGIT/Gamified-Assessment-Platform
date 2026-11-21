package com.skillquest.service;

import com.skillquest.dto.RecruiterAssessmentRequest;
import com.skillquest.dto.RecruiterAssessmentQuestionRequest;
import com.skillquest.dto.RecruiterDecisionRequest;
import com.skillquest.entity.RecruiterAssessment;
import com.skillquest.entity.RecruiterAssessmentAssignment;
import com.skillquest.entity.RecruiterAssessmentSubmission;
import com.skillquest.entity.Role;
import com.skillquest.entity.User;
import com.skillquest.exception.UserNotFoundException;
import com.skillquest.repository.RecruiterAssessmentAssignmentRepository;
import com.skillquest.repository.RecruiterAssessmentRepository;
import com.skillquest.repository.RecruiterAssessmentSubmissionRepository;
import com.skillquest.repository.RecruiterSettingsRepository;
import com.skillquest.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class RecruiterServiceTest {
    private static final String RECRUITER = "recruiter@example.com";
    private static final String OTHER_RECRUITER = "other@example.com";
    private static final String CANDIDATE = "candidate@example.com";

    private RecruiterAssessmentRepository assessments;
    private RecruiterAssessmentAssignmentRepository assignments;
    private RecruiterAssessmentSubmissionRepository submissions;
    private RecruiterSettingsRepository settings;
    private UserRepository users;
    private RecruiterService service;

    @BeforeEach
    void setUp() {
        assessments = mock(RecruiterAssessmentRepository.class);
        assignments = mock(RecruiterAssessmentAssignmentRepository.class);
        submissions = mock(RecruiterAssessmentSubmissionRepository.class);
        settings = mock(RecruiterSettingsRepository.class);
        users = mock(UserRepository.class);
        service = new RecruiterService(assessments, assignments, submissions, settings, users);
    }

    @Test
    void createAssessmentPersistsRecruiterOwnershipAndFrontendFields() {
        RecruiterAssessmentRequest request = validAssessmentRequest();
        when(assessments.save(any(RecruiterAssessment.class))).thenAnswer(invocation -> {
            RecruiterAssessment value = invocation.getArgument(0);
            value.setId("assessment-1");
            return value;
        });

        var response = service.createAssessment(RECRUITER, request);

        assertEquals("assessment-1", response.id());
        assertEquals("Frontend hiring", response.title());
        assertEquals("coding", response.type());
        verify(assessments).save(argThat(value -> RECRUITER.equals(value.getRecruiterEmail())
                && "draft".equals(value.getStatus()) && value.getDurationMinutes() == 45));
    }

    @Test
    void createAssessmentPersistsAndReturnsCustomQuestions() {
        RecruiterAssessmentRequest request = validAssessmentRequest();
        request.setQuestions(List.of(questionRequest("q-mcq", "MCQ", List.of("A", "B"), List.of("A"), 4)));
        when(assessments.save(any(RecruiterAssessment.class))).thenAnswer(invocation -> {
            RecruiterAssessment value = invocation.getArgument(0);
            value.setId("assessment-questions");
            return value;
        });

        var result = service.createAssessment(RECRUITER, request);

        assertEquals(1, result.questionCount());
        assertEquals("q-mcq", result.questions().get(0).id());
        assertEquals(4, result.questions().get(0).marks());
        verify(assessments).save(argThat(value -> value.getQuestions().size() == 1
                && value.getQuestions().get(0).getCorrectAnswers().equals(List.of("A"))));
    }

    @Test
    void createAssessmentCannotPublishWithoutQuestions() {
        RecruiterAssessmentRequest request = validAssessmentRequest();
        request.setStatus("published");

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.createAssessment(RECRUITER, request));

        assertEquals(400, exception.getStatusCode().value());
        verify(assessments, never()).save(any(RecruiterAssessment.class));
    }

    @Test
    void objectiveQuestionMustHaveAValidCorrectAnswer() {
        RecruiterAssessmentRequest request = validAssessmentRequest();
        request.setQuestions(List.of(questionRequest("q-mcq", "MCQ", List.of("A", "B"), List.of(), 1)));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.createAssessment(RECRUITER, request));

        assertEquals(400, exception.getStatusCode().value());
        verify(assessments, never()).save(any(RecruiterAssessment.class));
    }

    @Test
    void updateAssessmentOnlyLoadsOwnedAssessment() {
        when(assessments.findByIdAndRecruiterEmail("assessment-1", RECRUITER)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class,
                () -> service.updateAssessment(RECRUITER, "assessment-1", validAssessmentRequest()));
        verify(assessments, never()).save(any(RecruiterAssessment.class));
    }

    @Test
    void ownerCanUpdateAndDeleteAssessment() {
        RecruiterAssessment assessment = assessment("assessment-1", RECRUITER, "draft");
        when(assessments.findByIdAndRecruiterEmail("assessment-1", RECRUITER)).thenReturn(Optional.of(assessment));
        when(assessments.findAllByRecruiterEmailOrderByCreatedAtDesc(RECRUITER)).thenReturn(List.of(assessment));
        when(assessments.save(any(RecruiterAssessment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.updateAssessment(RECRUITER, "assessment-1", validAssessmentRequest());
        service.deleteAssessment(RECRUITER, "assessment-1");

        verify(assignments).deleteAllByAssessmentIdAndRecruiterEmail("assessment-1", RECRUITER);
        verify(assessments).delete(assessment);
    }

    @Test
    void nonOwnerCannotReadOrDeleteAssessment() {
        when(assessments.findByIdAndRecruiterEmail("assessment-1", OTHER_RECRUITER)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> service.getAssessment(OTHER_RECRUITER, "assessment-1"));
        assertThrows(UserNotFoundException.class, () -> service.deleteAssessment(OTHER_RECRUITER, "assessment-1"));
        verify(assessments, never()).delete(any(RecruiterAssessment.class));
    }

    @Test
    void assessmentActionsPublishCloseAndDuplicateWithinOwner() {
        RecruiterAssessment source = assessment("assessment-1", RECRUITER, "draft");
        source.setQuestionIds(List.of("legacy-question"));
        when(assessments.findByIdAndRecruiterEmail("assessment-1", RECRUITER)).thenReturn(Optional.of(source));
        when(assessments.save(any(RecruiterAssessment.class))).thenAnswer(invocation -> {
            RecruiterAssessment value = invocation.getArgument(0);
            if (value.getId() == null) value.setId("assessment-copy");
            return value;
        });

        assertEquals("published", service.assessmentAction(RECRUITER, "assessment-1", "publish").status());
        assertEquals("closed", service.assessmentAction(RECRUITER, "assessment-1", "close").status());
        var duplicate = service.assessmentAction(RECRUITER, "assessment-1", "duplicate");
        assertEquals("draft", duplicate.status());
        assertEquals("Frontend hiring (copy)", duplicate.title());
    }

    @Test
    void cannotPublishAssessmentWithoutQuestions() {
        RecruiterAssessment assessment = assessment("assessment-1", RECRUITER, "draft");
        when(assessments.findByIdAndRecruiterEmail("assessment-1", RECRUITER)).thenReturn(Optional.of(assessment));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.assessmentAction(RECRUITER, "assessment-1", "publish"));

        assertEquals(400, exception.getStatusCode().value());
        verify(assessments, never()).save(any(RecruiterAssessment.class));
    }

    @Test
    void assignmentRequiresOwnedPublishedAssessmentAndCandidateRole() {
        RecruiterAssessment assessment = assessment("assessment-1", RECRUITER, "draft");
        when(assessments.findByIdAndRecruiterEmail("assessment-1", RECRUITER)).thenReturn(Optional.of(assessment));
        var request = new com.skillquest.dto.RecruiterAssignmentRequest();
        request.setEmail(CANDIDATE);

        assertThrows(ResponseStatusException.class, () -> service.assignCandidate(RECRUITER, "assessment-1", request));
        verify(users, never()).findByEmail(anyString());
    }

    @Test
    void recruiterCanAssignOnlyAnExistingActiveCandidate() {
        RecruiterAssessment assessment = assessment("assessment-1", RECRUITER, "published");
        User candidate = new User();
        candidate.setId("candidate-id");
        candidate.setEmail(CANDIDATE);
        candidate.setFullName("Candidate Name");
        candidate.setRole(Role.CANDIDATE);
        candidate.setActive(true);
        when(assessments.findByIdAndRecruiterEmail("assessment-1", RECRUITER)).thenReturn(Optional.of(assessment));
        when(users.findByEmailIgnoreCase(CANDIDATE)).thenReturn(Optional.of(candidate));
        when(assignments.findByAssessmentIdAndCandidateEmail("assessment-1", CANDIDATE)).thenReturn(Optional.empty());
        when(assignments.insert(any(RecruiterAssessmentAssignment.class))).thenAnswer(invocation -> {
            RecruiterAssessmentAssignment value = invocation.getArgument(0);
            value.setId("assignment-1");
            return value;
        });

        var request = new com.skillquest.dto.RecruiterAssignmentRequest();
        request.setEmail(CANDIDATE);
        var response = service.assignCandidate(RECRUITER, "assessment-1", request);

        assertEquals("assignment-1", response.id());
        assertEquals("Candidate Name", response.name());
        assertEquals("in_progress", response.status());
        verify(assignments).insert(argThat((RecruiterAssessmentAssignment value) -> RECRUITER.equals(value.getRecruiterEmail())
                && "assessment-1".equals(value.getAssessmentId()) && CANDIDATE.equals(value.getCandidateEmail())));
    }

    @Test
    void candidateDecisionIsSavedOnlyForRecruiterOwnedAssignment() {
        RecruiterAssessment assessment = assessment("assessment-1", RECRUITER, "published");
        RecruiterAssessmentAssignment assignment = RecruiterAssessmentAssignment.builder()
                .id("assignment-1").recruiterEmail(RECRUITER).assessmentId("assessment-1")
                .candidateEmail(CANDIDATE).status("in_progress").build();
        User candidate = new User();
        candidate.setId("candidate-id");
        candidate.setEmail(CANDIDATE);
        candidate.setFullName("Candidate Name");
        candidate.setRole(Role.CANDIDATE);
        when(assignments.findByIdAndRecruiterEmail("assignment-1", RECRUITER)).thenReturn(Optional.of(assignment));
        when(assignments.save(any(RecruiterAssessmentAssignment.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(assessments.findByIdAndRecruiterEmail("assessment-1", RECRUITER)).thenReturn(Optional.of(assessment));
        when(assessments.findAllByRecruiterEmailOrderByCreatedAtDesc(RECRUITER)).thenReturn(List.of(assessment));
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(candidate));

        RecruiterDecisionRequest decision = new RecruiterDecisionRequest();
        decision.setDecision("shortlisted");
        decision.setNotes("Strong interview");
        var response = service.updateDecision(RECRUITER, "assignment-1", decision);

        assertEquals("shortlisted", response.decision());
        assertEquals("Strong interview", response.recruiterNotes());
        verify(assignments).save(argThat(value -> "shortlisted".equals(value.getDecision())
                && "Strong interview".equals(value.getNotes())));
    }

        @Test
        void candidateHistoryShowsActualTwelveMinuteDuration() {
        RecruiterAssessment assessment = assessment("assessment-1", RECRUITER, "published");
        RecruiterAssessmentAssignment assignment = RecruiterAssessmentAssignment.builder()
            .id("assignment-1").recruiterEmail(RECRUITER).assessmentId("assessment-1")
            .candidateEmail(CANDIDATE).status("completed").build();
        User candidate = candidateUser();
        LocalDateTime completedAt = LocalDateTime.of(2026, 11, 21, 12, 12);
        long startedAt = completedAt.atZone(ZoneId.systemDefault()).toInstant()
            .minus(Duration.ofMinutes(12)).toEpochMilli();
        RecruiterAssessmentSubmission submission = RecruiterAssessmentSubmission.builder()
            .id("submission-12m").recruiterEmail(RECRUITER).assessmentId("assessment-1")
            .candidateEmail(CANDIDATE).startedAtEpochMillis(startedAt).completedAt(completedAt)
            .durationSeconds(720).score(85).status("completed").build();
        when(assignments.findByIdAndRecruiterEmail("assignment-1", RECRUITER)).thenReturn(Optional.of(assignment));
        when(assessments.findByIdAndRecruiterEmail("assessment-1", RECRUITER)).thenReturn(Optional.of(assessment));
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(candidate));
        when(submissions.findAllByRecruiterEmailAndCandidateEmailOrderByCompletedAtDesc(RECRUITER, CANDIDATE))
            .thenReturn(List.of(submission));

        var result = service.getCandidate(RECRUITER, "assignment-1");

        assertEquals("12 min", result.assessments().get(0).actualDuration());
        }

        @Test
        void candidateHistoryFormatsDurationsLongerThanAnHour() {
        RecruiterAssessment assessment = assessment("assessment-1", RECRUITER, "published");
        RecruiterAssessmentAssignment assignment = RecruiterAssessmentAssignment.builder()
            .id("assignment-1").recruiterEmail(RECRUITER).assessmentId("assessment-1")
            .candidateEmail(CANDIDATE).status("completed").build();
        User candidate = candidateUser();
        LocalDateTime completedAt = LocalDateTime.of(2026, 11, 21, 12, 10);
        long startedAt = completedAt.atZone(ZoneId.systemDefault()).toInstant()
            .minus(Duration.ofMinutes(70)).toEpochMilli();
        RecruiterAssessmentSubmission submission = RecruiterAssessmentSubmission.builder()
            .id("submission-70m").recruiterEmail(RECRUITER).assessmentId("assessment-1")
            .candidateEmail(CANDIDATE).startedAtEpochMillis(startedAt).completedAt(completedAt)
            .durationSeconds(4200).score(85).status("completed").build();
        when(assignments.findByIdAndRecruiterEmail("assignment-1", RECRUITER)).thenReturn(Optional.of(assignment));
        when(assessments.findByIdAndRecruiterEmail("assessment-1", RECRUITER)).thenReturn(Optional.of(assessment));
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(candidate));
        when(submissions.findAllByRecruiterEmailAndCandidateEmailOrderByCompletedAtDesc(RECRUITER, CANDIDATE))
            .thenReturn(List.of(submission));

        var result = service.getCandidate(RECRUITER, "assignment-1");

        assertEquals("1 hr 10 min", result.assessments().get(0).actualDuration());
        }

        @Test
        void candidateHistoryDoesNotInventDurationWhenTimestampsAreMissingOrInvalid() {
        RecruiterAssessment assessment = assessment("assessment-1", RECRUITER, "published");
        RecruiterAssessmentAssignment assignment = RecruiterAssessmentAssignment.builder()
            .id("assignment-1").recruiterEmail(RECRUITER).assessmentId("assessment-1")
            .candidateEmail(CANDIDATE).status("completed").build();
        User candidate = candidateUser();
        LocalDateTime completedAt = LocalDateTime.of(2026, 11, 21, 12, 12);
        long futureStart = completedAt.atZone(ZoneId.systemDefault()).toInstant()
            .plus(Duration.ofMinutes(1)).toEpochMilli();
        RecruiterAssessmentSubmission missingStart = RecruiterAssessmentSubmission.builder()
            .id("submission-missing").recruiterEmail(RECRUITER).assessmentId("assessment-1")
            .candidateEmail(CANDIDATE).completedAt(completedAt).durationSeconds(0).status("completed").build();
        RecruiterAssessmentSubmission invalidStart = RecruiterAssessmentSubmission.builder()
            .id("submission-invalid").recruiterEmail(RECRUITER).assessmentId("assessment-1")
            .candidateEmail(CANDIDATE).startedAtEpochMillis(futureStart).completedAt(completedAt)
            .durationSeconds(0).status("completed").build();
        when(assignments.findByIdAndRecruiterEmail("assignment-1", RECRUITER)).thenReturn(Optional.of(assignment));
        when(assessments.findByIdAndRecruiterEmail("assessment-1", RECRUITER)).thenReturn(Optional.of(assessment));
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(candidate));
        when(submissions.findAllByRecruiterEmailAndCandidateEmailOrderByCompletedAtDesc(RECRUITER, CANDIDATE))
            .thenReturn(List.of(missingStart, invalidStart));

        var result = service.getCandidate(RECRUITER, "assignment-1");

        assertEquals("Not available", result.assessments().get(0).actualDuration());
        assertEquals("Not available", result.assessments().get(1).actualDuration());
        }

    @Test
    void resultsAreEmptyUntilRecruiterAssessmentSubmissionsExist() {
        when(assessments.findAllByRecruiterEmailOrderByCreatedAtDesc(RECRUITER)).thenReturn(List.of());
        when(submissions.findAllByRecruiterEmailOrderByCompletedAtDesc(RECRUITER)).thenReturn(List.of());

        Map<String, Object> response = service.results(RECRUITER, null, null, null, null);

        assertEquals(List.of(), response.get("items"));
        assertEquals(1, response.get("totalPages"));
        verify(submissions).findAllByRecruiterEmailOrderByCompletedAtDesc(RECRUITER);
    }

    @Test
    void resultsIncludeOnlyOwnedAssignedCandidateSubmissionsAndRankScores() {
        RecruiterAssessment assessment = assessment("assessment-1", RECRUITER, "published");
        RecruiterAssessmentSubmission submission = RecruiterAssessmentSubmission.builder()
                .id("submission-1").recruiterEmail(RECRUITER).assessmentId("assessment-1")
                .candidateEmail(CANDIDATE).score(88).passedTests(8).totalTests(10)
                .durationSeconds(900).status("completed").build();
        RecruiterAssessmentAssignment assignment = RecruiterAssessmentAssignment.builder()
                .id("assignment-1").recruiterEmail(RECRUITER).assessmentId("assessment-1")
                .candidateEmail(CANDIDATE).decision("shortlisted").build();
        User candidate = new User();
        candidate.setEmail(CANDIDATE);
        candidate.setFullName("Candidate Name");
        candidate.setRole(Role.CANDIDATE);
        when(assessments.findAllByRecruiterEmailOrderByCreatedAtDesc(RECRUITER)).thenReturn(List.of(assessment));
        when(submissions.findAllByRecruiterEmailOrderByCompletedAtDesc(RECRUITER)).thenReturn(List.of(submission));
        when(assignments.findByRecruiterEmailAndAssessmentIdAndCandidateEmail(RECRUITER, "assessment-1", CANDIDATE))
                .thenReturn(Optional.of(assignment));
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(candidate));

        @SuppressWarnings("unchecked")
        List<com.skillquest.dto.RecruiterAssessmentResultDto> items =
                (List<com.skillquest.dto.RecruiterAssessmentResultDto>) service
                        .results(RECRUITER, null, null, null, null).get("items");

        assertEquals(1, items.size());
        assertEquals("Candidate Name", items.get(0).candidateName());
        assertEquals("assessment-1", items.get(0).assessmentId());
        assertEquals(88, items.get(0).score());
        assertEquals(1, items.get(0).rank());
        assertEquals("shortlisted", items.get(0).decision());
    }

    @Test
    void analyticsAggregateOnlyRecruiterOwnedAssessmentAndResultRecords() {
        RecruiterAssessment assessment = assessment("assessment-1", RECRUITER, "published");
        RecruiterAssessmentSubmission submission = RecruiterAssessmentSubmission.builder()
                .id("submission-1").recruiterEmail(RECRUITER).assessmentId("assessment-1")
                .candidateEmail(CANDIDATE).score(84).status("completed").build();
        RecruiterAssessmentAssignment assignment = RecruiterAssessmentAssignment.builder()
                .id("assignment-1").recruiterEmail(RECRUITER).assessmentId("assessment-1")
                .candidateEmail(CANDIDATE).status("completed").build();
        User candidate = new User();
        candidate.setEmail(CANDIDATE);
        candidate.setFullName("Candidate Name");
        candidate.setRole(Role.CANDIDATE);
        when(assessments.findAllByRecruiterEmailOrderByCreatedAtDesc(RECRUITER)).thenReturn(List.of(assessment));
        when(assignments.findAllByRecruiterEmailOrderByAssignedAtDesc(RECRUITER)).thenReturn(List.of(assignment));
        when(assignments.findAllByRecruiterEmailAndAssessmentId(RECRUITER, "assessment-1")).thenReturn(List.of(assignment));
        when(submissions.findAllByRecruiterEmailOrderByCompletedAtDesc(RECRUITER)).thenReturn(List.of(submission));
        when(assignments.findByRecruiterEmailAndAssessmentIdAndCandidateEmail(RECRUITER, "assessment-1", CANDIDATE))
                .thenReturn(Optional.of(assignment));
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(candidate));

        Map<String, Object> analytics = service.analytics(RECRUITER);

        assertEquals(1, analytics.get("totalAssessments"));
        assertEquals(1, analytics.get("assignedCandidates"));
        assertEquals(100L, analytics.get("completionRate"));
        assertEquals(84L, analytics.get("averageScore"));
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> activity = (List<Map<String, Object>>) analytics.get("assessmentActivity");
        assertEquals(1, activity.size());
        assertEquals(1, activity.get(0).get("completed"));
        assertEquals(84L, activity.get(0).get("averageScore"));
    }

    private RecruiterAssessmentRequest validAssessmentRequest() {
        RecruiterAssessmentRequest request = new RecruiterAssessmentRequest();
        request.setTitle("Frontend hiring");
        request.setDescription("Frontend assessment");
        request.setType("coding");
        request.setTechnology("JavaScript");
        request.setInstructions("Complete the challenge");
        request.setDurationMinutes(45);
        request.setPassingScore(70);
        request.setAllowedAttempts(1);
        request.setStatus("draft");
        return request;
    }

    private RecruiterAssessmentQuestionRequest questionRequest(String id, String type, List<String> options,
                                                                 List<String> correctAnswers, int marks) {
        RecruiterAssessmentQuestionRequest request = new RecruiterAssessmentQuestionRequest();
        request.setId(id);
        request.setType(type);
        request.setPrompt("Question prompt");
        request.setOptions(options);
        request.setCorrectAnswers(correctAnswers);
        request.setMarks(marks);
        return request;
    }

    private RecruiterAssessment assessment(String id, String owner, String status) {
        return RecruiterAssessment.builder().id(id).recruiterEmail(owner).title("Frontend hiring")
                .description("Frontend assessment").type("coding").technology("JavaScript")
                .durationMinutes(45).passingScore(70).allowedAttempts(1).status(status).build();
    }

    private User candidateUser() {
        User candidate = new User();
        candidate.setEmail(CANDIDATE);
        candidate.setFullName("Candidate Name");
        candidate.setRole(Role.CANDIDATE);
        return candidate;
    }
}
