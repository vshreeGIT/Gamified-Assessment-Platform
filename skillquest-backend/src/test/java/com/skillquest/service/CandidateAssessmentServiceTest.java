package com.skillquest.service;

import com.skillquest.dto.CandidateAssessmentSubmissionRequest;
import com.skillquest.entity.CommunicationOption;
import com.skillquest.entity.CommunicationQuestion;
import com.skillquest.entity.ReasoningQuestion;
import com.skillquest.entity.RecruiterAssessment;
import com.skillquest.entity.RecruiterAssessmentAssignment;
import com.skillquest.entity.RecruiterAssessmentQuestion;
import com.skillquest.entity.RecruiterAssessmentSubmission;
import com.skillquest.repository.CommunicationQuestionRepository;
import com.skillquest.repository.ReasoningQuestionRepository;
import com.skillquest.repository.RecruiterAssessmentAssignmentRepository;
import com.skillquest.repository.RecruiterAssessmentRepository;
import com.skillquest.repository.RecruiterAssessmentSubmissionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CandidateAssessmentServiceTest {
    private static final String ASSESSMENT_ID = "assessment-1";
    private static final String CANDIDATE_EMAIL = "candidate@example.com";
    private static final String RECRUITER_EMAIL = "recruiter@example.com";

    private RecruiterAssessmentRepository assessmentRepository;
    private RecruiterAssessmentAssignmentRepository assignmentRepository;
    private RecruiterAssessmentSubmissionRepository submissionRepository;
    private ReasoningQuestionRepository reasoningQuestionRepository;
    private CommunicationQuestionRepository communicationQuestionRepository;
    private CandidateAssessmentService service;

    @BeforeEach
    void setUp() {
        assessmentRepository = mock(RecruiterAssessmentRepository.class);
        assignmentRepository = mock(RecruiterAssessmentAssignmentRepository.class);
        submissionRepository = mock(RecruiterAssessmentSubmissionRepository.class);
        reasoningQuestionRepository = mock(ReasoningQuestionRepository.class);
        communicationQuestionRepository = mock(CommunicationQuestionRepository.class);
        service = new CandidateAssessmentService(assessmentRepository, assignmentRepository, submissionRepository,
                reasoningQuestionRepository, communicationQuestionRepository);
    }

    @Test
    void candidateCannotFetchUnassignedAssessment() {
        when(assessmentRepository.findById(ASSESSMENT_ID)).thenReturn(Optional.of(assessment("aptitude")));
        when(assignmentRepository.findByAssessmentIdAndCandidateEmail(ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.getAssessment(CANDIDATE_EMAIL, ASSESSMENT_ID));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
        verify(reasoningQuestionRepository, never()).findAllById(any());
    }

    @Test
    void candidateCannotSubmitUnassignedAssessment() {
        when(assessmentRepository.findById(ASSESSMENT_ID)).thenReturn(Optional.of(assessment("aptitude")));
        when(assignmentRepository.findByAssessmentIdAndCandidateEmail(ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.submitAssessment(CANDIDATE_EMAIL, ASSESSMENT_ID, request("attempt-key", Map.of())));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
        verify(submissionRepository, never()).save(any(RecruiterAssessmentSubmission.class));
    }

    @Test
    void fetchReturnsStoredAptitudeQuestionAndAssignmentMetadata() {
        ReasoningQuestion question = reasoningQuestion();
        when(assessmentRepository.findById(ASSESSMENT_ID)).thenReturn(Optional.of(assessment("aptitude")));
        when(assignmentRepository.findByAssessmentIdAndCandidateEmail(ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(Optional.of(assignment()));
        when(submissionRepository.findAllByAssessmentIdAndCandidateEmail(ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(List.of());
        when(reasoningQuestionRepository.findAllById(List.of("q1"))).thenReturn(List.of(question));

        var result = service.getAssessment(CANDIDATE_EMAIL, ASSESSMENT_ID);

        assertEquals("Assessment", result.title());
        assertEquals(2, result.remainingAttempts());
        assertEquals("q1", result.questions().get(0).get("id"));
        assertEquals(List.of("A", "B"), result.questions().get(0).get("choices"));
    }

    @Test
    void fetchClearlyReportsUnsupportedAssessmentTypes() {
        when(assessmentRepository.findById(ASSESSMENT_ID)).thenReturn(Optional.of(assessment("coding")));
        when(assignmentRepository.findByAssessmentIdAndCandidateEmail(ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(Optional.of(assignment()));
        when(submissionRepository.findAllByAssessmentIdAndCandidateEmail(ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(List.of());

        var result = service.getAssessment(CANDIDATE_EMAIL, ASSESSMENT_ID);

        assertEquals("Assessments of type 'coding' cannot be submitted because no candidate question bank is connected for this type",
                result.unsupportedType());
        assertEquals(List.of(), result.questions());
    }

    @Test
    void fetchReturnsCustomQuestionDataWithoutAnswerKeys() {
        RecruiterAssessment assessment = assessment("coding");
        assessment.setQuestions(customQuestions());
        prepareAssessment(assessment);
        when(submissionRepository.findAllByAssessmentIdAndCandidateEmail(ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(List.of());

        var result = service.getAssessment(CANDIDATE_EMAIL, ASSESSMENT_ID);

        assertEquals(3, result.questions().size());
        assertEquals("MULTIPLE_SELECT", result.questions().get(1).get("type"));
        assertEquals(List.of("Redis", "Kafka", "SQLite"), result.questions().get(1).get("choices"));
        assertEquals(3, result.questions().get(1).get("marks"));
        assertEquals(false, result.questions().get(0).containsKey("correctAnswers"));
        assertEquals(false, result.questions().get(0).containsKey("answer"));
        assertEquals(null, result.unsupportedType());
    }

    @Test
    void customQuestionSubmissionUsesWeightedMarksAndAllThreeAnswerTypes() {
        RecruiterAssessment assessment = assessment("coding");
        assessment.setQuestions(customQuestions());
        prepareAssessment(assessment);
        when(submissionRepository.findBySubmissionKeyAndAssessmentIdAndCandidateEmail("attempt-key", ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(Optional.empty());
        when(submissionRepository.findAllByAssessmentIdAndCandidateEmail(ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(List.of());
        when(submissionRepository.save(any(RecruiterAssessmentSubmission.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(assignmentRepository.save(any(RecruiterAssessmentAssignment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Map<String, Object> answers = Map.of(
                "mcq", "Spring",
                "multi", List.of("Redis", "Kafka"),
                "short", "spring   boot");
        RecruiterAssessmentSubmission result = service.submitAssessment(CANDIDATE_EMAIL, ASSESSMENT_ID,
                request("attempt-key", answers));

        assertEquals(100, result.getScore());
        assertEquals(3, result.getPassedTests());
        assertEquals(3, result.getTotalTests());
    }

    @Test
    void customQuestionScoreWeightsCorrectAnswersByMarks() {
        RecruiterAssessment assessment = assessment("coding");
        assessment.setQuestions(customQuestions());
        prepareAssessment(assessment);
        when(submissionRepository.findBySubmissionKeyAndAssessmentIdAndCandidateEmail("attempt-key", ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(Optional.empty());
        when(submissionRepository.findAllByAssessmentIdAndCandidateEmail(ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(List.of());
        when(submissionRepository.save(any(RecruiterAssessmentSubmission.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(assignmentRepository.save(any(RecruiterAssessmentAssignment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RecruiterAssessmentSubmission result = service.submitAssessment(CANDIDATE_EMAIL, ASSESSMENT_ID,
                request("attempt-key", Map.of("mcq", "Spring", "multi", List.of("Redis"))));

        assertEquals(20, result.getScore());
        assertEquals(1, result.getPassedTests());
    }

    @Test
    void submissionSavesScoreAndCompletesAssignment() {
        prepareAssessment("aptitude");
        when(reasoningQuestionRepository.findAllById(List.of("q1"))).thenReturn(List.of(reasoningQuestion()));
        when(reasoningQuestionRepository.findById("q1")).thenReturn(Optional.of(reasoningQuestion()));
        when(submissionRepository.findBySubmissionKeyAndAssessmentIdAndCandidateEmail("attempt-key", ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(Optional.empty());
        when(submissionRepository.findAllByAssessmentIdAndCandidateEmail(ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(List.of());
        when(submissionRepository.save(any(RecruiterAssessmentSubmission.class))).thenAnswer(invocation -> {
            RecruiterAssessmentSubmission submission = invocation.getArgument(0);
            submission.setId("submission-1");
            return submission;
        });
        when(assignmentRepository.save(any(RecruiterAssessmentAssignment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CandidateAssessmentSubmissionRequest submissionRequest = request("attempt-key", Map.of("q1", "A"));
        long startedAt = System.currentTimeMillis() - 12 * 60 * 1000L;
        submissionRequest.setStartedAtEpochMillis(startedAt);
        RecruiterAssessmentSubmission result = service.submitAssessment(CANDIDATE_EMAIL, ASSESSMENT_ID,
                submissionRequest);

        assertEquals(100, result.getScore());
        assertEquals(1, result.getAttemptNumber());
        assertEquals("attempt-key", result.getSubmissionKey());
        assertEquals("completed", result.getStatus());
        assertEquals(startedAt, result.getStartedAtEpochMillis());
        assertTrue(result.getDurationSeconds() >= 12 * 60);
        verify(assignmentRepository).save(any(RecruiterAssessmentAssignment.class));
    }

    @Test
    void submissionAcceptsCommunicationOptionIds() {
        prepareAssessment("skill");
        CommunicationQuestion question = CommunicationQuestion.builder()
                .id("q1").prompt("Choose an action")
                .options(List.of(
                        CommunicationOption.builder().id("option-a").text("Ask for context").points(2).build(),
                        CommunicationOption.builder().id("option-b").text("Ignore it").points(0).build()))
                .build();
        when(communicationQuestionRepository.findAllById(List.of("q1"))).thenReturn(List.of(question));
        when(communicationQuestionRepository.findById("q1")).thenReturn(Optional.of(question));
        when(submissionRepository.findBySubmissionKeyAndAssessmentIdAndCandidateEmail("attempt-key", ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(Optional.empty());
        when(submissionRepository.findAllByAssessmentIdAndCandidateEmail(ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(List.of());
        when(submissionRepository.save(any(RecruiterAssessmentSubmission.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(assignmentRepository.save(any(RecruiterAssessmentAssignment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RecruiterAssessmentSubmission result = service.submitAssessment(CANDIDATE_EMAIL, ASSESSMENT_ID,
                request("attempt-key", Map.of("q1", "option-a")));

        assertEquals(100, result.getScore());
        assertEquals(1, result.getPassedTests());
    }

    @Test
    void submissionRejectsChoiceNotInStoredQuestion() {
        prepareAssessment("aptitude");
        when(reasoningQuestionRepository.findAllById(List.of("q1"))).thenReturn(List.of(reasoningQuestion()));
        when(submissionRepository.findBySubmissionKeyAndAssessmentIdAndCandidateEmail("attempt-key", ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(Optional.empty());
        when(submissionRepository.findAllByAssessmentIdAndCandidateEmail(ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(List.of());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.submitAssessment(CANDIDATE_EMAIL, ASSESSMENT_ID, request("attempt-key", Map.of("q1", "not-an-option"))));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verify(submissionRepository, never()).save(any(RecruiterAssessmentSubmission.class));
    }

    @Test
    void expiredAssessmentCannotBeSubmitted() {
        RecruiterAssessment expired = assessment("aptitude");
        expired.setDeadline(LocalDateTime.now().minusMinutes(1));
        prepareAssessment(expired);
        when(submissionRepository.findBySubmissionKeyAndAssessmentIdAndCandidateEmail("attempt-key", ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.submitAssessment(CANDIDATE_EMAIL, ASSESSMENT_ID, request("attempt-key", Map.of("q1", "A"))));

        assertEquals(HttpStatus.GONE, exception.getStatusCode());
        verify(submissionRepository, never()).save(any(RecruiterAssessmentSubmission.class));
    }

    @Test
    void submissionIsBlockedWhenAttemptLimitIsReached() {
        RecruiterAssessment limited = assessment("aptitude");
        limited.setAllowedAttempts(1);
        prepareAssessment(limited);
        when(submissionRepository.findBySubmissionKeyAndAssessmentIdAndCandidateEmail("attempt-key", ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(Optional.empty());
        when(submissionRepository.findAllByAssessmentIdAndCandidateEmail(ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(List.of(RecruiterAssessmentSubmission.builder().id("prior").build()));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.submitAssessment(CANDIDATE_EMAIL, ASSESSMENT_ID, request("attempt-key", Map.of("q1", "A"))));

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        verify(submissionRepository, never()).save(any(RecruiterAssessmentSubmission.class));
    }

    @Test
    void repeatedRequestWithSameAttemptKeyReturnsSavedSubmission() {
        prepareAssessment("aptitude");
        RecruiterAssessmentSubmission prior = RecruiterAssessmentSubmission.builder()
                .id("submission-1").submissionKey("attempt-key").score(100).status("completed").build();
        when(submissionRepository.findBySubmissionKeyAndAssessmentIdAndCandidateEmail("attempt-key", ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(Optional.of(prior));

        RecruiterAssessmentSubmission result = service.submitAssessment(CANDIDATE_EMAIL, ASSESSMENT_ID,
                request("attempt-key", Map.of("q1", "A")));

        assertSame(prior, result);
        verify(submissionRepository, never()).save(any(RecruiterAssessmentSubmission.class));
        verify(assignmentRepository, never()).save(any(RecruiterAssessmentAssignment.class));
    }

    private void prepareAssessment(String type) {
        prepareAssessment(assessment(type));
    }

    private void prepareAssessment(RecruiterAssessment assessment) {
        when(assessmentRepository.findById(ASSESSMENT_ID)).thenReturn(Optional.of(assessment));
        when(assignmentRepository.findByAssessmentIdAndCandidateEmail(ASSESSMENT_ID, CANDIDATE_EMAIL))
                .thenReturn(Optional.of(assignment()));
    }

    private RecruiterAssessment assessment(String type) {
        return RecruiterAssessment.builder()
                .id(ASSESSMENT_ID).recruiterEmail(RECRUITER_EMAIL).title("Assessment")
                .description("Description").type(type).technology("Technology")
                .durationMinutes(30).passingScore(70).allowedAttempts(2).status("published")
                .questionIds(List.of("q1")).build();
    }

    private RecruiterAssessmentAssignment assignment() {
        return RecruiterAssessmentAssignment.builder()
                .id("assignment-1").recruiterEmail(RECRUITER_EMAIL).assessmentId(ASSESSMENT_ID)
                .candidateEmail(CANDIDATE_EMAIL).status("in_progress").build();
    }

    private ReasoningQuestion reasoningQuestion() {
        return ReasoningQuestion.builder().id("q1").question("Choose A")
                .options(List.of("A", "B")).correctAnswer("A").build();
    }

    private List<RecruiterAssessmentQuestion> customQuestions() {
        return List.of(
                RecruiterAssessmentQuestion.builder().id("mcq").type("MCQ").prompt("Pick Spring")
                        .options(List.of("Spring", "Django")).correctAnswers(List.of("Spring")).marks(2).build(),
                RecruiterAssessmentQuestion.builder().id("multi").type("MULTIPLE_SELECT").prompt("Pick both brokers")
                        .options(List.of("Redis", "Kafka", "SQLite")).correctAnswers(List.of("Redis", "Kafka")).marks(3).build(),
                RecruiterAssessmentQuestion.builder().id("short").type("SHORT_ANSWER").prompt("Name the framework")
                        .options(List.of()).correctAnswers(List.of("Spring Boot")).marks(5).build());
    }

    private CandidateAssessmentSubmissionRequest request(String submissionKey, Map<String, Object> answers) {
        CandidateAssessmentSubmissionRequest request = new CandidateAssessmentSubmissionRequest();
        request.setSubmissionKey(submissionKey);
        request.setAnswers(new LinkedHashMap<>(answers));
        request.setDurationSeconds(60);
        return request;
    }
}
