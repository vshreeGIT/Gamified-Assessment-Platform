package com.skillquest.service.impl;

import com.skillquest.dto.CommunicationActivityDto;
import com.skillquest.dto.CommunicationHubProgressDto;
import com.skillquest.dto.CommunicationHubResultDto;
import com.skillquest.dto.CommunicationHubResponse;
import com.skillquest.dto.CommunicationHubSubmitRequest;
import com.skillquest.dto.CommunicationRoleplayChoiceDto;
import com.skillquest.dto.CommunicationRoleplayTurnDto;
import com.skillquest.dto.CommunicationRoleplayMessageDto;
import com.skillquest.dto.CommunicationSubdivisionProgressDto;
import com.skillquest.entity.CommunicationActivity;
import com.skillquest.entity.CommunicationAssessmentSession;
import com.skillquest.entity.CommunicationAttempt;
import com.skillquest.entity.CommunicationRoleplayChoice;
import com.skillquest.entity.CommunicationRoleplayProgress;
import com.skillquest.entity.CommunicationRoleplayTurn;
import com.skillquest.entity.CommunicationRubricCriterion;
import com.skillquest.entity.User;
import com.skillquest.exception.AssessmentExpiredException;
import com.skillquest.exception.UserNotFoundException;
import com.skillquest.repository.CommunicationActivityRepository;
import com.skillquest.repository.CommunicationAssessmentSessionRepository;
import com.skillquest.repository.CommunicationAttemptRepository;
import com.skillquest.repository.UserRepository;
import com.skillquest.service.CommunicationHubService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class CommunicationHubServiceImpl implements CommunicationHubService {

    private static final int PASS_THRESHOLD = 70;
    private static final int BASE_XP = 100;
    private static final List<String> SUBDIVISIONS = List.of(
            "office-team", "customer-relations", "interview-career", "presentations", "conflict-etiquette");
    private static final Map<String, String> NAMES = Map.of(
            "office-team", "Office & Team Communication",
            "customer-relations", "Customer Relations",
            "interview-career", "Interview & Career Communication",
            "presentations", "Presentations & Public Speaking",
            "conflict-etiquette", "Conflict Resolution & Workplace Etiquette");

    private final CommunicationActivityRepository activityRepository;
    private final CommunicationAssessmentSessionRepository sessionRepository;
    private final CommunicationAttemptRepository attemptRepository;
    private final UserRepository userRepository;

    @Value("${skillquest.communication.subdivision-duration-minutes:5}")
    private int durationMinutes = 5;

    public CommunicationHubServiceImpl(CommunicationActivityRepository activityRepository,
                                       CommunicationAssessmentSessionRepository sessionRepository,
                                       CommunicationAttemptRepository attemptRepository,
                                       UserRepository userRepository) {
        this.activityRepository = activityRepository;
        this.sessionRepository = sessionRepository;
        this.attemptRepository = attemptRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void seedActivitiesIfMissing() {
        Set<String> presentIds = activityRepository.findAll().stream()
                .map(CommunicationActivity::getId).collect(Collectors.toSet());
        List<CommunicationActivity> missing = seedActivities().stream()
                .filter(activity -> !presentIds.contains(activity.getId())).collect(Collectors.toList());
        for (CommunicationActivity activity : missing) {
            try {
                activityRepository.insert(activity);
            } catch (DuplicateKeyException ignored) {
                // Another application instance may have inserted this seed ID concurrently.
            }
        }
    }

    @Override
    public List<CommunicationActivityDto> getActivities(String subdivisionId) {
        requireSubdivision(subdivisionId);
        List<CommunicationActivity> activities = activityRepository.findBySubdivisionIdOrderByIdAsc(subdivisionId);
        if (activities.isEmpty()) {
            seedActivitiesIfMissing();
            activities = activityRepository.findBySubdivisionIdOrderByIdAsc(subdivisionId);
        }
        return activities.stream().map(activity -> activityDto(activity, null)).toList();
    }

    @Override
    public synchronized CommunicationHubResponse start(String email, String subdivisionId) {
        requireSubdivision(subdivisionId);
        String sessionId = sessionId(email, subdivisionId);
        Optional<CommunicationAssessmentSession> current = sessionRepository.findById(sessionId);
        Instant now = Instant.now();
        if (current.isPresent()) {
            CommunicationAssessmentSession existing = current.get();
            if ("ACTIVE".equals(existing.getStatus()) && now.isBefore(existing.getDeadlineAt())
                    && attemptRepository.findByUserEmailAndSubmissionKey(email, existing.getSubmissionKey()).isEmpty()) {
                return toResponse(existing);
            }
            if ("ACTIVE".equals(existing.getStatus())) {
                existing.setStatus("EXPIRED");
                sessionRepository.save(existing);
            }
        }

        List<CommunicationActivity> activities = activityRepository.findBySubdivisionIdOrderByIdAsc(subdivisionId);
        if (activities.isEmpty()) {
            seedActivitiesIfMissing();
            activities = activityRepository.findBySubdivisionIdOrderByIdAsc(subdivisionId);
        }
        if (activities.isEmpty()) throw new IllegalStateException("No activities are configured for this subdivision.");

        Map<String, CommunicationRoleplayProgress> roleplayProgress = new HashMap<>();
        activities.stream().filter(activity -> "ROLEPLAY".equals(activity.getType())).forEach(activity ->
                roleplayProgress.put(activity.getId(), CommunicationRoleplayProgress.builder()
                        .currentTurnId(activity.getFirstTurnId()).choiceIds(new ArrayList<>()).build()));
        CommunicationAssessmentSession session = CommunicationAssessmentSession.builder()
                .id(sessionId).userEmail(email).submissionKey(UUID.randomUUID().toString()).status("ACTIVE")
                .startedAt(now).deadlineAt(now.plus(Duration.ofMinutes(durationMinutes)))
                .subdivisionId(subdivisionId).activities(activities).roleplayProgress(roleplayProgress).build();
        return toResponse(sessionRepository.save(session));
    }

    @Override
    public CommunicationHubResponse getSession(String email, String subdivisionId, String submissionKey) {
        requireSubdivision(subdivisionId);
        if (submissionKey == null || submissionKey.isBlank()) return start(email, subdivisionId);
        CommunicationAssessmentSession session = sessionRepository.findById(sessionId(email, subdivisionId))
                .filter(candidate -> submissionKey.equals(candidate.getSubmissionKey()))
                .orElseThrow(() -> new IllegalArgumentException("Communication subdivision session is invalid. Start or resume the assessment."));
        return toResponse(session);
    }

    @Override
    public synchronized CommunicationRoleplayTurnDto submitRoleplayTurn(
            String email, String subdivisionId, com.skillquest.dto.CommunicationRoleplayTurnRequest request) {
        CommunicationAssessmentSession session = activeSession(email, subdivisionId, request.getSubmissionKey());
        CommunicationActivity activity = session.getActivities().stream()
                .filter(item -> item.getId().equals(request.getActivityId()) && "ROLEPLAY".equals(item.getType()))
                .findFirst().orElseThrow(() -> new IllegalArgumentException("Roleplay activity is not part of this assessment."));
        CommunicationRoleplayProgress progress = session.getRoleplayProgress().get(activity.getId());
        if (progress == null || progress.getCurrentTurnId() == null) {
            throw new IllegalArgumentException("This roleplay is already complete.");
        }
        CommunicationRoleplayTurn currentTurn = findTurn(activity, progress.getCurrentTurnId());
        CommunicationRoleplayChoice choice = currentTurn.getChoices().stream()
                .filter(item -> item.getId().equals(request.getChoiceId())).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("That reply is not valid for the current conversation turn."));
        progress.getChoiceIds().add(choice.getId());
        progress.setCurrentTurnId(choice.getNextTurnId());
        sessionRepository.save(session);
        return turnDto(activity, progress.getCurrentTurnId());
    }

    @Override
    public synchronized CommunicationHubResultDto submit(String email, String subdivisionId,
                                                           CommunicationHubSubmitRequest request) {
        requireSubdivision(subdivisionId);
        String key = request.getSubmissionKey();
        if (key == null || key.isBlank()) throw new IllegalArgumentException("Assessment submission key is required.");
        Optional<CommunicationAttempt> duplicate = attemptRepository.findByUserEmailAndSubmissionKey(email, key);
        if (duplicate.isPresent()) {
            return toResult(duplicate.get(), "This submission was already recorded.");
        }
        CommunicationAssessmentSession session = activeSession(email, subdivisionId, key);
        Instant submittedAt = Instant.now();
        if (!submittedAt.isBefore(session.getDeadlineAt())) {
            session.setStatus("EXPIRED");
            sessionRepository.save(session);
            throw new AssessmentExpiredException("This subdivision assessment has expired. Your responses were not scored.");
        }

        Map<String, String> responses = request.getResponses() == null ? Map.of() : request.getResponses();
        Set<String> validTextIds = session.getActivities().stream()
                .filter(activity -> !"ROLEPLAY".equals(activity.getType()))
                .map(CommunicationActivity::getId).collect(Collectors.toSet());
        if (!validTextIds.containsAll(responses.keySet())) {
            throw new IllegalArgumentException("One or more response IDs do not belong to this assessment.");
        }
        if (responses.values().stream().anyMatch(value -> value != null && value.length() > 8000)) {
            throw new IllegalArgumentException("A response exceeds the allowed length.");
        }

        int score = 0;
        int maxScore = 0;
        int activitiesCompleted = 0;
        List<String> strengths = new ArrayList<>();
        List<String> areasToImprove = new ArrayList<>();
        for (CommunicationActivity activity : session.getActivities()) {
            if ("ROLEPLAY".equals(activity.getType())) {
                List<String> choices = session.getRoleplayProgress().get(activity.getId()).getChoiceIds();
                int roleplayScore = scoreRoleplay(activity, choices);
                int turnCount = roleplayTurnCount(activity);
                int turnsCompleted = Math.min(choices.size(), turnCount);
                score += turnCount == 0 ? 0 : Math.round((float) roleplayScore / turnCount);
                maxScore += 3;
                if (turnsCompleted == roleplayTurnCount(activity)) activitiesCompleted++;
                for (int index = 0; index < turnsCompleted; index++) {
                    String label = activity.getTitle() + " — conversation turn " + (index + 1);
                    if (choiceAt(activity, choices, index).getPoints() >= 2) strengths.add(label);
                    else areasToImprove.add(label);
                }
            } else {
                String response = responses.getOrDefault(activity.getId(), "");
                boolean responded = response != null && !response.isBlank();
                if (responded) activitiesCompleted++;
                List<CommunicationRubricCriterion> criteria = activity.getRubric() == null ? List.of() : activity.getRubric();
                maxScore += criteria.size();
                for (CommunicationRubricCriterion criterion : criteria) {
                    boolean met = matches(response, criterion.getMatchTerms());
                    if (met) {
                        score++;
                        strengths.add(activity.getTitle() + " — " + criterion.getLabel());
                    } else {
                        areasToImprove.add(activity.getTitle() + " — " + criterion.getLabel());
                    }
                }
            }
        }

        int accuracy = maxScore == 0 ? 0 : Math.round((float) score * 100 / maxScore);
        int earnedXp = calculateXp(accuracy);
        Map<String, List<String>> savedRoleplayChoices = session.getRoleplayProgress().entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, entry -> new ArrayList<>(entry.getValue().getChoiceIds())));
        CommunicationAttempt attempt = CommunicationAttempt.builder().id(key).userEmail(email)
                .score(score).maxScore(maxScore).accuracy(accuracy).passed(accuracy >= PASS_THRESHOLD)
                .earnedXp(earnedXp).timeTakenSeconds((int) Math.max(0,
                        Duration.between(session.getStartedAt(), submittedAt).getSeconds()))
                .submissionKey(key).completedAt(LocalDateTime.now()).subdivisionId(subdivisionId)
                .responses(new HashMap<>(responses)).roleplayChoices(savedRoleplayChoices)
                .strengths(strengths).areasToImprove(areasToImprove).activitiesCompleted(activitiesCompleted).build();
        try {
            attemptRepository.insert(attempt);
        } catch (DuplicateKeyException ex) {
            return attemptRepository.findByUserEmailAndSubmissionKey(email, key)
                    .map(saved -> toResult(saved, "This submission was already recorded.")).orElseThrow(() -> ex);
        }

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setXp(user.getXp() + earnedXp);
        user.setLevel((user.getXp() / 500) + 1);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        session.setStatus("COMPLETED");
        sessionRepository.save(session);
        return toResult(attempt, attempt.isPassed()
                ? "Subdivision passed. Communication Pro is awarded after any passing subdivision."
                : "Assessment saved. Review the checklist and try again when ready.");
    }

    @Override
    public CommunicationHubResultDto getAttempt(String email, String subdivisionId, String attemptId) {
        requireSubdivision(subdivisionId);
        CommunicationAttempt attempt = attemptRepository.findById(attemptId)
                .filter(saved -> email.equals(saved.getUserEmail()) && subdivisionId.equals(saved.getSubdivisionId()))
                .orElseThrow(() -> new IllegalArgumentException("Saved communication result was not found."));
        return toResult(attempt, attempt.isPassed() ? "Subdivision passed." : "Review the checklist and try again.");
    }

    @Override
    public CommunicationHubProgressDto getProgress(String email) {
        List<CommunicationAttempt> attempts = attemptRepository.findByUserEmailOrderByCompletedAtDesc(email);
        List<CommunicationSubdivisionProgressDto> subdivisions = new ArrayList<>();
        int completed = 0;
        for (String subdivisionId : SUBDIVISIONS) {
            List<CommunicationAttempt> matching = attempts.stream()
                    .filter(attempt -> subdivisionId.equals(attempt.getSubdivisionId())).toList();
            boolean passed = matching.stream().anyMatch(CommunicationAttempt::isPassed);
            boolean attempted = !matching.isEmpty();
            if (attempted) completed++;
            CommunicationAttempt best = matching.stream().max(Comparator.comparingInt(CommunicationAttempt::getAccuracy)).orElse(null);
            CommunicationAttempt latest = matching.stream().findFirst().orElse(null);
            subdivisions.add(CommunicationSubdivisionProgressDto.builder().subdivisionId(subdivisionId)
                    .subdivisionName(NAMES.get(subdivisionId)).progress(attempted ? 100 : 0)
                    .attempted(attempted).passed(passed).attemptCount(matching.size())
                    .bestAccuracy(best == null ? 0 : best.getAccuracy())
                    .earnedXp(matching.stream().mapToInt(CommunicationAttempt::getEarnedXp).sum())
                    .latestAttemptId(latest == null ? null : latest.getId())
                    .bestAttemptId(best == null ? null : best.getId()).build());
        }
        return CommunicationHubProgressDto.builder().completedSubdivisions(completed).totalSubdivisions(SUBDIVISIONS.size())
                .progress(Math.round((float) completed * 100 / SUBDIVISIONS.size())).attemptCount(attempts.size())
                .totalXpEarned(attempts.stream().mapToInt(CommunicationAttempt::getEarnedXp).sum())
                .communicationPro(attempts.stream().anyMatch(CommunicationAttempt::isPassed))
                .subdivisions(subdivisions).build();
    }

    private CommunicationAssessmentSession activeSession(String email, String subdivisionId, String key) {
        requireSubdivision(subdivisionId);
        CommunicationAssessmentSession session = sessionRepository.findById(sessionId(email, subdivisionId))
                .filter(candidate -> key != null && key.equals(candidate.getSubmissionKey()))
                .orElseThrow(() -> new IllegalArgumentException("Assessment session is invalid or no longer active."));
        if (!"ACTIVE".equals(session.getStatus())) throw new IllegalArgumentException("Assessment session is no longer active.");
        if (!Instant.now().isBefore(session.getDeadlineAt())) {
            session.setStatus("EXPIRED");
            sessionRepository.save(session);
            throw new AssessmentExpiredException("This subdivision assessment has expired. Your responses were not scored.");
        }
        return session;
    }

    private CommunicationHubResponse toResponse(CommunicationAssessmentSession session) {
        List<CommunicationActivityDto> activityDtos = session.getActivities().stream().map(activity -> {
            CommunicationRoleplayProgress progress = session.getRoleplayProgress() == null ? null
                    : session.getRoleplayProgress().get(activity.getId());
            return activityDto(activity, progress);
        }).toList();
        return CommunicationHubResponse.builder().subdivisionId(session.getSubdivisionId())
                .subdivisionName(NAMES.get(session.getSubdivisionId())).durationMinutes(durationMinutes)
                .submissionKey(session.getSubmissionKey()).deadlineAt(session.getDeadlineAt()).activities(activityDtos).build();
    }

    private CommunicationActivityDto activityDto(CommunicationActivity activity, CommunicationRoleplayProgress progress) {
        List<CommunicationRoleplayMessageDto> history = new ArrayList<>();
        if ("ROLEPLAY".equals(activity.getType())) {
            String turnId = activity.getFirstTurnId();
            history.add(CommunicationRoleplayMessageDto.builder().speaker("Other person")
                    .message(findTurn(activity, turnId).getMessage()).build());
            List<String> choices = progress == null ? List.of() : progress.getChoiceIds();
            for (int index = 0; index < choices.size(); index++) {
                CommunicationRoleplayTurn turn = findTurn(activity, turnId);
                String selectedChoiceId = choices.get(index);
                CommunicationRoleplayChoice choice = turn.getChoices().stream()
                        .filter(item -> item.getId().equals(selectedChoiceId)).findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("Saved conversation response is invalid."));
                history.add(CommunicationRoleplayMessageDto.builder().speaker("You").message(choice.getText()).build());
                turnId = choice.getNextTurnId();
                if (turnId != null) history.add(CommunicationRoleplayMessageDto.builder().speaker("Other person")
                        .message(findTurn(activity, turnId).getMessage()).build());
            }
        }
        String activeTurn = progress == null ? activity.getFirstTurnId() : progress.getCurrentTurnId();
        return CommunicationActivityDto.builder().id(activity.getId()).type(activity.getType()).title(activity.getTitle())
                .objective(activity.getObjective()).scenario(activity.getScenario()).instructions(activity.getInstructions())
                .audience(activity.getAudience()).prompt(activity.getPrompt())
                .rubricCriteria(activity.getRubric() == null ? List.of() : activity.getRubric().stream()
                        .map(CommunicationRubricCriterion::getLabel).toList())
                .currentTurn("ROLEPLAY".equals(activity.getType()) ? turnDto(activity, activeTurn) : null)
                .conversationHistory(history)
                .roleplayComplete("ROLEPLAY".equals(activity.getType()) && activeTurn == null).build();
    }

    private CommunicationRoleplayTurnDto turnDto(CommunicationActivity activity, String turnId) {
        if (turnId == null) return CommunicationRoleplayTurnDto.builder().complete(true).build();
        CommunicationRoleplayTurn turn = findTurn(activity, turnId);
        return CommunicationRoleplayTurnDto.builder().message(turn.getMessage()).complete(false)
                .choices(turn.getChoices().stream().map(choice -> CommunicationRoleplayChoiceDto.builder()
                        .id(choice.getId()).text(choice.getText()).build()).toList()).build();
    }

    private CommunicationHubResultDto toResult(CommunicationAttempt attempt, String message) {
        return CommunicationHubResultDto.builder().attemptId(attempt.getId()).subdivisionId(attempt.getSubdivisionId())
                .subdivisionName(NAMES.get(attempt.getSubdivisionId())).score(attempt.getScore()).maxScore(attempt.getMaxScore())
                .accuracy(attempt.getAccuracy()).passed(attempt.isPassed()).earnedXp(attempt.getEarnedXp())
                .activitiesCompleted(attempt.getActivitiesCompleted())
                .strengths(attempt.getStrengths() == null ? List.of() : attempt.getStrengths())
                .areasToImprove(attempt.getAreasToImprove() == null ? List.of() : attempt.getAreasToImprove())
                .message(message).build();
    }

    private boolean matches(String response, List<String> terms) {
        if (response == null || response.isBlank() || terms == null) return false;
        String normalized = response.toLowerCase(Locale.ROOT);
        return terms.stream().filter(term -> term != null && !term.isBlank())
                .anyMatch(term -> Pattern.compile("\\b" + Pattern.quote(term.toLowerCase(Locale.ROOT)) + "\\b")
                        .matcher(normalized).find());
    }

    private int scoreRoleplay(CommunicationActivity activity, List<String> choices) {
        int score = 0;
        for (int index = 0; index < Math.min(choices.size(), roleplayTurnCount(activity)); index++) {
            score += choiceAt(activity, choices, index).getPoints();
        }
        return score;
    }

    private CommunicationRoleplayChoice choiceAt(CommunicationActivity activity, List<String> choices, int index) {
        String turnId = activity.getFirstTurnId();
        CommunicationRoleplayChoice selected = null;
        for (int step = 0; step <= index; step++) {
            CommunicationRoleplayTurn turn = findTurn(activity, turnId);
            String choiceId = choices.get(step);
            selected = turn.getChoices().stream().filter(choice -> choice.getId().equals(choiceId)).findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Saved conversation response is invalid."));
            turnId = selected.getNextTurnId();
        }
        return selected;
    }

    private int roleplayTurnCount(CommunicationActivity activity) {
        return longestConversationPath(activity, activity.getFirstTurnId(), new HashSet<>());
    }

    private int longestConversationPath(CommunicationActivity activity, String turnId, Set<String> visited) {
        if (turnId == null || !visited.add(turnId)) return 0;
        CommunicationRoleplayTurn turn = findTurn(activity, turnId);
        int nextLength = turn.getChoices().stream()
                .mapToInt(choice -> longestConversationPath(activity, choice.getNextTurnId(), new HashSet<>(visited)))
                .max().orElse(0);
        return 1 + nextLength;
    }

    private CommunicationRoleplayTurn findTurn(CommunicationActivity activity, String turnId) {
        return activity.getTurns().stream().filter(turn -> turn.getId().equals(turnId)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Conversation turn is invalid."));
    }

    private void requireSubdivision(String subdivisionId) {
        if (!SUBDIVISIONS.contains(subdivisionId)) throw new IllegalArgumentException("Unknown communication subdivision.");
    }

    private String sessionId(String email, String subdivisionId) {
        return UUID.nameUUIDFromBytes((email + "|COMMUNICATION|" + subdivisionId).getBytes(StandardCharsets.UTF_8)).toString();
    }

    private int calculateXp(int accuracy) {
        if (accuracy >= 90) return BASE_XP;
        if (accuracy >= 80) return 85;
        if (accuracy >= 70) return 70;
        if (accuracy >= 50) return 40;
        return 20;
    }

    private List<CommunicationActivity> seedActivities() {
        List<CommunicationActivity> activities = new ArrayList<>();
        activities.add(textActivity("hub-office-speak-delay", "office-team", "SPEAKING", "Update your team about a delay",
                "Communicate status, impact, and a next step clearly.", "A project deliverable is two days behind because a dependency arrived late.",
                "Speak as if you are giving a short stand-up update. Acknowledge the impact, explain the current status, and give a next step with a timeline.",
                "Project team", "Give your concise update.", criteria("Acknowledge the impact", List.of("impact", "affect", "delay", "delayed", "late")),
                criteria("Explain the status or cause", List.of("dependency", "blocked", "waiting", "behind", "delay")),
                criteria("Give a next step and timeline", List.of("next", "plan", "update", "tomorrow", "friday", "date", "deliver"))));
        activities.add(textActivity("hub-office-write-status", "office-team", "WRITING", "Write a project status update",
                "Give stakeholders a useful and actionable status.", "Your deliverable is delayed and another team needs to know whether its work is affected.",
                "Write a brief status update that explains impact, current status, and the next action/timing.", "Project stakeholders", "Compose the status update.",
                criteria("State the impact", List.of("impact", "affect", "delay", "delayed", "late")),
                criteria("Give the current status", List.of("status", "currently", "blocked", "waiting", "behind")),
                criteria("Name the next action or timing", List.of("next", "plan", "update", "tomorrow", "friday", "date", "deliver"))));
        activities.add(roleplayActivity("hub-office-roleplay-owner", "office-team", "Resolve task ownership with a teammate",
                "Clarify responsibilities and agree on a practical handoff.", "A teammate believes you own a client handoff, while you understood that they would prepare it.",
                "Choose a reply each turn. The teammate's next message follows your response. The server scores whether your choices clarify ownership, share responsibility, and agree on a concrete next step; it does not score your writing style.",
                "Teammate", List.of(
                        turn("start", "I thought you were handling the client handoff. The client is asking for an update.",
                                choice("clarify", "I may have misunderstood. Can we confirm who owns each part and when we need it?", 3, "detail"),
                                choice("take", "I can take the next update now. Let's agree who prepares the handoff after that.", 2, "detail"),
                                choice("blame", "You were supposed to do it, so this is your responsibility.", 0, "concern")),
                        turn("detail", "I can prepare the notes, but I need you to confirm the delivery date.",
                                choice("coordinate", "That works. I'll confirm the date and send it with your notes.", 3, "close"),
                                choice("clarify_again", "What information do you need from me to confirm it?", 2, "close"),
                                choice("dismiss", "Just send what you have; I will figure it out.", 0, "close")),
                        turn("concern", "I want to help, but the handoff is already late and the client needs a clear plan.",
                                choice("reset", "You're right about the urgency. Let's split the next steps and send a clear update.", 3, "close"),
                                choice("ask_blocker", "What is ready now, and what is still blocking the handoff?", 2, "close"),
                                choice("escalate", "I'll tell the manager this was your fault.", 0, "close")),
                                turn("close", "Thanks. I'll prepare my part now. When should we send the client an update?",
                                        choice("set_time", "Let's send a concise update by 3 PM and flag any remaining risk.", 3, null),
                                        choice("vague", "Soon, once everything is done.", 0, null),
                                        choice("check", "I'll confirm the timing with the project lead and message you shortly.", 2, null))),
                "Clarify ownership without blame", "Share responsibility and coordinate the handoff", "Agree on a concrete next step and timeline"));
        activities.add(textActivity("hub-customer-speak-frustrated", "customer-relations", "SPEAKING", "Respond to a frustrated customer",
                "Acknowledge the customer's experience and set a reliable expectation.", "A customer has contacted support twice and still cannot access an important account feature.",
                "Speak a short response that recognizes the impact, explains what you will do next, and sets an update expectation.",
                "Customer", "Respond as the support representative.", criteria("Recognize the customer's impact", List.of("understand", "sorry", "frustrat", "impact", "inconvenien")),
                criteria("State a concrete action", List.of("check", "investigate", "review", "work with", "escalate")),
                criteria("Set an honest update expectation", List.of("update", "by", "today", "tomorrow", "time", "follow up"))));
        activities.add(roleplayActivity("hub-customer-roleplay-unresolved", "customer-relations", "Handle an unresolved customer issue",
                "Listen, clarify what remains unresolved, and agree on a follow-up.", "The customer says the troubleshooting steps did not solve the problem and they have lost time trying them.",
                "Select a response each turn. The customer's next message changes based on your reply. The server scores acknowledgement, useful clarification, and an honest follow-up choice; it does not score writing style.",
                "Customer", List.of(
                        turn("start", "I've already tried those steps twice. I still can't complete my order.",
                                choice("acknowledge", "I understand this has taken time. What happens when you reach the final step?", 3, "detail"),
                                choice("repeat", "Please try restarting the app one more time.", 0, "concern"),
                                choice("own", "I'm sorry those steps did not help. I'll review the order issue with you.", 2, "detail")),
                        turn("detail", "The payment page freezes after I confirm the delivery address.",
                                choice("investigate", "Thanks. I'll check the payment handoff and keep your order details in view.", 3, "plan"),
                                choice("clarify", "Does the page show an error, or does it stop responding?", 2, "plan"),
                                choice("deflect", "That sounds like a problem with your device.", 0, "concern")),
                        turn("concern", "I need this order today. I don't want to repeat everything again.",
                                choice("reassure", "I hear the urgency. I'll stay with this case and check the order status now.", 3, "plan"),
                                choice("context", "I can see why repeating the steps is frustrating. Let me check another route.", 2, "plan"),
                                choice("close", "There is nothing else I can do.", 0, "plan")),
                        turn("plan", "What should I expect next?",
                                choice("timeline", "I'll investigate now and update you within 30 minutes, even if it is not resolved yet.", 3, null),
                                choice("promise", "It will definitely be fixed today.", 0, null),
                                choice("handoff", "I'll send this to the billing team and give you the case reference and next update time.", 2, null))),
                "Acknowledge the customer's concern", "Clarify the unresolved issue and take ownership", "Set an honest follow-up and update time"));
        activities.add(textActivity("hub-interview-speak-star", "interview-career", "SPEAKING", "Answer a behavioral interview question",
                "Organize a concise answer with situation, task, action, and result.", "An interviewer asks: Tell me about a time you handled a difficult deadline.",
                "Speak a concise STAR response. Include the situation, your responsibility, actions you took, and the result.",
                "Interviewer", "Answer: Tell me about a time you handled a difficult deadline.", criteria("Describe the situation", List.of("when", "project", "team", "deadline", "situation")),
                criteria("Explain your responsibility and actions", List.of("responsible", "task", "planned", "prioritized", "coordinated", "action")),
                criteria("Share a result or lesson", List.of("result", "completed", "learned", "improved", "outcome", "delivered"))));
        activities.add(textActivity("hub-interview-write-followup", "interview-career", "WRITING", "Write an interview follow-up email",
                "Write a professional, specific follow-up to an interviewer.", "You interviewed yesterday for a project coordinator role and want to thank the panel.",
                "Write a concise email that thanks the interviewer, refers to one relevant discussion point, and closes with a professional next step.",
                "Interviewer", "Compose your follow-up email.", criteria("Thank the interviewer", List.of("thank", "appreciate")),
                criteria("Refer to a specific discussion point", List.of("discussion", "conversation", "project", "role", "team")),
                criteria("Close professionally or mention follow-up", List.of("regards", "sincerely", "look forward", "follow up", "next steps"))));
        activities.add(textActivity("hub-presentation-speak-pitch", "presentations", "SPEAKING", "Pitch a project clearly",
                "Explain the project's purpose, value, and next step in a short pitch.", "Your team has built a simple tool that reduces repeated data entry for customer support staff.",
                "Give a short pitch for a busy manager. Explain the problem, the value of the project, and a clear next step.",
                "Busy manager", "Deliver your short project pitch.", criteria("Explain the problem", List.of("problem", "repeated", "manual", "time", "entry")),
                criteria("Describe the value", List.of("reduce", "save", "faster", "benefit", "improve", "value")),
                criteria("Give a next step", List.of("next", "pilot", "test", "review", "launch", "step"))));
        activities.add(textActivity("hub-presentation-speak-simple", "presentations", "SPEAKING", "Explain a complex idea simply",
                "Use a plain-language explanation and a relevant example.", "A colleague from another department needs to understand what a software API does.",
                "Explain the idea without specialist jargon, then give a simple example and check whether the explanation is clear.",
                "Colleague outside your team", "Explain what an API does in simple language.", criteria("Use a plain-language explanation", List.of("connect", "share", "exchange", "send", "receive", "service")),
                criteria("Give an example or comparison", List.of("example", "like", "imagine", "for instance")),
                criteria("Check understanding", List.of("does that", "make sense", "clear", "question", "would you like"))));
        activities.add(textActivity("hub-conflict-write-feedback", "conflict-etiquette", "WRITING", "Give constructive colleague feedback",
                "Describe an observable issue, its impact, and a workable next step.", "A colleague's report has missing sources, making it difficult for the team to verify its conclusions.",
                "Write a private, respectful note. Refer to the specific issue, explain its impact, and suggest a next step.",
                "Colleague", "Compose constructive feedback.", criteria("Name the specific issue", List.of("source", "reference", "missing", "report", "example")),
                criteria("Explain the impact respectfully", List.of("impact", "difficult", "verify", "team", "concern")),
                criteria("Suggest a next step", List.of("could", "please", "next", "add", "review", "discuss", "work together"))));
        return activities;
    }

    private CommunicationActivity textActivity(String id, String subdivision, String type, String title, String objective,
                                                String scenario, String instructions, String audience, String prompt,
                                                CommunicationRubricCriterion... rubric) {
        return CommunicationActivity.builder().id(id).subdivisionId(subdivision).type(type).title(title)
                .objective(objective).scenario(scenario).instructions(instructions).audience(audience)
                .prompt(prompt).rubric(List.of(rubric)).build();
    }

    private CommunicationRubricCriterion criteria(String label, List<String> terms) {
        return CommunicationRubricCriterion.builder().label(label).matchTerms(terms).build();
    }

    private CommunicationActivity roleplayActivity(String id, String subdivision, String title, String objective,
                                                    String scenario, String instructions, String audience,
                                                    List<CommunicationRoleplayTurn> turns, String... rubricLabels) {
        return CommunicationActivity.builder().id(id).subdivisionId(subdivision).type("ROLEPLAY").title(title)
                .objective(objective).scenario(scenario).instructions(instructions).audience(audience)
                .firstTurnId("start").turns(turns)
                .rubric(java.util.Arrays.stream(rubricLabels).map(label -> criteria(label, List.of())).toList()).build();
    }

    private CommunicationRoleplayTurn turn(String id, String message, CommunicationRoleplayChoice... choices) {
        return CommunicationRoleplayTurn.builder().id(id).message(message).choices(List.of(choices)).build();
    }

    private CommunicationRoleplayChoice choice(String id, String text, int points, String nextTurnId) {
        return CommunicationRoleplayChoice.builder().id(id).text(text).points(points).nextTurnId(nextTurnId).build();
    }
}
