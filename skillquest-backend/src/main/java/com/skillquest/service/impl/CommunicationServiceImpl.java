package com.skillquest.service.impl;

import com.skillquest.dto.CommunicationOptionDto;
import com.skillquest.dto.CommunicationQuestionDto;
import com.skillquest.dto.CommunicationQuizResponse;
import com.skillquest.dto.CommunicationResultResponse;
import com.skillquest.dto.CommunicationSubmitRequest;
import com.skillquest.entity.CommunicationAssessmentSession;
import com.skillquest.entity.CommunicationAttempt;
import com.skillquest.entity.CommunicationOption;
import com.skillquest.entity.CommunicationQuestion;
import com.skillquest.entity.User;
import com.skillquest.exception.AssessmentExpiredException;
import com.skillquest.exception.UserNotFoundException;
import com.skillquest.repository.CommunicationAssessmentSessionRepository;
import com.skillquest.repository.CommunicationAttemptRepository;
import com.skillquest.repository.CommunicationQuestionRepository;
import com.skillquest.repository.UserRepository;
import com.skillquest.service.CommunicationService;
import jakarta.annotation.PostConstruct;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommunicationServiceImpl implements CommunicationService {

    private static final int QUESTION_COUNT = 10;
    private static final int DURATION_MINUTES = 10;
    private static final int BASE_XP = 100;
    private static final int PASS_THRESHOLD = 70;

    private final CommunicationQuestionRepository questionRepository;
    private final CommunicationAssessmentSessionRepository sessionRepository;
    private final CommunicationAttemptRepository attemptRepository;
    private final UserRepository userRepository;

    public CommunicationServiceImpl(CommunicationQuestionRepository questionRepository,
                                    CommunicationAssessmentSessionRepository sessionRepository,
                                    CommunicationAttemptRepository attemptRepository,
                                    UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.sessionRepository = sessionRepository;
        this.attemptRepository = attemptRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void seedQuestionBank() {
        ensureQuestionBank();
    }

    private void ensureQuestionBank() {
        List<CommunicationQuestion> existing = questionRepository.findAll();
        Set<String> existingIds = existing.stream()
                .map(CommunicationQuestion::getId)
                .collect(Collectors.toCollection(HashSet::new));
        List<CommunicationQuestion> missing = createSeedQuestions().stream()
                .filter(question -> !existingIds.contains(question.getId()))
                .collect(Collectors.toList());
        if (!missing.isEmpty()) {
            questionRepository.saveAll(missing);
        }
    }

    @Override
    public synchronized CommunicationQuizResponse startAssessment(String userEmail) {
        String sessionId = sessionDocumentId(userEmail);
        Optional<CommunicationAssessmentSession> current = sessionRepository.findById(sessionId);
        Instant now = Instant.now();

        if (current.isPresent()) {
            CommunicationAssessmentSession existing = current.get();
            boolean submitted = attemptRepository
                    .findByUserEmailAndSubmissionKey(userEmail, existing.getSubmissionKey())
                    .isPresent();
            if (!submitted && "ACTIVE".equals(existing.getStatus())
                    && now.isBefore(existing.getDeadlineAt())) {
                return toQuizResponse(existing);
            }
            if ("ACTIVE".equals(existing.getStatus()) && !now.isBefore(existing.getDeadlineAt())) {
                existing.setStatus("EXPIRED");
                sessionRepository.save(existing);
            }
        }

        CommunicationAssessmentSession session = CommunicationAssessmentSession.builder()
                .id(sessionId)
                .userEmail(userEmail)
                .submissionKey(UUID.randomUUID().toString())
                .status("ACTIVE")
                .startedAt(now)
                .deadlineAt(now.plus(Duration.ofMinutes(DURATION_MINUTES)))
                .questions(loadQuestions())
                .build();
        return toQuizResponse(sessionRepository.save(session));
    }

    @Override
    public CommunicationQuizResponse getAssessment(String userEmail, String submissionKey) {
        Optional<CommunicationAssessmentSession> current =
                sessionRepository.findById(sessionDocumentId(userEmail));
        if (current.isEmpty()) {
            if (submissionKey != null && !submissionKey.isBlank()) {
                throw new IllegalArgumentException("Communication assessment session is invalid. Start a new quest.");
            }
            return startAssessment(userEmail);
        }

        CommunicationAssessmentSession session = current.get();
        if (submissionKey != null && !submissionKey.isBlank()
                && !submissionKey.equals(session.getSubmissionKey())) {
            throw new IllegalArgumentException("Communication assessment session is no longer active. Start a new quest.");
        }
        return toQuizResponse(session);
    }

    private List<CommunicationQuestion> loadQuestions() {
        List<CommunicationQuestion> questions = questionRepository.findAll();
        if (questions.size() < QUESTION_COUNT) {
            ensureQuestionBank();
            questions = questionRepository.findAll();
        }
        return questions.stream()
                .sorted(Comparator.comparing(CommunicationQuestion::getId))
                .limit(QUESTION_COUNT)
                .collect(Collectors.toList());
    }

    private CommunicationQuizResponse toQuizResponse(CommunicationAssessmentSession session) {
        List<CommunicationQuestionDto> visibleQuestions = session.getQuestions().stream()
                .map(question -> CommunicationQuestionDto.builder()
                        .id(question.getId())
                        .category(question.getCategory())
                        .scenario(question.getScenario())
                        .prompt(question.getPrompt())
                        .options(question.getOptions().stream()
                                .map(option -> CommunicationOptionDto.builder()
                                        .id(option.getId())
                                        .text(option.getText())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        return CommunicationQuizResponse.builder()
                .questionCount(visibleQuestions.size())
                .durationMinutes(DURATION_MINUTES)
                .baseXP(BASE_XP)
                .submissionKey(session.getSubmissionKey())
                .deadlineAt(session.getDeadlineAt())
                .questions(visibleQuestions)
                .build();
    }

    @Override
    public synchronized CommunicationResultResponse submitAssessment(
            String userEmail, CommunicationSubmitRequest request) {
        String submissionKey = request.getSubmissionKey();
        if (submissionKey == null || submissionKey.isBlank()) {
            throw new IllegalArgumentException("Communication assessment session key is required.");
        }

        Optional<CommunicationAttempt> existing =
                attemptRepository.findByUserEmailAndSubmissionKey(userEmail, submissionKey);
        if (existing.isPresent()) {
            return toResult(existing.get(), "Communication assessment result previously recorded.");
        }

        CommunicationAssessmentSession session = sessionRepository.findById(sessionDocumentId(userEmail))
                .filter(candidate -> submissionKey.equals(candidate.getSubmissionKey()))
                .orElseThrow(() -> new IllegalArgumentException("Communication assessment session is invalid. Start a new quest."));

        if ("EXPIRED".equals(session.getStatus())) {
            throw new AssessmentExpiredException("The Communication Quest deadline has passed. Start a new quest to try again.");
        }
        if (!"ACTIVE".equals(session.getStatus())) {
            throw new IllegalArgumentException("Communication assessment session is no longer active. Start a new quest.");
        }

        Instant submittedAt = Instant.now();
        if (!submittedAt.isBefore(session.getDeadlineAt())) {
            session.setStatus("EXPIRED");
            sessionRepository.save(session);
            throw new AssessmentExpiredException("The Communication Quest deadline has passed. Your answers were not scored. Start a new quest to try again.");
        }

        Map<String, String> answers = request.getAnswers() == null ? Map.of() : request.getAnswers();
        int score = 0;
        for (CommunicationQuestion question : session.getQuestions()) {
            String selectedOption = answers.get(question.getId());
            score += question.getOptions().stream()
                    .filter(option -> option.getId().equals(selectedOption))
                    .mapToInt(CommunicationOption::getPoints)
                    .findFirst()
                    .orElse(0);
        }

        int maxScore = session.getQuestions().size() * 3;
        int accuracy = maxScore == 0 ? 0 : Math.round((float) score * 100 / maxScore);
        boolean passed = accuracy >= PASS_THRESHOLD;
        int earnedXp = calculateXp(accuracy);
        int timeTakenSeconds = (int) Math.max(0,
                Duration.between(session.getStartedAt(), submittedAt).getSeconds());

        CommunicationAttempt attempt = CommunicationAttempt.builder()
                .id(submissionKey)
                .userEmail(userEmail)
                .score(score)
                .maxScore(maxScore)
                .accuracy(accuracy)
                .passed(passed)
                .earnedXp(earnedXp)
                .timeTakenSeconds(timeTakenSeconds)
                .answers(answers)
                .submissionKey(submissionKey)
                .completedAt(LocalDateTime.now())
                .build();

        try {
            attemptRepository.insert(attempt);
        } catch (DuplicateKeyException ex) {
            return attemptRepository.findByUserEmailAndSubmissionKey(userEmail, submissionKey)
                    .map(saved -> toResult(saved, "Communication assessment result previously recorded."))
                    .orElseThrow(() -> ex);
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setXp(user.getXp() + earnedXp);
        user.setLevel((user.getXp() / 500) + 1);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        session.setStatus("COMPLETED");
        sessionRepository.save(session);

        return toResult(attempt, passed
                ? "Quest complete. Communication Pro has been unlocked."
                : "Quest finished. Practice these workplace scenarios and try again.");
    }

    private int calculateXp(int accuracy) {
        if (accuracy >= 90) return BASE_XP;
        if (accuracy >= 80) return Math.round(BASE_XP * 0.85f);
        if (accuracy >= 70) return Math.round(BASE_XP * 0.70f);
        if (accuracy >= 50) return Math.round(BASE_XP * 0.40f);
        return 20;
    }

    private CommunicationResultResponse toResult(CommunicationAttempt attempt, String message) {
        return CommunicationResultResponse.builder()
                .score(attempt.getScore())
                .maxScore(attempt.getMaxScore())
                .totalQuestions(QUESTION_COUNT)
                .accuracy(attempt.getAccuracy())
                .passed(attempt.isPassed())
                .earnedXp(attempt.getEarnedXp())
                .timeTakenSeconds(attempt.getTimeTakenSeconds())
                .badge(attempt.isPassed() ? "Communication Pro" : "Keep Practicing")
                .message(message)
                .build();
    }

    private String sessionDocumentId(String userEmail) {
        return UUID.nameUUIDFromBytes((userEmail + "|COMMUNICATION").getBytes(StandardCharsets.UTF_8)).toString();
    }

    private List<CommunicationQuestion> createSeedQuestions() {
        List<CommunicationQuestion> questions = new ArrayList<>();
        questions.add(question("C01", "Professional Email", "A client emails asking why a deliverable is late. Your team is responsible for a two-day delay, and you have a revised delivery date.", "What is the best response?",
                option("A", "Explain the delay, take responsibility, give the revised date, and offer a brief check-in.", 3, "Clear ownership and a specific next step build trust."),
                option("B", "Apologize and say you will send it soon.", 2, "Polite, but the client still lacks a reliable timeline."),
                option("C", "Blame the teammate who missed their part.", 0, "Assigning blame does not resolve the client's concern."),
                option("D", "Wait until the deliverable is ready before replying.", 1, "Silence leaves the client unable to plan.")));
        questions.add(question("C02", "Professional Email", "You receive an email with three requests, but one is unclear and could affect the project timeline.", "What should you do?",
                option("A", "Guess what the sender meant and proceed.", 1, "Guessing can create rework."),
                option("B", "Reply with the unclear item quoted, ask a focused question, and confirm the other two actions.", 3, "This makes progress while clarifying the risk."),
                option("C", "Forward it to your manager without context.", 0, "This shifts the work without clarifying the issue."),
                option("D", "Ignore the unclear request and complete the rest.", 2, "Some progress is made, but the blocker remains unaddressed.")));
        questions.add(question("C03", "Teamwork Disagreement", "A teammate disagrees with your proposal during a planning meeting and challenges your estimate.", "What is the most constructive next step?",
                option("A", "Ask which assumptions differ, compare the evidence, and agree on how to resolve the estimate.", 3, "Curiosity and shared evidence keep the discussion focused."),
                option("B", "Repeat your estimate more forcefully.", 0, "Volume does not resolve the disagreement."),
                option("C", "Drop the proposal immediately to avoid tension.", 1, "Avoidance leaves the planning decision unsupported."),
                option("D", "Suggest discussing the estimate after the meeting with the relevant data.", 2, "A focused follow-up can help, though a short clarification now may benefit the group.")));
        questions.add(question("C04", "Teamwork Disagreement", "A teammate has missed two handoffs, which is affecting your shared deadline.", "How should you address it?",
                option("A", "Complain about them in the team chat.", 0, "Public blame can damage trust and does not clarify the blocker."),
                option("B", "Privately explain the impact, ask what is blocking the handoff, and agree on a specific next step.", 3, "Direct, respectful discussion makes room for a workable plan."),
                option("C", "Do their work without telling them.", 1, "This may help once but leaves the pattern unresolved."),
                option("D", "Tell the manager immediately without speaking to them.", 2, "Escalation may be needed, but first clarify the issue directly when appropriate.")));
        questions.add(question("C05", "Customer Communication", "A customer is frustrated because a support issue has not been resolved after the first response.", "What should your next reply do?",
                option("A", "Acknowledge the impact, summarize what is known, state the next action and update time, and follow through.", 3, "Empathy plus a concrete update sets clear expectations."),
                option("B", "Send the same troubleshooting steps again.", 1, "Repeating advice without acknowledging the history may frustrate the customer."),
                option("C", "Promise it will be fixed today even though you are unsure.", 0, "An unsupported promise creates a new expectation you may miss."),
                option("D", "Explain that the issue is not your team's fault.", 0, "Deflecting responsibility does not help the customer.")));
        questions.add(question("C06", "Customer Communication", "A customer asks for a feature that is not on the current roadmap and wants a delivery date.", "How do you respond?",
                option("A", "Promise a date so the customer feels reassured.", 0, "A date without confirmation can mislead the customer."),
                option("B", "Dismiss the request because it is not planned.", 1, "This closes the conversation without understanding the need."),
                option("C", "Ask about the underlying need, explain that timing is unconfirmed, and offer to share the request with the product team.", 3, "This is honest while moving the request forward."),
                option("D", "Say you will check internally and give a specific time when you will follow up.", 2, "A clear follow-up is useful, though learning the underlying need would strengthen it.")));
        questions.add(question("C07", "Constructive Feedback", "Your manager says your project updates are difficult to act on because they omit risks and owners.", "What is the strongest response?",
                option("A", "Ask for an example, confirm what useful updates should include, and apply that structure next time.", 3, "Clarifying the expectation turns feedback into a practical change."),
                option("B", "Explain that you were too busy to include details.", 1, "Context may matter, but it does not establish how to improve."),
                option("C", "Disagree that the updates are unclear.", 0, "Rejecting the feedback without exploring it blocks improvement."),
                option("D", "Thank them and make a note to be more careful.", 2, "The intent is positive, but a specific expectation would help.")));
        questions.add(question("C08", "Constructive Feedback", "A colleague's report contains repeated errors that could confuse a client.", "How should you give feedback?",
                option("A", "Correct it silently and say nothing.", 1, "The immediate report improves, but the colleague gets no chance to prevent repeats."),
                option("B", "Point out the errors in front of the whole team.", 0, "Public criticism can embarrass rather than help."),
                option("C", "Privately identify specific examples, explain the client impact, and agree on a review step.", 3, "Specific, respectful feedback connects behavior to impact and action."),
                option("D", "Say the report is careless.", 0, "A personal label is less useful than specific observations.")));
        questions.add(question("C09", "Workplace Prioritization", "Two tasks are due today. One blocks a teammate's release; the other is a routine report for tomorrow's review.", "What should you do first?",
                option("A", "Work on the routine report because it is easier.", 1, "Ease alone does not reflect urgency or dependency."),
                option("B", "Confirm the release blocker and its needed handoff, communicate a plan for both tasks, then address the dependency first.", 3, "This weighs impact and keeps affected people informed."),
                option("C", "Work on both at once without telling anyone.", 1, "Switching without a plan can slow both tasks and hide risk."),
                option("D", "Ask the teammate which task they prefer you do.", 2, "Input helps, but the choice should also account for deadlines and stakeholders.")));
        questions.add(question("C10", "Workplace Prioritization", "A new urgent request arrives while you are preparing a deliverable due later today. You cannot complete both on time.", "What is the best response?",
                option("A", "Quietly work late and hope both are finished.", 1, "This hides a capacity risk until it may be too late."),
                option("B", "Tell the requester you cannot help.", 1, "A clear limit is honest but does not explore priorities or alternatives."),
                option("C", "Clarify the new request's deadline and impact, tell your manager about the conflict, and agree which commitment moves.", 3, "Transparent trade-offs let stakeholders make an informed priority decision."),
                option("D", "Stop the current task and switch immediately.", 0, "Switching without confirming priorities may jeopardize the existing commitment.")));
        return questions;
    }

    private CommunicationQuestion question(String id, String category, String scenario, String prompt,
                                           CommunicationOption... options) {
        return CommunicationQuestion.builder().id(id).category(category).scenario(scenario)
                .prompt(prompt).options(List.of(options)).build();
    }

    private CommunicationOption option(String id, String text, int points, String feedback) {
        return CommunicationOption.builder().id(id).text(text).points(points).feedback(feedback).build();
    }
}
