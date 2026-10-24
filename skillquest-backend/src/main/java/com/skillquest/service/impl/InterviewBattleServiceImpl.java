package com.skillquest.service.impl;

import com.skillquest.dto.*;
import com.skillquest.entity.*;
import com.skillquest.config.InterviewProgressionBypass;
import com.skillquest.exception.AssessmentExpiredException;
import com.skillquest.exception.UserNotFoundException;
import com.skillquest.repository.InterviewAssessmentSessionRepository;
import com.skillquest.repository.InterviewAttemptRepository;
import com.skillquest.repository.UserRepository;
import com.skillquest.service.InterviewBattleService;
import com.skillquest.service.QuestProgressService;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class InterviewBattleServiceImpl implements InterviewBattleService {
    public static final int DURATION_MINUTES = 20;
    public static final int PASS_THRESHOLD = 70;
    public static final int MAX_XP = 130;
    private static final int MAX_ANSWER_LENGTH = 4000;
    private static final List<String> CATEGORIES = List.of(
            "HR and Introduction", "Technical Fundamentals", "Situational Questions",
            "Problem-Solving Scenarios", "Customer and Communication Scenarios");
    private static final Set<String> STRUCTURE_TERMS = Set.of("first", "then", "because", "next", "finally", "therefore", "example", "before", "after");
    private static final Set<String> ACTION_TERMS = Set.of("investigate", "clarify", "prioritize", "reproduce", "verify", "document", "communicate", "ask", "listen", "check", "test", "compare", "plan", "confirm", "review", "escalate", "coordinate", "explain", "resolve", "inform", "learn", "measure", "identify", "debug", "validate");
    private static final Set<String> PROFESSIONAL_TERMS = Set.of("respectfully", "professional", "listen", "acknowledge", "apologize", "thank", "collaborate", "communicate", "explain", "confirm", "ask", "update", "support", "clarify", "team", "customer", "stakeholder");
    private static final Pattern WORD_PATTERN = Pattern.compile("[a-z0-9']+");

    private final InterviewAssessmentSessionRepository sessions;
    private final InterviewAttemptRepository attempts;
    private final QuestProgressService progress;
    private final UserRepository users;
    private final InterviewProgressionBypass interviewProgressionBypass;

    public InterviewBattleServiceImpl(InterviewAssessmentSessionRepository sessions, InterviewAttemptRepository attempts,
            QuestProgressService progress, UserRepository users, InterviewProgressionBypass interviewProgressionBypass) {
        this.sessions = sessions; this.attempts = attempts; this.progress = progress; this.users = users;
        this.interviewProgressionBypass = interviewProgressionBypass;
    }

    @Override
    public synchronized InterviewAssessmentResponse start(String email) {
        String id = sessionId(email);
        Instant now = Instant.now();
        Optional<InterviewAssessmentSession> stored = sessions.findById(id);
        if (stored.isPresent()) {
            InterviewAssessmentSession existing = stored.get();
            if (email.equals(existing.getUserEmail()) && "ACTIVE".equals(existing.getStatus())
                    && existing.getDeadlineAt() != null && now.isBefore(existing.getDeadlineAt())
                    && attempts.findByUserEmailAndSessionKey(email, existing.getSessionKey()).isEmpty()) {
                return toAssessment(existing);
            }
            if ("ACTIVE".equals(existing.getStatus()) && existing.getDeadlineAt() != null
                    && !now.isBefore(existing.getDeadlineAt())) {
                existing.setStatus("EXPIRED"); sessions.save(existing);
            }
        }
        if (!interviewProgressionBypass.isEnabled()) progress.requireInterviewUnlocked(email);
        users.findByEmail(email).orElseThrow(() -> new UserNotFoundException("Authenticated user was not found."));
        InterviewAssessmentSession session = InterviewAssessmentSession.builder().id(id).userEmail(email)
                .sessionKey(UUID.randomUUID().toString()).status("ACTIVE").startedAt(now)
                .deadlineAt(now.plus(Duration.ofMinutes(DURATION_MINUTES))).questions(selectQuestions()).draftAnswers(new HashMap<>()).build();
        return toAssessment(sessions.save(session));
    }

    @Override
    public synchronized Optional<InterviewAssessmentResponse> getActiveSession(String email) {
        Optional<InterviewAssessmentSession> stored = sessions.findById(sessionId(email));
        if (stored.isEmpty()) return Optional.empty();
        InterviewAssessmentSession session = stored.get();
        if (!email.equals(session.getUserEmail())) return Optional.empty();
        if ("EXPIRED".equals(session.getStatus())) return Optional.of(toAssessment(session));
        if (!"ACTIVE".equals(session.getStatus())) return Optional.empty();
        if (session.getDeadlineAt() == null || !Instant.now().isBefore(session.getDeadlineAt())) {
            session.setStatus("EXPIRED"); sessions.save(session); return Optional.of(toAssessment(session));
        }
        if (attempts.findByUserEmailAndSessionKey(email, session.getSessionKey()).isPresent()) return Optional.empty();
        return Optional.of(toAssessment(session));
    }

    @Override
    public synchronized InterviewAssessmentResponse saveDraft(String email, InterviewDraftRequest request) {
        if (request == null || request.getSessionKey() == null || request.getSessionKey().isBlank())
            throw new IllegalArgumentException("Interview session key is required.");
        InterviewAssessmentSession session = sessions.findById(sessionId(email))
                .filter(s -> email.equals(s.getUserEmail()) && request.getSessionKey().equals(s.getSessionKey()) && "ACTIVE".equals(s.getStatus()))
                .orElseThrow(() -> new IllegalArgumentException("Interview session is invalid or inactive."));
        if (session.getDeadlineAt() == null || !Instant.now().isBefore(session.getDeadlineAt())) {
            session.setStatus("EXPIRED"); sessions.save(session);
            throw new AssessmentExpiredException("Interview deadline passed. Draft answers can no longer be changed.");
        }
        Map<String, String> incoming = request.getAnswers() == null ? Collections.emptyMap() : request.getAnswers();
        Set<String> valid = session.getQuestions().stream().map(InterviewQuestion::getId).collect(Collectors.toSet());
        if (incoming.keySet().stream().anyMatch(id -> id == null || !valid.contains(id)))
            throw new IllegalArgumentException("Draft includes an unknown interview question.");
        for (InterviewQuestion q : session.getQuestions()) {
            String answer = incoming.get(q.getId());
            if (answer != null && answer.length() > MAX_ANSWER_LENGTH) throw new IllegalArgumentException("Each answer must be 4,000 characters or fewer.");
            if ("MULTIPLE_CHOICE".equals(q.getType()) && answer != null && !answer.isBlank()
                    && q.getChoices().stream().noneMatch(choice -> choice.getId().equals(answer)))
                throw new IllegalArgumentException("Draft includes an invalid interview choice.");
        }
        if (session.getDraftAnswers() == null) session.setDraftAnswers(new HashMap<>());
        session.getDraftAnswers().putAll(incoming);
        return toAssessment(sessions.save(session));
    }

    @Override
    public synchronized InterviewResultResponse submit(String email, InterviewSubmitRequest request) {
        if (request == null || request.getSessionKey() == null || request.getSessionKey().isBlank())
            throw new IllegalArgumentException("Interview session key is required.");
        String key = request.getSessionKey();
        Optional<InterviewAttempt> duplicate = attempts.findByUserEmailAndSessionKey(email, key);
        if (duplicate.isPresent()) {
            awardOnce(email, duplicate.get());
            return toResult(duplicate.get());
        }
        InterviewAssessmentSession session = sessions.findById(sessionId(email))
                .filter(s -> email.equals(s.getUserEmail()) && key.equals(s.getSessionKey()))
                .orElseThrow(() -> new IllegalArgumentException("Interview session is invalid or belongs to another account."));
        if (!"ACTIVE".equals(session.getStatus())) {
            if ("EXPIRED".equals(session.getStatus())) throw new AssessmentExpiredException("Interview deadline passed. No result or XP was awarded.");
            throw new IllegalArgumentException("Interview session is no longer active.");
        }
        Instant completedAt = Instant.now();
        if (session.getDeadlineAt() == null || completedAt.isAfter(session.getDeadlineAt())) {
            session.setStatus("EXPIRED"); sessions.save(session);
            throw new AssessmentExpiredException("Interview deadline passed. No result or XP was awarded.");
        }
        Map<String, String> answers = request.getAnswers() == null ? Collections.emptyMap() : request.getAnswers();
        Set<String> validIds = session.getQuestions().stream().map(InterviewQuestion::getId).collect(Collectors.toSet());
        if (answers.keySet().stream().anyMatch(id -> id == null || !validIds.contains(id)))
            throw new IllegalArgumentException("Submission includes an unknown interview question.");
        for (InterviewQuestion question : session.getQuestions()) {
            String answer = answers.get(question.getId());
            if (answer != null && answer.length() > MAX_ANSWER_LENGTH)
                throw new IllegalArgumentException("Each answer must be 4,000 characters or fewer.");
            if ("MULTIPLE_CHOICE".equals(question.getType()) && answer != null && !answer.isBlank()
                    && question.getChoices().stream().noneMatch(choice -> choice.getId().equals(answer)))
                throw new IllegalArgumentException("Submission includes an invalid choice for an interview question.");
        }
        users.findByEmail(email).orElseThrow(() -> new UserNotFoundException("Authenticated user was not found."));
        Scoring scoring = score(session.getQuestions(), answers);
        int accuracy = scoring.maxScore() == 0 ? 0 : Math.round(scoring.score() * 100f / scoring.maxScore());
        int xp = xpForAccuracy(accuracy);
        InterviewAttempt attempt = InterviewAttempt.builder().id(key).userEmail(email).sessionKey(key)
                .score(scoring.score()).maxScore(scoring.maxScore()).accuracy(accuracy).passed(accuracy >= PASS_THRESHOLD)
                .earnedXp(xp).answers(new HashMap<>(answers)).categoryResults(scoring.categories())
                .feedback(scoring.feedback()).completedAt(completedAt).build();
        try {
            attempts.insert(attempt);
        } catch (DuplicateKeyException duplicateKey) {
            InterviewAttempt saved = attempts.findByUserEmailAndSessionKey(email, key).orElseThrow(() -> duplicateKey);
            awardOnce(email, saved);
            return toResult(saved);
        }
        awardOnce(email, attempt);
        session.setStatus("COMPLETED"); sessions.save(session);
        return toResult(attempt);
    }

    @Override
    public InterviewResultResponse getAttempt(String email, String attemptId) {
        return attempts.findByUserEmailAndSessionKey(email, attemptId).map(this::toResult)
                .orElseThrow(() -> new IllegalArgumentException("Saved Interview Battle result was not found."));
    }

    private void awardOnce(String email, InterviewAttempt attempt) {
        users.awardInterviewXpOnce(email, attempt.getSessionKey(), attempt.getEarnedXp());
    }

    private Scoring score(List<InterviewQuestion> questions, Map<String, String> answers) {
        Map<String, Integer> categoryScores = new LinkedHashMap<>();
        Map<String, Integer> categoryMax = new LinkedHashMap<>();
        Map<String, List<String>> strengths = new LinkedHashMap<>();
        Map<String, List<String>> improvements = new LinkedHashMap<>();
        List<String> feedback = new ArrayList<>();
        int total = 0;
        for (InterviewQuestion q : questions) {
            categoryMax.merge(q.getCategory(), 4, Integer::sum);
            int points;
            if ("MULTIPLE_CHOICE".equals(q.getType())) {
                boolean correct = q.getCorrectChoiceId().equals(answers.get(q.getId()));
                points = correct ? 4 : 0;
                feedback.add(q.getId() + ": " + (correct ? "Correct. " : "Review this concept. ") + q.getRationale());
                if (correct) strengths.computeIfAbsent(q.getCategory(), k -> new ArrayList<>()).add("Selected an appropriate response for " + q.getId() + ".");
                else improvements.computeIfAbsent(q.getCategory(), k -> new ArrayList<>()).add("Review the reasoning behind " + q.getId() + ".");
            } else {
                Rubric rubric = scoreOpenAnswer(answers.get(q.getId()), q);
                points = rubric.points();
                if (rubric.relevant()) strengths.computeIfAbsent(q.getCategory(), k -> new ArrayList<>()).add("Addressed relevant ideas in " + q.getId() + ".");
                if (!rubric.areas().isEmpty()) improvements.computeIfAbsent(q.getCategory(), k -> new ArrayList<>()).addAll(rubric.areas());
                feedback.add(q.getId() + ": " + rubric.feedback());
            }
            categoryScores.merge(q.getCategory(), points, Integer::sum);
            total += points;
        }
        List<InterviewCategoryResult> results = CATEGORIES.stream().map(category -> {
            int catScore = categoryScores.getOrDefault(category, 0), catMax = categoryMax.getOrDefault(category, 0);
            return InterviewCategoryResult.builder().category(category).score(catScore).maxScore(catMax)
                    .accuracy(catMax == 0 ? 0 : Math.round(catScore * 100f / catMax))
                    .strengths(strengths.getOrDefault(category, List.of("No demonstrated strength yet in this category.")))
                    .areasToImprove(improvements.getOrDefault(category, List.of("Continue practicing clear, specific answers."))).build();
        }).toList();
        return new Scoring(total, questions.size() * 4, results, feedback);
    }

    private Rubric scoreOpenAnswer(String answer, InterviewQuestion q) {
        String normalized = answer == null ? "" : answer.toLowerCase(Locale.ROOT).trim();
        List<String> words = tokens(normalized);
        if (words.size() < 5) return new Rubric(0, false, List.of("Add a relevant, specific explanation and a practical next step."), "Too little relevant detail was provided for a reliable rubric score.");
        long relevantMatches = q.getRelevanceTerms().stream().filter(term -> normalized.contains(term.toLowerCase(Locale.ROOT))).distinct().count();
        if (relevantMatches == 0) return new Rubric(0, false,
                List.of("Connect the answer directly to the question before adding detail."),
                "No expected topic concepts were matched, so this response received no open-answer points.");
        int points = relevantMatches == 0 ? 0 : 1;
        boolean relevant = relevantMatches > 0;
        List<String> areas = new ArrayList<>();
        if (!relevant) areas.add("Connect the answer more directly to the question.");
        int structure = words.size() >= 8 && (normalized.matches("(?s).*([.!?].*[.!?]|\\b(first|then|because|next|finally|therefore|example)\\b).*")) ? 1 : 0;
        points += structure;
        if (structure == 0) areas.add("Use a clearer sequence or explain why you chose the action.");
        boolean practical = q.getActionTerms().stream().anyMatch(normalized::contains) || ACTION_TERMS.stream().anyMatch(normalized::contains);
        if (practical) points++; else areas.add("Include a concrete action or verification step.");
        boolean professional = PROFESSIONAL_TERMS.stream().anyMatch(normalized::contains)
                || normalized.contains("i would") || normalized.contains("i will") || normalized.contains("i'd")
                || normalized.contains("i am") || normalized.contains("my goal");
        if (professional) points++; else areas.add("State how you would communicate respectfully with the people involved.");
        String note = "Rubric matched " + relevantMatches + " relevant concept(s); structure, practical action, and professional phrasing are checked with simple text rules.";
        return new Rubric(Math.min(4, points), relevant, areas, note);
    }

    private List<String> tokens(String text) {
        var matcher = WORD_PATTERN.matcher(text); List<String> words = new ArrayList<>();
        while (matcher.find()) words.add(matcher.group());
        return words;
    }

    int xpForAccuracy(int accuracy) {
        if (accuracy >= 90) return MAX_XP;
        if (accuracy >= 80) return Math.round(MAX_XP * .85f);
        if (accuracy >= 70) return Math.round(MAX_XP * .70f);
        if (accuracy >= 50) return Math.round(MAX_XP * .40f);
        return 20;
    }

    private List<InterviewQuestion> selectQuestions() {
        List<InterviewQuestion> selected = new ArrayList<>();
        List<InterviewQuestion> bank = questionBank();
        Random random = new Random();
        for (String category : CATEGORIES) {
            List<InterviewQuestion> categoryItems = bank.stream().filter(q -> category.equals(q.getCategory())).toList();
            InterviewQuestion mcq = pick(categoryItems.stream().filter(q -> "MULTIPLE_CHOICE".equals(q.getType())).toList(), random);
            InterviewQuestion open = pick(categoryItems.stream().filter(q -> "OPEN_ENDED".equals(q.getType())).toList(), random);
            selected.add(mcq); selected.add(open);
        }
        Collections.shuffle(selected, random);
        return selected;
    }
    private InterviewQuestion pick(List<InterviewQuestion> choices, Random random) { return choices.get(random.nextInt(choices.size())); }

    private List<InterviewQuestion> questionBank() {
        return List.of(
            mcq("HR-M1", CATEGORIES.get(0), "Which introduction is most useful at the start of an entry-level technology interview?", "A", "A concise overview of relevant study or projects, skills, and interest in the role.", "B", "A long list of unrelated personal details.", "C", "A claim that you can perform every task without support.", "A", "A focused introduction connects relevant experience to the position.", List.of()),
            mcq("HR-M2", CATEGORIES.get(0), "When asked about a weakness, what is the strongest approach?", "A", "Say you have no weaknesses.", "B", "Name a genuine development area and explain the steps you are taking to improve it.", "C", "Blame a previous manager.", "B", "A specific improvement plan shows self-awareness and accountability.", List.of()),
            open("HR-O1", CATEGORIES.get(0), "Introduce yourself for an entry-level technology role. Briefly connect your background, one relevant project or skill, and a career goal.", List.of("project", "skill", "technology", "role", "goal", "learn", "experience"), List.of("built", "learned", "contributed", "develop", "practice")),
            open("HR-O2", CATEGORIES.get(0), "What is one strength you would bring to a junior role, and how have you demonstrated it? Include a practical example and how you want to grow.", List.of("strength", "example", "team", "problem", "learn", "role", "grow", "project"), List.of("demonstrated", "organized", "solved", "collaborated", "improved")),

            mcq("TECH-M1", CATEGORIES.get(1), "What is the main purpose of an API in a web application?", "A", "It lets software systems exchange data or request services through defined rules.", "B", "It replaces every database.", "C", "It guarantees that a website has no bugs.", "A", "An API defines a controlled way for clients and services to communicate.", List.of()),
            mcq("TECH-M2", CATEGORIES.get(1), "A database query is unexpectedly slow. What is a sensible first investigation?", "A", "Delete rows until it becomes faster.", "B", "Check the query, data volume, and available indexes using safe diagnostics.", "C", "Restart the production database repeatedly.", "B", "Inspecting the query plan and indexes is safer than changing production data blindly.", List.of()),
            open("TECH-O1", CATEGORIES.get(1), "A user reports that a page sometimes fails to load. Explain how you would investigate and narrow down the cause before changing code.", List.of("reproduce", "error", "logs", "browser", "network", "request", "page", "cause"), List.of("reproduce", "inspect", "check", "compare", "test", "verify", "debug")),
            open("TECH-O2", CATEGORIES.get(1), "Explain a basic technical concept you know, such as an API, database, or HTTP request, in plain language for a non-technical teammate.", List.of("api", "database", "request", "data", "server", "web", "information", "system"), List.of("explain", "example", "compare", "describe")),

            mcq("SIT-M1", CATEGORIES.get(2), "Two tasks have the same deadline, but one blocks a teammate. What should you do first?", "A", "Prioritize based on impact and dependency, then communicate the tradeoff to the affected people.", "B", "Work silently on whichever task looks easier.", "C", "Ignore the teammate's dependency.", "A", "Prioritization should consider impact and blockers, with clear communication.", List.of()),
            mcq("SIT-M2", CATEGORIES.get(2), "You discover that a change you made introduced a defect. What is the best response?", "A", "Wait to see whether anyone notices.", "B", "Tell the relevant teammate, help assess impact, and work on a safe correction.", "C", "Delete the related records to hide the issue.", "B", "Early disclosure and impact assessment help the team recover safely.", List.of()),
            open("SIT-O1", CATEGORIES.get(2), "A teammate disagrees with your proposed approach during a deadline-sensitive task. Explain how you would understand their concern and agree on a workable next step.", List.of("teammate", "concern", "approach", "deadline", "evidence", "option", "team", "task"), List.of("ask", "listen", "compare", "agree", "clarify", "coordinate", "communicate")),
            open("SIT-O2", CATEGORIES.get(2), "You realize you may miss a deadline because an unfamiliar task is taking longer than expected. What would you do and communicate?", List.of("deadline", "delay", "task", "blocker", "impact", "estimate", "plan"), List.of("inform", "update", "prioritize", "ask", "plan", "escalate", "communicate")),

            mcq("PROB-M1", CATEGORIES.get(3), "A bug appears only for some users. Which approach is most useful first?", "A", "Gather examples and compare the conditions where it occurs before testing a hypothesis.", "B", "Rewrite the entire application immediately.", "C", "Assume users are using the product incorrectly.", "A", "Comparing reproducible cases helps identify a useful, testable cause.", List.of()),
            mcq("PROB-M2", CATEGORIES.get(3), "A proposed quick fix could affect unrelated features. What is the practical next step?", "A", "Deploy it directly to every user.", "B", "Check the impact, test a small change, and define how to verify the outcome.", "C", "Avoid documenting the change.", "B", "Small tests and a verification plan reduce avoidable risk.", List.of()),
            open("PROB-O1", CATEGORIES.get(3), "A report export is missing some rows. Describe a step-by-step plan to investigate the data, reproduce the issue, and verify a fix.", List.of("export", "rows", "data", "report", "reproduce", "filter", "query", "missing"), List.of("check", "compare", "reproduce", "test", "verify", "validate", "document")),
            open("PROB-O2", CATEGORIES.get(3), "A feature request is vague and time is limited. Explain how you would clarify the need, compare options, and choose a practical first step.", List.of("request", "user", "need", "scope", "option", "impact", "time", "feature"), List.of("clarify", "ask", "prioritize", "compare", "estimate", "plan", "confirm")),

            mcq("COMM-M1", CATEGORIES.get(4), "A customer is frustrated because their issue remains unresolved. What is the best opening response?", "A", "Acknowledge the impact, ask focused questions, and explain the next update you will provide.", "B", "Tell them the issue is not important.", "C", "Promise a fix time before investigating.", "A", "Acknowledgement and a realistic next update are respectful and trustworthy.", List.of()),
            mcq("COMM-M2", CATEGORIES.get(4), "How should you explain a technical outage to a non-technical customer?", "A", "Use internal jargon so the explanation sounds precise.", "B", "Describe the user impact in plain language and give verified next steps.", "C", "Hide all information until the issue is fully resolved.", "B", "Plain language and confirmed information make communication useful.", List.of()),
            open("COMM-O1", CATEGORIES.get(4), "A customer says a feature is broken, but you need more information. Write what you would say to acknowledge the concern, ask for useful details, and set expectations.", List.of("customer", "feature", "issue", "problem", "detail", "impact", "concern", "information"), List.of("acknowledge", "ask", "confirm", "update", "explain", "investigate", "communicate")),
            open("COMM-O2", CATEGORIES.get(4), "Explain a short service delay to a non-technical customer. Be clear about the impact, what is known, and when you will update them.", List.of("delay", "service", "impact", "known", "update", "customer", "time", "status"), List.of("explain", "inform", "confirm", "update", "apologize", "communicate"))
        );
    }

    private InterviewQuestion mcq(String id, String category, String prompt, String aId, String a,
            String bId, String b, String cId, String c, String correct, String rationale, List<String> unused) {
        return InterviewQuestion.builder().id(id).category(category).type("MULTIPLE_CHOICE").prompt(prompt)
                .choices(List.of(choice(aId, a), choice(bId, b), choice(cId, c))).correctChoiceId(correct)
                .rationale(rationale).relevanceTerms(List.of()).actionTerms(List.of()).build();
    }
    private InterviewQuestion open(String id, String category, String prompt, List<String> terms, List<String> actions) {
        return InterviewQuestion.builder().id(id).category(category).type("OPEN_ENDED").prompt(prompt)
                .choices(List.of()).relevanceTerms(terms).actionTerms(actions).build();
    }
    private InterviewChoice choice(String id, String text) { return InterviewChoice.builder().id(id).text(text).build(); }

    private InterviewAssessmentResponse toAssessment(InterviewAssessmentSession session) {
        List<InterviewQuestionDto> publicQuestions = session.getQuestions().stream().map(q -> InterviewQuestionDto.builder()
                .id(q.getId()).category(q.getCategory()).type(q.getType()).prompt(q.getPrompt())
                .choices(q.getChoices().stream().map(c -> InterviewChoiceDto.builder().id(c.getId()).text(c.getText()).build()).toList()).build()).toList();
        return InterviewAssessmentResponse.builder().sessionKey(session.getSessionKey()).status(session.getStatus()).startedAt(session.getStartedAt())
                .deadlineAt(session.getDeadlineAt()).durationMinutes(DURATION_MINUTES).questions(publicQuestions)
                .draftAnswers(session.getDraftAnswers() == null ? Map.of() : new HashMap<>(session.getDraftAnswers())).build();
    }
    private InterviewResultResponse toResult(InterviewAttempt attempt) {
        return InterviewResultResponse.builder().attemptId(attempt.getId()).score(attempt.getScore()).maxScore(attempt.getMaxScore())
                .accuracy(attempt.getAccuracy()).passed(attempt.isPassed()).earnedXp(attempt.getEarnedXp()).completedAt(attempt.getCompletedAt())
                .categoryResults(attempt.getCategoryResults().stream().map(c -> InterviewCategoryResultDto.builder().category(c.getCategory())
                        .score(c.getScore()).maxScore(c.getMaxScore()).accuracy(c.getAccuracy()).strengths(c.getStrengths())
                        .areasToImprove(c.getAreasToImprove()).build()).toList()).feedback(attempt.getFeedback())
                .automatedScoringNote("Open-ended answers use a deterministic keyword and structure rubric. It is approximate and does not assess intent, nuance, or interview delivery.").build();
    }
    private String sessionId(String email) { return UUID.nameUUIDFromBytes((email + "|INTERVIEW_BATTLE").getBytes(StandardCharsets.UTF_8)).toString(); }
    private record Scoring(int score, int maxScore, List<InterviewCategoryResult> categories, List<String> feedback) { }
    private record Rubric(int points, boolean relevant, List<String> areas, String feedback) { }
}
