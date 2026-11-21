package com.skillquest.service;

import com.skillquest.dto.RecruiterAssessmentDto;
import com.skillquest.dto.RecruiterAssessmentQuestionDto;
import com.skillquest.dto.RecruiterAssessmentQuestionRequest;
import com.skillquest.dto.RecruiterAssessmentRequest;
import com.skillquest.dto.RecruiterAssessmentResultDto;
import com.skillquest.dto.RecruiterCandidateDto;
import com.skillquest.dto.RecruiterDecisionRequest;
import com.skillquest.dto.RecruiterSettingsRequest;
import com.skillquest.dto.RecruiterAssignmentRequest;
import com.skillquest.entity.RecruiterAssessment;
import com.skillquest.entity.RecruiterAssessmentQuestion;
import com.skillquest.entity.RecruiterAssessmentAssignment;
import com.skillquest.entity.RecruiterAssessmentSubmission;
import com.skillquest.entity.RecruiterSettings;
import com.skillquest.entity.Role;
import com.skillquest.entity.User;
import com.skillquest.exception.UserNotFoundException;
import com.skillquest.repository.RecruiterAssessmentAssignmentRepository;
import com.skillquest.repository.RecruiterAssessmentRepository;
import com.skillquest.repository.RecruiterAssessmentSubmissionRepository;
import com.skillquest.repository.RecruiterSettingsRepository;
import com.skillquest.repository.UserRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class RecruiterService {
    private final RecruiterAssessmentRepository assessmentRepository;
    private final RecruiterAssessmentAssignmentRepository assignmentRepository;
    private final RecruiterAssessmentSubmissionRepository submissionRepository;
    private final RecruiterSettingsRepository settingsRepository;
    private final UserRepository userRepository;

    public RecruiterService(RecruiterAssessmentRepository assessmentRepository,
                            RecruiterAssessmentAssignmentRepository assignmentRepository,
                            RecruiterAssessmentSubmissionRepository submissionRepository,
                            RecruiterSettingsRepository settingsRepository,
                            UserRepository userRepository) {
        this.assessmentRepository = assessmentRepository;
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.settingsRepository = settingsRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> dashboard(String recruiterEmail) {
        List<RecruiterAssessment> assessments = assessmentRepository.findAllByRecruiterEmailOrderByCreatedAtDesc(recruiterEmail);
        List<RecruiterAssessmentAssignment> assignments = assignmentRepository.findAllByRecruiterEmailOrderByAssignedAtDesc(recruiterEmail);
        List<RecruiterAssessmentResultDto> results = resultDtos(recruiterEmail, null, null, null);
        double average = averageScore(results);
        long completed = results.size();
        long assignmentCount = assignments.size();
        long uniqueCandidates = assignments.stream().map(RecruiterAssessmentAssignment::getCandidateEmail).distinct().count();
        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("totalAssessments", assessments.size());
        metrics.put("activeAssessments", assessments.stream().filter(a -> "published".equals(a.getStatus())).count());
        metrics.put("totalCandidates", uniqueCandidates);
        metrics.put("completedAttempts", completed);
        metrics.put("completionRate", assignmentCount == 0 ? 0 : Math.round(completed * 100.0 / assignmentCount));
        metrics.put("averageScore", Math.round(average));
        Map<String, Object> dashboard = new LinkedHashMap<>();
        dashboard.put("metrics", metrics);
        dashboard.put("recentAssessments", assessments.stream().limit(5).map(this::toAssessmentDto).toList());
        dashboard.put("recentActivity", results.stream().limit(5).toList());
        dashboard.put("scoreDistribution", scoreDistribution(results));
        return dashboard;
    }

    public Map<String, Object> listAssessments(String recruiterEmail, String search, String status,
                                                String type, String technology) {
        List<RecruiterAssessmentDto> items = assessmentRepository
                .findAllByRecruiterEmailOrderByCreatedAtDesc(recruiterEmail).stream()
                .filter(a -> contains(a.getTitle() + " " + a.getDescription(), search))
                .filter(a -> blank(status) || status.equalsIgnoreCase(a.getStatus()))
                .filter(a -> blank(type) || type.equalsIgnoreCase(a.getType()))
                .filter(a -> blank(technology) || contains(a.getTechnology(), technology))
                .map(this::toAssessmentDto)
                .toList();
        return Map.of("items", items);
    }

    public RecruiterAssessmentDto createAssessment(String recruiterEmail, RecruiterAssessmentRequest request) {
        validateDates(request.getStartDate(), request.getDeadline());
        List<String> questionIds = request.getQuestionIds() == null
            ? new ArrayList<>() : new ArrayList<>(request.getQuestionIds());
        List<RecruiterAssessmentQuestion> questions = mapQuestions(request.getQuestions());
        String status = normalizeStatus(request.getStatus());
        requireQuestionsForPublication(status, false, questionCount(questionIds, questions));
        LocalDateTime now = LocalDateTime.now();
        RecruiterAssessment assessment = RecruiterAssessment.builder()
                .recruiterEmail(recruiterEmail)
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .type(request.getType().toLowerCase(Locale.ROOT))
                .technology(request.getTechnology().trim())
                .instructions(blank(request.getInstructions()) ? "Follow the selected challenge instructions and submit your best response." : request.getInstructions().trim())
                .durationMinutes(request.getDurationMinutes())
                .startDate(parseDate(request.getStartDate()))
                .deadline(parseDate(request.getDeadline()))
                .passingScore(request.getPassingScore())
                .allowedAttempts(request.getAllowedAttempts())
                .status(status)
                .questionIds(questionIds)
                .questions(questions)
                .createdAt(now)
                .updatedAt(now)
                .build();
        return toAssessmentDto(assessmentRepository.save(assessment));
    }

    public RecruiterAssessmentDto getAssessment(String recruiterEmail, String id) {
        return toAssessmentDto(requireAssessment(recruiterEmail, id));
    }

    public RecruiterAssessmentDto updateAssessment(String recruiterEmail, String id, RecruiterAssessmentRequest request) {
        validateDates(request.getStartDate(), request.getDeadline());
        RecruiterAssessment assessment = requireAssessment(recruiterEmail, id);
        List<String> questionIds = request.getQuestionIds() == null
            ? new ArrayList<>(safeList(assessment.getQuestionIds())) : new ArrayList<>(request.getQuestionIds());
        List<RecruiterAssessmentQuestion> questions = request.getQuestions() == null
            ? new ArrayList<>(safeList(assessment.getQuestions())) : mapQuestions(request.getQuestions());
        String status = normalizeStatus(request.getStatus());
        requireQuestionsForPublication(status, "published".equalsIgnoreCase(assessment.getStatus()),
            questionCount(questionIds, questions));
        assessment.setTitle(request.getTitle().trim());
        assessment.setDescription(request.getDescription().trim());
        assessment.setType(request.getType().toLowerCase(Locale.ROOT));
        assessment.setTechnology(request.getTechnology().trim());
        assessment.setInstructions(blank(request.getInstructions()) ? "Follow the selected challenge instructions and submit your best response." : request.getInstructions().trim());
        assessment.setDurationMinutes(request.getDurationMinutes());
        assessment.setStartDate(parseDate(request.getStartDate()));
        assessment.setDeadline(parseDate(request.getDeadline()));
        assessment.setPassingScore(request.getPassingScore());
        assessment.setAllowedAttempts(request.getAllowedAttempts());
        assessment.setStatus(status);
        assessment.setQuestionIds(questionIds);
        assessment.setQuestions(questions);
        assessment.setUpdatedAt(LocalDateTime.now());
        return toAssessmentDto(assessmentRepository.save(assessment));
    }

    public void deleteAssessment(String recruiterEmail, String id) {
        RecruiterAssessment assessment = requireAssessment(recruiterEmail, id);
        assignmentRepository.deleteAllByAssessmentIdAndRecruiterEmail(id, recruiterEmail);
        submissionRepository.deleteAllByRecruiterEmailAndAssessmentId(recruiterEmail, id);
        assessmentRepository.delete(assessment);
    }

    public RecruiterAssessmentDto assessmentAction(String recruiterEmail, String id, String action) {
        RecruiterAssessment original = requireAssessment(recruiterEmail, id);
        if ("duplicate".equals(action)) {
            LocalDateTime now = LocalDateTime.now();
            RecruiterAssessment duplicate = RecruiterAssessment.builder()
                    .recruiterEmail(recruiterEmail)
                    .title(original.getTitle() + " (copy)")
                    .description(original.getDescription())
                    .type(original.getType())
                    .technology(original.getTechnology())
                    .instructions(original.getInstructions())
                    .durationMinutes(original.getDurationMinutes())
                    .startDate(original.getStartDate())
                    .deadline(original.getDeadline())
                    .passingScore(original.getPassingScore())
                    .allowedAttempts(original.getAllowedAttempts())
                    .status("draft")
                    .questionIds(original.getQuestionIds() == null ? new ArrayList<>() : new ArrayList<>(original.getQuestionIds()))
                    .questions(copyQuestions(original.getQuestions()))
                    .createdAt(now)
                    .updatedAt(now)
                    .build();
            return toAssessmentDto(assessmentRepository.save(duplicate));
        }
        if (!"publish".equals(action) && !"close".equals(action)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported assessment action");
        }
        if ("publish".equals(action) && !"published".equalsIgnoreCase(original.getStatus())
                && questionCount(original.getQuestionIds(), original.getQuestions()) == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Add at least one question before publishing this assessment");
        }
        original.setStatus("publish".equals(action) ? "published" : "closed");
        original.setUpdatedAt(LocalDateTime.now());
        return toAssessmentDto(assessmentRepository.save(original));
    }

    public RecruiterCandidateDto assignCandidate(String recruiterEmail, String assessmentId, RecruiterAssignmentRequest request) {
        RecruiterAssessment assessment = requireAssessment(recruiterEmail, assessmentId);
        if (!"published".equals(assessment.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Candidates can only be assigned to published assessments");
        }
        User candidate = userRepository.findByEmailIgnoreCase(request.getEmail().trim())
                .filter(u -> u.getRole() == Role.CANDIDATE && u.isActive())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Candidate not found"));
        String candidateEmail = candidate.getEmail();
        if (assignmentRepository.findByAssessmentIdAndCandidateEmail(assessmentId, candidateEmail).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Candidate is already assigned to this assessment");
        }
        RecruiterAssessmentAssignment assignment = RecruiterAssessmentAssignment.builder()
                .id(UUID.nameUUIDFromBytes((assessmentId + "|" + candidateEmail).getBytes(StandardCharsets.UTF_8)).toString())
                .recruiterEmail(recruiterEmail)
                .assessmentId(assessmentId)
                .candidateEmail(candidateEmail)
                .status("in_progress")
                .assignedAt(LocalDateTime.now())
                .build();
        try {
            assignment = assignmentRepository.insert(assignment);
        } catch (DuplicateKeyException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Candidate is already assigned to this assessment");
        }
        return toCandidateDto(assignment, assessment, candidate);
    }

    public Map<String, Object> listCandidates(String recruiterEmail, String search, String status, String technology) {
        List<RecruiterCandidateDto> items = assignmentRepository
                .findAllByRecruiterEmailOrderByAssignedAtDesc(recruiterEmail).stream()
                .map(assignment -> candidateDtoIfAvailable(recruiterEmail, assignment))
                .filter(Objects::nonNull)
                .filter(c -> contains(c.name() + " " + c.email(), search))
                .filter(c -> blank(status) || status.equalsIgnoreCase(c.status()))
                .filter(c -> blank(technology) || contains(c.technology(), technology))
                .toList();
        return Map.of("items", items);
    }

    /**
     * Returns all active CANDIDATE users who are NOT yet assigned to the given assessment.
     * Only accessible to the recruiter who owns the assessment.
     */
    public Map<String, Object> listEligibleCandidates(String recruiterEmail, String assessmentId, String search) {
        requireAssessment(recruiterEmail, assessmentId);
        List<String> alreadyAssigned = assignmentRepository
                .findAllByRecruiterEmailAndAssessmentId(recruiterEmail, assessmentId).stream()
                .map(RecruiterAssessmentAssignment::getCandidateEmail)
                .toList();
        List<Map<String, String>> items = userRepository
                .findAllByRoleAndActiveTrue(Role.CANDIDATE).stream()
                .filter(u -> !alreadyAssigned.contains(u.getEmail()))
                .filter(u -> contains(u.getFullName() + " " + u.getEmail(), search))
                .map(u -> Map.of("id", u.getId(), "name", u.getFullName(), "email", u.getEmail()))
                .toList();
        return Map.of("items", items);
    }

    /**
     * Returns published assessments assigned to the given candidate email.
     * Used by the Candidate Dashboard to show recruiter-assigned work.
     */
    public List<Map<String, Object>> assignedAssessmentsForCandidate(String candidateEmail) {
        return assignmentRepository.findAllByCandidateEmail(candidateEmail).stream()
                .map(assignment -> {
                    RecruiterAssessment assessment = assessmentRepository.findById(assignment.getAssessmentId()).orElse(null);
                    if (assessment == null || !"published".equals(assessment.getStatus())) return null;
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("assignmentId", assignment.getId());
                    row.put("assessmentId", assessment.getId());
                    row.put("title", assessment.getTitle());
                    row.put("technology", assessment.getTechnology());
                    row.put("durationMinutes", assessment.getDurationMinutes());
                    row.put("passingScore", assessment.getPassingScore());
                    row.put("status", assignment.getStatus());
                    row.put("deadline", assessment.getDeadline());
                    return row;
                })
                .filter(Objects::nonNull)
                .toList();
    }

    public RecruiterCandidateDto getCandidate(String recruiterEmail, String assignmentId) {
        RecruiterAssessmentAssignment assignment = assignmentRepository.findByIdAndRecruiterEmail(assignmentId, recruiterEmail)
                .orElseThrow(() -> new UserNotFoundException("Candidate not found"));
        RecruiterCandidateDto candidate = candidateDtoIfAvailable(recruiterEmail, assignment);
        if (candidate == null) throw new UserNotFoundException("Candidate not found");
        return candidate;
    }

    public RecruiterCandidateDto updateDecision(String recruiterEmail, String assignmentId, RecruiterDecisionRequest request) {
        RecruiterAssessmentAssignment assignment = assignmentRepository.findByIdAndRecruiterEmail(assignmentId, recruiterEmail)
                .orElseThrow(() -> new UserNotFoundException("Candidate not found"));
        assignment.setDecision(request.getDecision());
        assignment.setNotes(request.getNotes() == null ? "" : request.getNotes().trim());
        assignmentRepository.save(assignment);
        return candidateDtoIfAvailable(recruiterEmail, assignment);
    }

    public Map<String, Object> results(String recruiterEmail, String search, String status,
                                       String technology, String assessmentFilter) {
        List<RecruiterAssessmentResultDto> items = resultDtos(recruiterEmail, search, status, technology).stream()
                .filter(result -> blank(assessmentFilter) || contains(result.assessmentName() + " " + result.assessmentId(), assessmentFilter))
                .sorted(Comparator.comparing(RecruiterAssessmentResultDto::score, Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(RecruiterAssessmentResultDto::completedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
        List<RecruiterAssessmentResultDto> ranked = new ArrayList<>();
        for (int i = 0; i < items.size(); i++) {
            RecruiterAssessmentResultDto item = items.get(i);
            ranked.add(new RecruiterAssessmentResultDto(item.id(), item.attemptId(), item.candidateId(), item.candidateName(),
                    item.assessmentId(), item.assessmentName(), item.technology(), item.score(), item.percentage(),
                    item.passedTests(), item.totalTests(), item.durationSeconds(), item.status(), i + 1,
                            item.decision(), item.completedAt()));
        }
        return Map.of("items", ranked, "totalPages", 1);
    }

    public Map<String, Object> analytics(String recruiterEmail) {
        List<RecruiterAssessment> assessments = assessmentRepository.findAllByRecruiterEmailOrderByCreatedAtDesc(recruiterEmail);
        List<RecruiterAssessmentAssignment> assignments = assignmentRepository.findAllByRecruiterEmailOrderByAssignedAtDesc(recruiterEmail);
        List<RecruiterAssessmentResultDto> results = resultDtos(recruiterEmail, null, null, null);
        long completed = results.size();
        Map<String, Object> analytics = new LinkedHashMap<>();
        analytics.put("totalAssessments", assessments.size());
        analytics.put("assignedCandidates", assignments.size());
        analytics.put("completionRate", assignments.isEmpty() ? 0 : Math.round(completed * 100.0 / assignments.size()));
        analytics.put("averageScore", Math.round(averageScore(results)));
        analytics.put("highestScore", results.stream().map(RecruiterAssessmentResultDto::score).filter(Objects::nonNull).max(Integer::compareTo).orElse(0));
        analytics.put("lowestScore", results.stream().map(RecruiterAssessmentResultDto::score).filter(Objects::nonNull).min(Integer::compareTo).orElse(0));
        analytics.put("scoreDistribution", scoreDistribution(results));
        Map<String, Double> technologyAverages = results.stream().filter(r -> r.score() != null)
                .collect(Collectors.groupingBy(RecruiterAssessmentResultDto::technology, Collectors.averagingInt(RecruiterAssessmentResultDto::score)));
        analytics.put("technologyPerformance", technologyAverages.entrySet().stream()
                .map(e -> Map.of("technology", e.getKey(), "averageScore", Math.round(e.getValue()))).toList());
        analytics.put("assessmentActivity", assessments.stream().map(assessment -> {
            List<RecruiterAssessmentResultDto> assessmentResults = results.stream()
                    .filter(r -> assessment.getId().equals(r.assessmentId())).toList();
            List<RecruiterAssessmentAssignment> assessmentAssignments = assignmentRepository
                    .findAllByRecruiterEmailAndAssessmentId(recruiterEmail, assessment.getId());
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("assessmentName", assessment.getTitle());
            row.put("technology", assessment.getTechnology());
            row.put("assigned", assessmentAssignments.size());
            row.put("completed", assessmentResults.size());
            row.put("averageScore", Math.round(averageScore(assessmentResults)));
            return row;
        }).toList());
        return analytics;
    }

    public Map<String, Object> settings(String recruiterEmail) {
        User user = requireUser(recruiterEmail);
        RecruiterSettings settings = settingsRepository.findById(recruiterEmail)
                .orElse(RecruiterSettings.builder().recruiterEmail(recruiterEmail).notificationsEnabled(true).build());
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("name", user.getFullName());
        response.put("email", user.getEmail());
        response.put("notificationsEnabled", settings.isNotificationsEnabled());
        return response;
    }

    public Map<String, Object> updateSettings(String recruiterEmail, RecruiterSettingsRequest request) {
        User user = requireUser(recruiterEmail);
        if (!user.getEmail().equalsIgnoreCase(request.getEmail().trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email cannot be changed from recruiter settings");
        }
        user.setFullName(request.getName().trim());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        settingsRepository.save(RecruiterSettings.builder()
                .recruiterEmail(recruiterEmail)
                .notificationsEnabled(request.isNotificationsEnabled())
                .updatedAt(LocalDateTime.now())
                .build());
        return settings(recruiterEmail);
    }

    private RecruiterAssessment requireAssessment(String recruiterEmail, String id) {
        return assessmentRepository.findByIdAndRecruiterEmail(id, recruiterEmail)
                .orElseThrow(() -> new UserNotFoundException("Assessment not found"));
    }

    private User requireUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    private RecruiterAssessmentDto toAssessmentDto(RecruiterAssessment assessment) {
        List<RecruiterAssessmentAssignment> assignments = assignmentRepository
                .findAllByRecruiterEmailAndAssessmentId(assessment.getRecruiterEmail(), assessment.getId());
        List<RecruiterAssessmentResultDto> results = resultDtos(assessment.getRecruiterEmail(), null, null, null).stream()
                .filter(r -> assessment.getId().equals(r.assessmentId())).toList();
        return new RecruiterAssessmentDto(assessment.getId(), assessment.getTitle(), assessment.getDescription(),
                assessment.getType(), assessment.getTechnology(), assessment.getInstructions(), assessment.getDurationMinutes(),
                assessment.getStartDate(), assessment.getDeadline(), assessment.getPassingScore(), assessment.getAllowedAttempts(),
                assessment.getStatus(), assessment.getCreatedAt(), questionCount(assessment.getQuestionIds(), assessment.getQuestions()),
                assignments.size(), results.size(), averageScore(results),
                assessment.getQuestionIds() == null ? List.of() : List.copyOf(assessment.getQuestionIds()),
                safeList(assessment.getQuestions()).stream().map(question -> new RecruiterAssessmentQuestionDto(
                        question.getId(), question.getType(), question.getPrompt(), safeList(question.getOptions()),
                        safeList(question.getCorrectAnswers()), question.getMarks())).toList());
    }

    private List<RecruiterAssessmentQuestion> mapQuestions(List<RecruiterAssessmentQuestionRequest> requests) {
        if (requests == null) return new ArrayList<>();
        Set<String> ids = new HashSet<>();
        List<RecruiterAssessmentQuestion> questions = new ArrayList<>();
        for (RecruiterAssessmentQuestionRequest request : requests) {
            String type = request.getType().trim().toUpperCase(Locale.ROOT);
            List<String> options = cleanValues(request.getOptions());
            List<String> correctAnswers = cleanValues(request.getCorrectAnswers());
            Set<String> normalizedOptions = new HashSet<>();
            options.forEach(option -> normalizedOptions.add(option.toLowerCase(Locale.ROOT)));
            if ("SHORT_ANSWER".equals(type)) {
                if (!options.isEmpty() || correctAnswers.size() != 1) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Short-answer questions need one expected answer and no options");
                }
            } else {
                if (options.size() < 2 || normalizedOptions.size() != options.size()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Objective questions need at least two unique options");
                }
                if (correctAnswers.isEmpty() || ("MCQ".equals(type) && correctAnswers.size() != 1)
                        || correctAnswers.stream().anyMatch(answer -> !options.contains(answer))) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Select valid correct answers for each objective question");
                }
            }
            String id = request.getId() == null || request.getId().isBlank()
                    ? UUID.randomUUID().toString() : request.getId().trim();
            if (!ids.add(id)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question IDs must be unique within an assessment");
            }
            questions.add(RecruiterAssessmentQuestion.builder()
                    .id(id).type(type).prompt(request.getPrompt().trim()).options(options)
                    .correctAnswers(correctAnswers).marks(request.getMarks()).build());
        }
        return questions;
    }

    private void requireQuestionsForPublication(String status, boolean alreadyPublished, int questionCount) {
        if ("published".equalsIgnoreCase(status) && !alreadyPublished && questionCount == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Add at least one question before publishing this assessment");
        }
    }

    private int questionCount(List<String> questionIds, List<RecruiterAssessmentQuestion> questions) {
        return questions != null && !questions.isEmpty() ? questions.size() : questionIds == null ? 0 : questionIds.size();
    }

    private <T> List<T> safeList(List<T> values) {
        return values == null ? List.of() : values;
    }

    private List<String> cleanValues(List<String> values) {
        if (values == null) return new ArrayList<>();
        return values.stream().map(String::trim).filter(value -> !value.isEmpty()).toList();
    }

    private List<RecruiterAssessmentQuestion> copyQuestions(List<RecruiterAssessmentQuestion> questions) {
        return safeList(questions).stream().map(question -> RecruiterAssessmentQuestion.builder()
                .id(question.getId()).type(question.getType()).prompt(question.getPrompt())
                .options(new ArrayList<>(safeList(question.getOptions())))
                .correctAnswers(new ArrayList<>(safeList(question.getCorrectAnswers())))
                .marks(question.getMarks()).build()).toList();
    }

    private RecruiterCandidateDto candidateDtoIfAvailable(String recruiterEmail, RecruiterAssessmentAssignment assignment) {
        RecruiterAssessment assessment = assessmentRepository.findByIdAndRecruiterEmail(assignment.getAssessmentId(), recruiterEmail).orElse(null);
        User user = userRepository.findByEmail(assignment.getCandidateEmail()).filter(u -> u.getRole() == Role.CANDIDATE).orElse(null);
        if (assessment == null || user == null) return null;
        return toCandidateDto(assignment, assessment, user);
    }

    private RecruiterCandidateDto toCandidateDto(RecruiterAssessmentAssignment assignment,
                                                  RecruiterAssessment assessment, User candidate) {
        List<RecruiterAssessmentSubmission> candidateSubmissions = submissionRepository
                .findAllByRecruiterEmailAndCandidateEmailOrderByCompletedAtDesc(assignment.getRecruiterEmail(), candidate.getEmail()).stream()
                .filter(submission -> assignment.getAssessmentId().equals(submission.getAssessmentId())).toList();
        RecruiterAssessmentSubmission latest = candidateSubmissions.stream().max(Comparator.comparing(
                RecruiterAssessmentSubmission::getCompletedAt, Comparator.nullsLast(Comparator.naturalOrder()))).orElse(null);
        return new RecruiterCandidateDto(assignment.getId(), assignment.getId(), candidate.getFullName(), candidate.getEmail(),
                assessment.getId(), assessment.getTitle(), assessment.getTechnology(), latest == null ? null : latest.getScore(),
                latest == null ? assignment.getStatus() : latest.getStatus(), latest == null ? assignment.getCompletedAt() : latest.getCompletedAt(),
                assignment.getDecision(), assignment.getNotes(), candidate.getPreferredRole(),
                candidateSubmissions.stream().map(submission -> new RecruiterCandidateDto.AssessmentHistory(
                        submission.getId(), submission.getId(), assessment.getId(), assessment.getTitle(),
                        submission.getCompletedAt(), submission.getStatus(), submission.getScore(),
                        submission.getDurationSeconds(), actualDuration(submission), 1,
                        submission.getScore() == null ? "Pending" : (submission.getScore() >= assessment.getPassingScore() ? "passed" : "failed"))).toList(),
                List.of());
    }

    private String actualDuration(RecruiterAssessmentSubmission submission) {
        Long startedAtEpochMillis = submission.getStartedAtEpochMillis();
        LocalDateTime completedAt = submission.getCompletedAt();
        if (startedAtEpochMillis == null || startedAtEpochMillis <= 0 || completedAt == null) {
            return "Not available";
        }

        Instant startedAt = Instant.ofEpochMilli(startedAtEpochMillis);
        Instant completed = completedAt.atZone(ZoneId.systemDefault()).toInstant();
        long seconds = Duration.between(startedAt, completed).getSeconds();
        if (seconds < 0) return "Not available";
        if (seconds < 60) return "Less than 1 min";

        long minutes = seconds / 60;
        if (minutes < 60) return minutes + " min";
        long hours = minutes / 60;
        long remainingMinutes = minutes % 60;
        return hours + " hr" + (remainingMinutes == 0 ? "" : " " + remainingMinutes + " min");
    }

    private List<RecruiterAssessmentResultDto> resultDtos(String recruiterEmail, String search, String status, String technology) {
        List<RecruiterAssessment> assessments = assessmentRepository.findAllByRecruiterEmailOrderByCreatedAtDesc(recruiterEmail);
        Map<String, RecruiterAssessment> byId = assessments.stream().collect(Collectors.toMap(RecruiterAssessment::getId, Function.identity()));
        return submissionRepository.findAllByRecruiterEmailOrderByCompletedAtDesc(recruiterEmail).stream()
                .filter(submission -> byId.containsKey(submission.getAssessmentId()))
                .map(submission -> {
                    RecruiterAssessment assessment = byId.get(submission.getAssessmentId());
                    User candidate = userRepository.findByEmail(submission.getCandidateEmail()).filter(u -> u.getRole() == Role.CANDIDATE).orElse(null);
                    if (candidate == null) return null;
                    RecruiterAssessmentAssignment assignment = assignmentRepository
                            .findByRecruiterEmailAndAssessmentIdAndCandidateEmail(
                                    recruiterEmail, assessment.getId(), candidate.getEmail()).orElse(null);
                    if (assignment == null) return null;
                    return new RecruiterAssessmentResultDto(submission.getId(), submission.getId(),
                            assignment.getId(), candidate.getFullName(), assessment.getId(),
                            assessment.getTitle(), assessment.getTechnology(), submission.getScore(), submission.getScore(),
                            submission.getPassedTests(), submission.getTotalTests(), submission.getDurationSeconds(),
                            submission.getStatus(), null, assignment.getDecision(), submission.getCompletedAt());
                })
                .filter(Objects::nonNull)
                .filter(r -> contains(r.candidateName(), search))
                .filter(r -> blank(status) || status.equalsIgnoreCase(r.status()))
                .filter(r -> blank(technology) || contains(r.technology(), technology))
                .toList();
    }

    private List<Map<String, Object>> scoreDistribution(List<RecruiterAssessmentResultDto> results) {
        List<Integer> scores = results.stream().map(RecruiterAssessmentResultDto::score).filter(Objects::nonNull).toList();
        return List.of(
                Map.of("label", "0–59%", "count", scores.stream().filter(s -> s < 60).count()),
                Map.of("label", "60–79%", "count", scores.stream().filter(s -> s >= 60 && s < 80).count()),
                Map.of("label", "80–100%", "count", scores.stream().filter(s -> s >= 80).count()));
    }

    private double averageScore(List<RecruiterAssessmentResultDto> results) {
        return results.stream().map(RecruiterAssessmentResultDto::score).filter(Objects::nonNull)
                .mapToInt(Integer::intValue).average().orElse(0);
    }

    private static boolean blank(String value) {
        return value == null || value.isBlank();
    }

    private static String normalizeStatus(String status) {
        return blank(status) ? "draft" : status.toLowerCase(Locale.ROOT);
    }

    private static boolean contains(String value, String query) {
        return blank(query) || (value != null && value.toLowerCase(Locale.ROOT).contains(query.toLowerCase(Locale.ROOT)));
    }

    private static void validateDates(String start, String deadline) {
        LocalDateTime parsedStart = parseDate(start);
        LocalDateTime parsedDeadline = parseDate(deadline);
        if (parsedStart != null && parsedDeadline != null && parsedDeadline.isBefore(parsedStart)) {
            throw new IllegalArgumentException("Deadline must be on or after the start date");
        }
    }

    private static LocalDateTime parseDate(String value) {
        if (blank(value)) return null;
        try {
            return LocalDateTime.parse(value);
        } catch (DateTimeParseException exception) {
            throw new IllegalArgumentException("Dates must use the ISO local date-time format", exception);
        }
    }
}
