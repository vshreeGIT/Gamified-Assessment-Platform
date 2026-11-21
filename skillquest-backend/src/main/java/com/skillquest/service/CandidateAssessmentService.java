package com.skillquest.service;

import com.skillquest.dto.CandidateAssessmentDto;
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
import org.springframework.http.HttpStatus;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CandidateAssessmentService {
    private final RecruiterAssessmentRepository assessmentRepository;
    private final RecruiterAssessmentAssignmentRepository assignmentRepository;
    private final RecruiterAssessmentSubmissionRepository submissionRepository;
    private final ReasoningQuestionRepository reasoningQuestionRepository;
    private final CommunicationQuestionRepository communicationQuestionRepository;

    public CandidateAssessmentService(RecruiterAssessmentRepository assessmentRepository,
                                      RecruiterAssessmentAssignmentRepository assignmentRepository,
                                      RecruiterAssessmentSubmissionRepository submissionRepository,
                                      ReasoningQuestionRepository reasoningQuestionRepository,
                                      CommunicationQuestionRepository communicationQuestionRepository) {
        this.assessmentRepository = assessmentRepository;
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.reasoningQuestionRepository = reasoningQuestionRepository;
        this.communicationQuestionRepository = communicationQuestionRepository;
    }

    public CandidateAssessmentDto getAssessment(String candidateEmail, String assessmentId) {
        RecruiterAssessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assessment not found"));
        RecruiterAssessmentAssignment assignment = assignmentRepository
                .findByAssessmentIdAndCandidateEmail(assessmentId, candidateEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "This assessment is not assigned to you"));
        if (!"published".equalsIgnoreCase(assessment.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This assessment is not published");
        }

        List<RecruiterAssessmentSubmission> submissions = submissionRepository
                .findAllByAssessmentIdAndCandidateEmail(assessmentId, candidateEmail);
        List<Map<String, Object>> questions = loadQuestions(assessment);
        String unsupportedType = hasCustomQuestions(assessment) || supportedType(assessment.getType()) ? null :
            "Assessments of type '" + assessment.getType()
                + "' cannot be submitted because no candidate question bank is connected for this type";

        int attemptsUsed = submissions.size();
        return new CandidateAssessmentDto(
                assessment.getId(), assessment.getTitle(), assessment.getDescription(), assessment.getType(),
                assessment.getTechnology(), assessment.getInstructions(), assessment.getDurationMinutes(),
                assessment.getStartDate(), assessment.getDeadline(), assessment.getPassingScore(),
                assessment.getAllowedAttempts(), attemptsUsed,
                Math.max(0, assessment.getAllowedAttempts() - attemptsUsed),
                assignment.getStatus(), unsupportedType, questions);
    }

    public RecruiterAssessmentSubmission submitAssessment(String candidateEmail, String assessmentId,
                                                           CandidateAssessmentSubmissionRequest request) {
        RecruiterAssessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assessment not found"));
        RecruiterAssessmentAssignment assignment = assignmentRepository
                .findByAssessmentIdAndCandidateEmail(assessmentId, candidateEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "This assessment is not assigned to you"));
        RecruiterAssessmentSubmission priorSubmission = submissionRepository
            .findBySubmissionKeyAndAssessmentIdAndCandidateEmail(request.getSubmissionKey(), assessmentId, candidateEmail)
            .orElse(null);
        if (priorSubmission != null) return priorSubmission;
        if (!"published".equalsIgnoreCase(assessment.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This assessment is not published");
        }
        LocalDateTime now = LocalDateTime.now();
        if (assessment.getDeadline() != null && now.isAfter(assessment.getDeadline())) {
            throw new ResponseStatusException(HttpStatus.GONE, "The assessment deadline has passed");
        }
        if (assessment.getStartDate() != null && now.isBefore(assessment.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The assessment has not started yet");
        }
        List<RecruiterAssessmentSubmission> existing = submissionRepository
                .findAllByAssessmentIdAndCandidateEmail(assessmentId, candidateEmail);
        if (existing.size() >= assessment.getAllowedAttempts()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No attempts remain for this assessment");
        }

        Map<String, Object> answers = request.getAnswers() == null
                ? new LinkedHashMap<>() : new LinkedHashMap<>(request.getAnswers());
        List<Map<String, Object>> questions = loadQuestions(assessment);
        if (questions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "This assessment has no candidate questions in a supported format");
        }
        boolean customQuestions = hasCustomQuestions(assessment);
        if (!customQuestions && !supportedType(assessment.getType())) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "This assessment type has no connected legacy question bank");
        }

        Map<String, Map<String, Object>> questionsById = new LinkedHashMap<>();
        for (Map<String, Object> question : questions) {
            questionsById.put(String.valueOf(question.get("id")), question);
        }
        for (String answerId : answers.keySet()) {
            if (!questionsById.containsKey(answerId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Submission includes an unknown question ID: " + answerId);
            }
            Object answer = answers.get(answerId);
            if (customQuestions) {
                RecruiterAssessmentQuestion question = assessment.getQuestions().stream()
                        .filter(item -> answerId.equals(item.getId())).findFirst().orElseThrow();
                validateCustomAnswer(question, answer);
            } else if (!(answer instanceof String selectedChoice)
                    || !isValidChoice(questionsById.get(answerId), selectedChoice)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Answer must match the stored format for question: " + answerId);
            }
        }

        Scoring scoring = customQuestions
                ? scoreCustomQuestions(assessment.getQuestions(), answers)
                : scoreLegacyQuestions(assessment.getType(), questions, answers);
        Long startedAtEpochMillis = validStartTimestamp(request.getStartedAtEpochMillis(), now);
        Integer actualDurationSeconds = null;
        if (startedAtEpochMillis != null) {
            long elapsedSeconds = Duration.between(Instant.ofEpochMilli(startedAtEpochMillis),
                now.atZone(ZoneId.systemDefault()).toInstant()).getSeconds();
            if (elapsedSeconds >= 0 && elapsedSeconds <= Integer.MAX_VALUE) {
            actualDurationSeconds = (int) elapsedSeconds;
            } else {
            startedAtEpochMillis = null;
            }
        }
        RecruiterAssessmentSubmission submission = RecruiterAssessmentSubmission.builder()
                .recruiterEmail(assessment.getRecruiterEmail())
                .assessmentId(assessmentId)
                .candidateEmail(candidateEmail)
                .score(scoring.score())
                .passedTests(scoring.passedTests())
                .totalTests(scoring.totalTests())
                .durationSeconds(actualDurationSeconds)
                .startedAtEpochMillis(startedAtEpochMillis)
                .status("completed")
                .completedAt(now)
                .attemptNumber(existing.size() + 1)
                .submissionKey(request.getSubmissionKey())
                .answers(new LinkedHashMap<>(answers))
                .build();
            try {
                submission = submissionRepository.save(submission);
            } catch (DuplicateKeyException exception) {
                return submissionRepository.findBySubmissionKeyAndAssessmentIdAndCandidateEmail(
                        request.getSubmissionKey(), assessmentId, candidateEmail)
                    .orElseThrow(() -> exception);
            }

        assignment.setStatus("completed");
        assignment.setCompletedAt(now);
        assignmentRepository.save(assignment);
        return submission;
    }

    private Long validStartTimestamp(Long startedAtEpochMillis, LocalDateTime completedAt) {
        if (startedAtEpochMillis == null || startedAtEpochMillis <= 0) return null;
        long completedAtEpochMillis = completedAt.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        return startedAtEpochMillis <= completedAtEpochMillis ? startedAtEpochMillis : null;
    }

    private boolean isValidChoice(Map<String, Object> question, String answer) {
        if (answer == null || answer.isBlank()) return false;
        Object rawChoices = question.get("choices");
        if (!(rawChoices instanceof List<?> choices)) return false;
        for (Object choice : choices) {
            if (choice instanceof String text && text.equals(answer)) return true;
            if (choice instanceof Map<?, ?> option && answer.equals(option.get("id"))) return true;
        }
        return false;
    }

    private void validateCustomAnswer(RecruiterAssessmentQuestion question, Object answer) {
        String type = question.getType().toUpperCase(Locale.ROOT);
        if ("MCQ".equals(type)) {
            if (!(answer instanceof String selected) || !question.getOptions().contains(selected)) {
                throw invalidAnswer(question.getId());
            }
            return;
        }
        if ("MULTIPLE_SELECT".equals(type)) {
            if (!(answer instanceof List<?> selected) || selected.stream().anyMatch(value -> !(value instanceof String))
                    || selected.stream().map(String.class::cast).anyMatch(value -> !question.getOptions().contains(value))
                    || selected.stream().distinct().count() != selected.size()) {
                throw invalidAnswer(question.getId());
            }
            return;
        }
        if ("SHORT_ANSWER".equals(type)) {
            if (!(answer instanceof String text) || text.length() > 2000) throw invalidAnswer(question.getId());
            return;
        }
        throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                "Unsupported question type: " + question.getType());
    }

    private ResponseStatusException invalidAnswer(String questionId) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Answer does not match the stored format for question: " + questionId);
    }

    private boolean supportedType(String type) {
        if (type == null) return false;
        String normalized = type.trim().toLowerCase(Locale.ROOT);
        return "aptitude".equals(normalized) || "skill".equals(normalized);
    }

    private List<Map<String, Object>> loadQuestions(RecruiterAssessment assessment) {
        if (hasCustomQuestions(assessment)) {
            return assessment.getQuestions().stream().map(question -> {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("id", question.getId());
                row.put("type", question.getType());
                row.put("prompt", question.getPrompt());
                row.put("choices", question.getOptions() == null ? List.of() : question.getOptions());
                row.put("marks", question.getMarks());
                return row;
            }).toList();
        }
        List<String> ids = assessment.getQuestionIds() == null ? List.of() : assessment.getQuestionIds();
        if (ids.isEmpty()) return List.of();

        String type = assessment.getType() == null ? "" : assessment.getType().toLowerCase(Locale.ROOT);
        if ("aptitude".equals(type)) {
            List<ReasoningQuestion> source = reasoningQuestionRepository.findAllById(ids);
            Map<String, ReasoningQuestion> byId = new LinkedHashMap<>();
            source.forEach(question -> byId.put(question.getId(), question));
            List<Map<String, Object>> questions = new ArrayList<>();
            for (String id : ids) {
                ReasoningQuestion question = byId.get(id);
                if (question == null) continue;
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("id", question.getId());
                row.put("type", "MULTIPLE_CHOICE");
                row.put("prompt", question.getQuestion());
                row.put("statement", question.getStatement());
                row.put("choices", question.getOptions());
                row.put("marks", 1);
                row.put("topic", question.getTopic());
                questions.add(row);
            }
            return questions;
        }
        if ("skill".equals(type)) {
            List<CommunicationQuestion> source = communicationQuestionRepository.findAllById(ids);
            Map<String, CommunicationQuestion> byId = new LinkedHashMap<>();
            source.forEach(question -> byId.put(question.getId(), question));
            List<Map<String, Object>> questions = new ArrayList<>();
            for (String id : ids) {
                CommunicationQuestion question = byId.get(id);
                if (question == null) continue;
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("id", question.getId());
                row.put("type", "MULTIPLE_CHOICE");
                row.put("prompt", question.getPrompt());
                row.put("statement", question.getScenario());
                row.put("category", question.getCategory());
                row.put("choices", question.getOptions() == null ? List.of() : question.getOptions().stream()
                        .map(option -> Map.of("id", option.getId(), "text", option.getText()))
                        .toList());
                row.put("marks", 1);
                questions.add(row);
            }
            return questions;
        }
        return List.of();
    }

    private Scoring scoreLegacyQuestions(String type, List<Map<String, Object>> questions,
                                         Map<String, Object> answers) {
        String normalized = type == null ? "" : type.toLowerCase(Locale.ROOT);
        if ("aptitude".equals(normalized)) {
            int correct = 0;
            for (Map<String, Object> question : questions) {
                String id = String.valueOf(question.get("id"));
                ReasoningQuestion source = reasoningQuestionRepository.findById(id).orElse(null);
                Object answer = answers.get(id);
                if (source != null && answer instanceof String && Objects.equals(source.getCorrectAnswer(), answer)) {
                    correct++;
                }
            }
            int percentage = questions.isEmpty() ? 0 : Math.round(correct * 100f / questions.size());
            return new Scoring(percentage, correct, questions.size());
        }

        int earned = 0;
        int maximum = 0;
        int passed = 0;
        for (Map<String, Object> question : questions) {
            String id = String.valueOf(question.get("id"));
            CommunicationQuestion source = communicationQuestionRepository.findById(id).orElse(null);
            if (source == null) continue;
            Object answer = answers.get(id);
            int questionMaximum = source.getOptions() == null ? 0 : source.getOptions().stream()
                    .mapToInt(CommunicationOption::getPoints).max().orElse(0);
            maximum += questionMaximum;
            if (answer instanceof String && source.getOptions() != null) {
                for (CommunicationOption option : source.getOptions()) {
                    if (option.getId().equals(answer)) {
                        earned += option.getPoints();
                        if (option.getPoints() == questionMaximum) passed++;
                        break;
                    }
                }
            }
        }
        int percentage = maximum == 0 ? 0 : Math.round(earned * 100f / maximum);
        return new Scoring(percentage, passed, questions.size());
    }

    private Scoring scoreCustomQuestions(List<RecruiterAssessmentQuestion> questions, Map<String, Object> answers) {
        int totalMarks = questions.stream().mapToInt(RecruiterAssessmentQuestion::getMarks).sum();
        int earnedMarks = 0;
        int correctCount = 0;
        for (RecruiterAssessmentQuestion question : questions) {
            Object answer = answers.get(question.getId());
            boolean correct = switch (question.getType().toUpperCase(Locale.ROOT)) {
                case "MCQ" -> answer instanceof String selected && question.getCorrectAnswers().contains(selected);
                case "MULTIPLE_SELECT" -> answer instanceof List<?> selected
                        && Set.copyOf(selected.stream().map(String.class::cast).toList())
                        .equals(Set.copyOf(question.getCorrectAnswers()));
                case "SHORT_ANSWER" -> answer instanceof String text && question.getCorrectAnswers().stream()
                        .anyMatch(expected -> normalizeAnswer(expected).equals(normalizeAnswer(text)));
                default -> false;
            };
            if (correct) {
                earnedMarks += question.getMarks();
                correctCount++;
            }
        }
        int percentage = totalMarks == 0 ? 0 : Math.round(earnedMarks * 100f / totalMarks);
        return new Scoring(percentage, correctCount, questions.size());
    }

    private String normalizeAnswer(String answer) {
        return answer.trim().replaceAll("\\s+", " ").toLowerCase(Locale.ROOT);
    }

    private boolean hasCustomQuestions(RecruiterAssessment assessment) {
        return assessment.getQuestions() != null && !assessment.getQuestions().isEmpty();
    }

    private record Scoring(int score, int passedTests, int totalTests) {}
}
