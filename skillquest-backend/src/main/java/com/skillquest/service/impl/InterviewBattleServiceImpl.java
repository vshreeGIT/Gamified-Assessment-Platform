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

    public static final Set<String> VALID_ROLES = Set.of(
            "Python Developer", "Software Development Engineer", "Frontend Developer",
            "Full-Stack Developer", "Java Developer", "Data Analyst",
            "Customer Support Engineer", "Business Development Representative");

    @Override
    public synchronized InterviewAssessmentResponse start(String email, String role) {
        if (role == null || role.isBlank() || !VALID_ROLES.contains(role))
            throw new IllegalArgumentException("Please select a valid role before starting the assessment.");
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
                .sessionKey(UUID.randomUUID().toString()).role(role).status("ACTIVE").startedAt(now)
                .deadlineAt(now.plus(Duration.ofMinutes(DURATION_MINUTES)))
                .questions(selectQuestions(role)).draftAnswers(new HashMap<>()).build();
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
                .role(session.getRole())
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

    private List<InterviewQuestion> selectQuestions(String role) {
        List<InterviewQuestion> selected = new ArrayList<>();
        List<InterviewQuestion> bank = questionBank(role);
        Random random = new Random();
        for (String category : CATEGORIES) {
            List<InterviewQuestion> categoryItems = bank.stream().filter(q -> category.equals(q.getCategory())).toList();
            List<InterviewQuestion> mcqs = categoryItems.stream().filter(q -> "MULTIPLE_CHOICE".equals(q.getType())).toList();
            List<InterviewQuestion> opens = categoryItems.stream().filter(q -> "OPEN_ENDED".equals(q.getType())).toList();
            if (!mcqs.isEmpty()) selected.add(pick(mcqs, random));
            if (!opens.isEmpty()) selected.add(pick(opens, random));
        }
        Collections.shuffle(selected, random);
        return selected;
    }
    private InterviewQuestion pick(List<InterviewQuestion> choices, Random random) { return choices.get(random.nextInt(choices.size())); }

    private List<InterviewQuestion> questionBank(String role) {
        return switch (role) {
            case "Python Developer" -> pythonDeveloperBank();
            case "Software Development Engineer" -> sdeDeveloperBank();
            case "Frontend Developer" -> frontendDeveloperBank();
            case "Full-Stack Developer" -> fullStackDeveloperBank();
            case "Java Developer" -> javaDeveloperBank();
            case "Data Analyst" -> dataAnalystBank();
            case "Customer Support Engineer" -> customerSupportBank();
            case "Business Development Representative" -> bdrBank();
            default -> throw new IllegalArgumentException("Please select a supported interview role.");
        };
    }

    private List<InterviewQuestion> genericBank() {
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
        return InterviewAssessmentResponse.builder().sessionKey(session.getSessionKey()).role(session.getRole()).status(session.getStatus()).startedAt(session.getStartedAt())
                .deadlineAt(session.getDeadlineAt()).durationMinutes(DURATION_MINUTES).questions(publicQuestions)
                .draftAnswers(session.getDraftAnswers() == null ? Map.of() : new HashMap<>(session.getDraftAnswers())).build();
    }
    private InterviewResultResponse toResult(InterviewAttempt attempt) {
        return InterviewResultResponse.builder().attemptId(attempt.getId()).role(attempt.getRole()).score(attempt.getScore()).maxScore(attempt.getMaxScore())
                .accuracy(attempt.getAccuracy()).passed(attempt.isPassed()).earnedXp(attempt.getEarnedXp()).completedAt(attempt.getCompletedAt())
                .categoryResults(attempt.getCategoryResults().stream().map(c -> InterviewCategoryResultDto.builder().category(c.getCategory())
                        .score(c.getScore()).maxScore(c.getMaxScore()).accuracy(c.getAccuracy()).strengths(c.getStrengths())
                        .areasToImprove(c.getAreasToImprove()).build()).toList()).feedback(attempt.getFeedback())
                .automatedScoringNote("Open-ended answers use a deterministic keyword and structure rubric. It is approximate and does not assess intent, nuance, or interview delivery.").build();
    }
    private String sessionId(String email) { return UUID.nameUUIDFromBytes((email + "|INTERVIEW_BATTLE").getBytes(StandardCharsets.UTF_8)).toString(); }
    private record Scoring(int score, int maxScore, List<InterviewCategoryResult> categories, List<String> feedback) { }
    private record Rubric(int points, boolean relevant, List<String> areas, String feedback) { }

    private List<InterviewQuestion> pythonDeveloperBank() {
        return List.of(
            mcq("PY-HR-M1", CATEGORIES.get(0), "Which introduction best fits a Python Developer interview?", "A", "Mention Python projects, libraries used, and a specific problem you solved with code.", "B", "List every programming language you have ever heard of.", "C", "Say you prefer not to talk about past work.", "A", "Concrete Python experience and a solved problem show relevant readiness.", List.of()),
            mcq("PY-HR-M2", CATEGORIES.get(0), "A recruiter asks why you chose Python. What is the strongest answer?", "A", "Because it was the only language available.", "B", "Its readable syntax, rich ecosystem, and strong community made it practical for the projects I worked on.", "C", "I have not really thought about it.", "B", "Articulating a reasoned choice shows genuine engagement with the language.", List.of()),
            open("PY-HR-O1", CATEGORIES.get(0), "Introduce yourself as a Python Developer candidate. Mention one Python project, the libraries or tools you used, and what you want to learn next.", List.of("python", "project", "library", "tool", "learn", "goal", "experience", "skill"), List.of("built", "used", "developed", "implemented", "practiced")),
            open("PY-HR-O2", CATEGORIES.get(0), "Describe a strength relevant to Python development and give a concrete example of how it helped you complete a task or project.", List.of("python", "strength", "example", "project", "problem", "solution", "code", "learn"), List.of("solved", "improved", "refactored", "debugged", "optimized")),

            mcq("PY-TECH-M1", CATEGORIES.get(1), "What is the difference between a list and a tuple in Python?", "A", "Lists are mutable and tuples are immutable; tuples are often used for fixed collections.", "B", "They are identical in every way.", "C", "Tuples can only hold integers.", "A", "Mutability is the key distinction; tuples signal that data should not change.", List.of()),
            mcq("PY-TECH-M2", CATEGORIES.get(1), "What does a Python virtual environment do?", "A", "It speeds up Python by compiling it to machine code.", "B", "It isolates project dependencies so different projects can use different package versions.", "C", "It replaces the need for pip.", "B", "Isolation prevents version conflicts between projects.", List.of()),
            open("PY-TECH-O1", CATEGORIES.get(1), "Explain how you would read a large CSV file in Python without loading it all into memory at once. Describe the approach and any libraries you would use.", List.of("csv", "file", "memory", "chunk", "pandas", "iterator", "read", "stream"), List.of("use", "read", "iterate", "process", "handle")),
            open("PY-TECH-O2", CATEGORIES.get(1), "A Python script is running slower than expected. Walk through how you would profile it and identify the bottleneck.", List.of("profile", "performance", "slow", "bottleneck", "cprofile", "timeit", "optimize", "function"), List.of("profile", "measure", "identify", "optimize", "test")),

            mcq("PY-SIT-M1", CATEGORIES.get(2), "You find a bug in a shared Python utility used by three other services. What do you do first?", "A", "Fix it silently and redeploy.", "B", "Reproduce the bug, assess impact on dependent services, then communicate before changing shared code.", "C", "Delete the utility.", "B", "Assessing impact and communicating before changing shared code prevents cascading failures.", List.of()),
            mcq("PY-SIT-M2", CATEGORIES.get(2), "A teammate's Python code review comment conflicts with your approach. How do you respond?", "A", "Ignore the comment.", "B", "Explain your reasoning, ask for their rationale, and agree on the approach that best fits the project standards.", "C", "Rewrite their code without discussion.", "B", "Constructive discussion leads to better code and shared understanding.", List.of()),
            open("PY-SIT-O1", CATEGORIES.get(2), "You are asked to add a feature to a Python codebase you have never seen before. Describe how you would orient yourself and plan your work.", List.of("codebase", "read", "understand", "plan", "test", "structure", "module", "function"), List.of("read", "explore", "ask", "plan", "test", "review")),
            open("PY-SIT-O2", CATEGORIES.get(2), "Your Python script works locally but fails in the CI pipeline. Describe your investigation steps.", List.of("ci", "pipeline", "environment", "dependency", "error", "log", "reproduce", "version"), List.of("check", "compare", "reproduce", "investigate", "fix", "verify")),

            mcq("PY-PROB-M1", CATEGORIES.get(3), "A Python API endpoint returns incorrect data for some requests. What is your first step?", "A", "Rewrite the entire endpoint.", "B", "Reproduce the failure with a specific input, then add logging to trace the data flow.", "C", "Blame the database.", "B", "Reproducing with a known input and tracing data flow isolates the cause efficiently.", List.of()),
            mcq("PY-PROB-M2", CATEGORIES.get(3), "You need to process one million records in Python efficiently. Which approach is most appropriate?", "A", "Load all records into a list and sort them repeatedly.", "B", "Use generators or chunked processing to keep memory usage low and process incrementally.", "C", "Write the data to a text file and read it back.", "B", "Generators and chunking avoid memory exhaustion for large datasets.", List.of()),
            open("PY-PROB-O1", CATEGORIES.get(3), "A Python function returns None unexpectedly. Describe how you would debug it step by step.", List.of("none", "return", "debug", "function", "print", "log", "trace", "value"), List.of("check", "print", "trace", "test", "verify", "inspect")),
            open("PY-PROB-O2", CATEGORIES.get(3), "You are asked to write a Python script that fetches data from an external API and stores it in a database. Outline your approach including error handling.", List.of("api", "request", "database", "store", "error", "retry", "response", "handle"), List.of("fetch", "handle", "store", "retry", "validate", "log")),

            mcq("PY-COMM-M1", CATEGORIES.get(4), "A non-technical stakeholder asks you to explain what your Python script does. What is the best approach?", "A", "Show them the raw source code.", "B", "Describe what problem it solves, what data it uses, and what output it produces in plain language.", "C", "Tell them it is too complex to explain.", "B", "Plain language focused on outcomes is more useful than technical detail for non-technical audiences.", List.of()),
            mcq("PY-COMM-M2", CATEGORIES.get(4), "A user reports that your data pipeline produced wrong results. What is your first communication step?", "A", "Tell them they are wrong.", "B", "Acknowledge the report, ask for a specific example, and confirm you will investigate before drawing conclusions.", "C", "Ignore the report until you have a fix.", "B", "Acknowledging and gathering specifics before concluding shows professionalism.", List.of()),
            open("PY-COMM-O1", CATEGORIES.get(4), "Explain what a Python decorator does to a colleague who knows programming but has not used Python before.", List.of("decorator", "function", "wrap", "behaviour", "syntax", "reuse", "example", "apply"), List.of("explain", "describe", "example", "compare", "show")),
            open("PY-COMM-O2", CATEGORIES.get(4), "A client asks why their scheduled Python job did not run last night. Describe how you would investigate and what you would communicate while the investigation is ongoing.", List.of("scheduled", "job", "log", "error", "cron", "investigate", "communicate", "status"), List.of("check", "investigate", "communicate", "update", "confirm", "explain"))
        );
    }

    private List<InterviewQuestion> sdeDeveloperBank() {
        return List.of(
            mcq("SDE-HR-M1", CATEGORIES.get(0), "Which introduction is strongest for a Software Development Engineer role?", "A", "Describe a system or feature you built, the technologies used, and the outcome.", "B", "List every framework you have installed.", "C", "Say you prefer to let your code speak for itself.", "A", "A concrete system example with outcome demonstrates engineering impact.", List.of()),
            mcq("SDE-HR-M2", CATEGORIES.get(0), "An interviewer asks about your development process. What is the best answer?", "A", "I write code until it works.", "B", "I clarify requirements, break the problem into tasks, implement incrementally, and verify with tests.", "C", "I copy solutions from the internet.", "B", "A structured process shows engineering discipline.", List.of()),
            open("SDE-HR-O1", CATEGORIES.get(0), "Introduce yourself as an SDE candidate. Mention one system or feature you built, the stack you used, and a technical challenge you overcame.", List.of("system", "feature", "built", "stack", "challenge", "solution", "technology", "engineer"), List.of("designed", "implemented", "solved", "built", "deployed")),
            open("SDE-HR-O2", CATEGORIES.get(0), "Describe a technical strength you have and give a specific example of how it improved a project or codebase.", List.of("strength", "example", "code", "project", "improve", "quality", "design", "review"), List.of("refactored", "optimized", "improved", "designed", "reviewed")),

            mcq("SDE-TECH-M1", CATEGORIES.get(1), "What is the purpose of a code review?", "A", "To find someone to blame for bugs.", "B", "To catch defects early, share knowledge, and maintain consistent code quality.", "C", "To slow down the team.", "B", "Code reviews improve quality and spread understanding across the team.", List.of()),
            mcq("SDE-TECH-M2", CATEGORIES.get(1), "What does Big-O notation describe?", "A", "The number of lines in a program.", "B", "How an algorithm's time or space requirements grow relative to input size.", "C", "The version number of an operating system.", "B", "Big-O characterises algorithmic efficiency as input scales.", List.of()),
            open("SDE-TECH-O1", CATEGORIES.get(1), "Explain the difference between a stack and a queue and give a real-world use case for each.", List.of("stack", "queue", "lifo", "fifo", "order", "use", "example", "data"), List.of("explain", "describe", "use", "example", "compare")),
            open("SDE-TECH-O2", CATEGORIES.get(1), "A REST API you own is returning 500 errors intermittently. Walk through your investigation from first alert to resolution.", List.of("api", "error", "log", "reproduce", "trace", "service", "request", "response"), List.of("check", "investigate", "reproduce", "trace", "fix", "verify", "monitor")),

            mcq("SDE-SIT-M1", CATEGORIES.get(2), "You are mid-sprint and discover a critical security vulnerability in a dependency. What do you do?", "A", "Finish the sprint first.", "B", "Raise it immediately, assess exploitability, and work with the team to patch or mitigate before continuing.", "C", "Delete the dependency without telling anyone.", "B", "Security issues require immediate assessment and team communication.", List.of()),
            mcq("SDE-SIT-M2", CATEGORIES.get(2), "A product manager requests a feature that would require significant refactoring. How do you respond?", "A", "Refuse to do it.", "B", "Estimate the effort, explain the tradeoffs, and propose a phased approach that delivers value incrementally.", "C", "Agree without estimating.", "B", "Transparent estimation and phased delivery balance business and technical needs.", List.of()),
            open("SDE-SIT-O1", CATEGORIES.get(2), "You are assigned to a legacy codebase with no tests and an urgent bug fix needed. Describe your approach.", List.of("legacy", "test", "bug", "fix", "understand", "risk", "change", "verify"), List.of("read", "understand", "test", "fix", "verify", "document")),
            open("SDE-SIT-O2", CATEGORIES.get(2), "Two engineers disagree on the architecture for a new service. You are asked to help resolve it. What do you do?", List.of("architecture", "disagree", "option", "tradeoff", "decision", "team", "criteria", "discuss"), List.of("facilitate", "compare", "discuss", "decide", "document", "align")),

            mcq("SDE-PROB-M1", CATEGORIES.get(3), "You need to design a URL shortener. What is the first thing you clarify?", "A", "The font to use on the landing page.", "B", "Expected scale, read/write ratio, uniqueness requirements, and whether custom slugs are needed.", "C", "The colour scheme.", "B", "Clarifying scale and requirements before designing prevents costly rework.", List.of()),
            mcq("SDE-PROB-M2", CATEGORIES.get(3), "A nightly batch job is taking twice as long as last week. What is your first investigation step?", "A", "Rewrite it in a different language.", "B", "Compare recent data volume, query plans, and resource metrics against last week's baseline.", "C", "Increase server size without investigating.", "B", "Comparing baselines identifies whether the cause is data growth, a query change, or resource contention.", List.of()),
            open("SDE-PROB-O1", CATEGORIES.get(3), "Design a simple rate limiter for an API endpoint. Describe the data structure, algorithm, and how you would handle edge cases.", List.of("rate", "limit", "token", "bucket", "counter", "window", "request", "algorithm"), List.of("design", "implement", "handle", "store", "check", "reset")),
            open("SDE-PROB-O2", CATEGORIES.get(3), "A feature flag system needs to roll out a change to 10% of users. Describe how you would implement and verify it.", List.of("feature", "flag", "rollout", "percentage", "user", "verify", "monitor", "rollback"), List.of("implement", "verify", "monitor", "rollback", "test", "measure")),

            mcq("SDE-COMM-M1", CATEGORIES.get(4), "A stakeholder asks for a status update on a delayed feature. What is the best response?", "A", "Say everything is fine.", "B", "Give the current state, the reason for the delay, the revised estimate, and what is being done to recover.", "C", "Avoid the conversation.", "B", "Honest, structured updates maintain trust during delays.", List.of()),
            mcq("SDE-COMM-M2", CATEGORIES.get(4), "How do you explain a technical trade-off to a non-technical manager?", "A", "Use as much jargon as possible.", "B", "Frame it in terms of cost, time, risk, and user impact without requiring technical background.", "C", "Tell them not to worry about it.", "B", "Business-framed trade-offs let non-technical stakeholders make informed decisions.", List.of()),
            open("SDE-COMM-O1", CATEGORIES.get(4), "Explain what a microservice architecture is to a new team member who has only worked on monoliths.", List.of("microservice", "service", "independent", "deploy", "communicate", "boundary", "monolith", "scale"), List.of("explain", "describe", "compare", "example", "contrast")),
            open("SDE-COMM-O2", CATEGORIES.get(4), "A customer reports that a feature you shipped is not working as described. Describe how you would handle the communication and investigation.", List.of("customer", "feature", "report", "investigate", "communicate", "reproduce", "fix", "update"), List.of("acknowledge", "investigate", "communicate", "fix", "update", "confirm"))
        );
    }

    private List<InterviewQuestion> frontendDeveloperBank() {
        return List.of(
            mcq("FE-HR-M1", CATEGORIES.get(0), "Which introduction is strongest for a Frontend Developer interview?", "A", "Describe a UI you built, the framework used, and a usability problem you solved.", "B", "List every CSS property you know.", "C", "Say you only care about making things look pretty.", "A", "A concrete UI example with a solved usability problem shows frontend impact.", List.of()),
            mcq("FE-HR-M2", CATEGORIES.get(0), "An interviewer asks what you enjoy about frontend development. What is the best answer?", "A", "I like that I never have to think about performance.", "B", "I enjoy bridging design and functionality to create experiences that are both usable and accessible.", "C", "I just do whatever the designer says.", "B", "Connecting design, usability, and accessibility shows a rounded frontend perspective.", List.of()),
            open("FE-HR-O1", CATEGORIES.get(0), "Introduce yourself as a Frontend Developer candidate. Mention one UI project, the framework or tools used, and a challenge you solved for users.", List.of("ui", "frontend", "react", "component", "user", "design", "project", "challenge"), List.of("built", "designed", "implemented", "solved", "improved")),
            open("FE-HR-O2", CATEGORIES.get(0), "Describe a frontend strength and give a specific example of how it improved a user experience or codebase.", List.of("strength", "example", "user", "component", "performance", "accessibility", "css", "improve"), List.of("improved", "refactored", "optimized", "designed", "fixed")),

            mcq("FE-TECH-M1", CATEGORIES.get(1), "What is the difference between display:flex and display:grid in CSS?", "A", "They are identical.", "B", "Flexbox is one-dimensional layout; Grid is two-dimensional and suited for complex page layouts.", "C", "Grid only works in Chrome.", "B", "Understanding layout model dimensions helps choose the right tool for each design.", List.of()),
            mcq("FE-TECH-M2", CATEGORIES.get(1), "What causes a React component to re-render?", "A", "Only when the page is refreshed.", "B", "When its state or props change, or when a parent re-renders and passes new props.", "C", "Whenever any component in the app changes.", "B", "Understanding re-render triggers is essential for optimising React performance.", List.of()),
            open("FE-TECH-O1", CATEGORIES.get(1), "Explain how you would make a web page accessible to keyboard-only users. Include at least two concrete techniques.", List.of("keyboard", "focus", "tab", "aria", "accessible", "semantic", "label", "role"), List.of("add", "use", "ensure", "test", "implement", "check")),
            open("FE-TECH-O2", CATEGORIES.get(1), "A page loads slowly on mobile. Describe your investigation and the optimisations you would consider.", List.of("performance", "mobile", "load", "image", "bundle", "network", "render", "optimise"), List.of("measure", "optimise", "reduce", "lazy", "compress", "test", "audit")),

            mcq("FE-SIT-M1", CATEGORIES.get(2), "A designer hands you a mockup that is not feasible with the current tech stack in the given time. What do you do?", "A", "Implement it anyway and miss the deadline.", "B", "Explain the constraint, propose the closest feasible alternative, and agree on a path forward.", "C", "Ignore the mockup.", "B", "Transparent constraint communication and a concrete alternative keeps the project moving.", List.of()),
            mcq("FE-SIT-M2", CATEGORIES.get(2), "You notice a UI bug in production that was not caught in review. What is your first step?", "A", "Blame the reviewer.", "B", "Assess the user impact, communicate to the team, and prepare a fix with a test to prevent recurrence.", "C", "Wait for a user to report it.", "B", "Proactive impact assessment and a prevention step are the professional response.", List.of()),
            open("FE-SIT-O1", CATEGORIES.get(2), "You are asked to add a new feature to a React codebase you have not worked in before. Describe how you would get started.", List.of("codebase", "component", "structure", "read", "understand", "plan", "test", "react"), List.of("read", "explore", "ask", "plan", "test", "review")),
            open("FE-SIT-O2", CATEGORIES.get(2), "A teammate's pull request introduces a pattern you think will cause performance issues. How do you handle the review?", List.of("review", "performance", "pattern", "concern", "explain", "suggest", "alternative", "team"), List.of("explain", "suggest", "discuss", "compare", "agree", "communicate")),

            mcq("FE-PROB-M1", CATEGORIES.get(3), "A button click handler fires twice on mobile. What is the most likely cause and first investigation step?", "A", "The server is broken.", "B", "Check for both click and touchend events being bound, or a double-tap triggering two events.", "C", "Rewrite the entire page.", "B", "Duplicate event binding is a common mobile issue and is quick to verify.", List.of()),
            mcq("FE-PROB-M2", CATEGORIES.get(3), "You need to fetch data and show a loading state in React. Which pattern is most appropriate?", "A", "Fetch in the render function directly.", "B", "Use useEffect to fetch on mount, track loading state with useState, and render conditionally.", "C", "Hardcode the data.", "B", "useEffect with loading state is the standard React data-fetching pattern.", List.of()),
            open("FE-PROB-O1", CATEGORIES.get(3), "A form submission works in Chrome but fails silently in Safari. Describe your debugging approach.", List.of("safari", "chrome", "browser", "form", "submit", "event", "debug", "compatibility"), List.of("test", "check", "compare", "debug", "reproduce", "verify", "inspect")),
            open("FE-PROB-O2", CATEGORIES.get(3), "You need to build a reusable dropdown component. Describe the props interface, accessibility considerations, and how you would test it.", List.of("component", "props", "dropdown", "accessible", "keyboard", "aria", "test", "reusable"), List.of("design", "implement", "test", "handle", "ensure", "document")),

            mcq("FE-COMM-M1", CATEGORIES.get(4), "A user reports that a form is confusing. What is your first step?", "A", "Tell them the form is correct.", "B", "Ask for specifics about where they got confused, then review the flow and labels for clarity.", "C", "Remove the form.", "B", "Gathering specifics before changing anything leads to targeted improvements.", List.of()),
            mcq("FE-COMM-M2", CATEGORIES.get(4), "How do you explain a browser compatibility issue to a non-technical project manager?", "A", "Send them the MDN compatibility table.", "B", "Explain which users are affected, what they see, and what the fix involves in plain terms.", "C", "Tell them it is not your problem.", "B", "User impact and plain-language explanation help managers make informed decisions.", List.of()),
            open("FE-COMM-O1", CATEGORIES.get(4), "Explain what responsive design means to a client who is not technical. Include why it matters for their users.", List.of("responsive", "mobile", "screen", "layout", "user", "device", "design", "adapt"), List.of("explain", "describe", "example", "show", "adapt")),
            open("FE-COMM-O2", CATEGORIES.get(4), "A stakeholder wants a feature added that would hurt page performance. How do you communicate the tradeoff and propose a path forward?", List.of("performance", "feature", "tradeoff", "impact", "user", "alternative", "communicate", "propose"), List.of("explain", "propose", "communicate", "measure", "suggest", "discuss"))
        );
    }

    private List<InterviewQuestion> fullStackDeveloperBank() {
        return List.of(
            mcq("FS-HR-M1", CATEGORIES.get(0), "Which introduction is strongest for a Full-Stack Developer interview?", "A", "Describe a feature you built end-to-end, covering both the UI and the backend service.", "B", "Say you only prefer frontend work.", "C", "List every language you have ever tried.", "A", "An end-to-end example demonstrates the breadth expected of a full-stack role.", List.of()),
            mcq("FS-HR-M2", CATEGORIES.get(0), "An interviewer asks how you handle working across the stack. What is the best answer?", "A", "I avoid the backend whenever possible.", "B", "I follow the data from the UI through the API to the database, which helps me trace issues and design cohesive features.", "C", "I only work on one layer at a time and never coordinate.", "B", "Following data across layers shows integrated thinking.", List.of()),
            open("FS-HR-O1", CATEGORIES.get(0), "Introduce yourself as a Full-Stack Developer. Describe one feature you built end-to-end, the technologies on each layer, and a problem you solved.", List.of("frontend", "backend", "api", "database", "feature", "stack", "project", "built"), List.of("built", "designed", "implemented", "connected", "deployed")),
            open("FS-HR-O2", CATEGORIES.get(0), "Describe a strength relevant to full-stack work and give a concrete example of how it helped deliver a complete feature.", List.of("strength", "frontend", "backend", "feature", "example", "deliver", "integrate", "team"), List.of("integrated", "built", "delivered", "coordinated", "solved")),

            mcq("FS-TECH-M1", CATEGORIES.get(1), "What is the role of an ORM in a full-stack application?", "A", "It replaces the need for a database.", "B", "It maps objects in application code to database rows, reducing boilerplate SQL and abstracting the data layer.", "C", "It only works with NoSQL databases.", "B", "ORMs reduce repetitive SQL and keep data access consistent with the application's object model.", List.of()),
            mcq("FS-TECH-M2", CATEGORIES.get(1), "What is CORS and why does it matter for full-stack development?", "A", "A CSS framework.", "B", "A browser security mechanism that restricts cross-origin requests; the server must explicitly allow trusted origins.", "C", "A database protocol.", "B", "Understanding CORS is essential when the frontend and backend are on different origins.", List.of()),
            open("FS-TECH-O1", CATEGORIES.get(1), "Trace a user login request from the browser through the API to the database and back. Describe each step and what could go wrong.", List.of("request", "api", "database", "token", "response", "auth", "validate", "session"), List.of("trace", "check", "validate", "return", "handle", "verify")),
            open("FS-TECH-O2", CATEGORIES.get(1), "Explain how you would design a simple REST API for a to-do list application, including the endpoints and data model.", List.of("rest", "endpoint", "api", "resource", "method", "database", "model", "response"), List.of("design", "define", "implement", "return", "handle", "validate")),

            mcq("FS-SIT-M1", CATEGORIES.get(2), "A backend change breaks the frontend unexpectedly. What is your first step?", "A", "Revert everything without investigating.", "B", "Identify the breaking change, assess impact, communicate to the team, and coordinate a fix or rollback.", "C", "Blame the frontend developer.", "B", "Identifying the change and coordinating a response minimises user impact.", List.of()),
            mcq("FS-SIT-M2", CATEGORIES.get(2), "You are asked to estimate a full-stack feature with unclear requirements. What do you do?", "A", "Give a number without asking questions.", "B", "Clarify the requirements, break the work into frontend and backend tasks, and provide a range with stated assumptions.", "C", "Refuse to estimate.", "B", "Clarifying requirements and stating assumptions makes estimates reliable.", List.of()),
            open("FS-SIT-O1", CATEGORIES.get(2), "You discover that an API you own is being called far more than expected, causing slow responses. Describe your investigation and response.", List.of("api", "load", "performance", "investigate", "cache", "optimise", "monitor", "scale"), List.of("investigate", "measure", "optimise", "cache", "communicate", "monitor")),
            open("FS-SIT-O2", CATEGORIES.get(2), "A designer, a backend engineer, and a product manager all have conflicting priorities for the next sprint. How do you navigate this?", List.of("priority", "conflict", "team", "communicate", "tradeoff", "align", "sprint", "decision"), List.of("facilitate", "communicate", "align", "prioritise", "discuss", "decide")),

            mcq("FS-PROB-M1", CATEGORIES.get(3), "A full-stack feature works in development but fails in production. What is the most systematic first step?", "A", "Redeploy without investigating.", "B", "Compare environment variables, dependencies, and logs between development and production.", "C", "Assume it is a network issue.", "B", "Environment differences are the most common cause of dev-to-prod failures.", List.of()),
            mcq("FS-PROB-M2", CATEGORIES.get(3), "You need to add pagination to an existing API that returns all records. What do you consider?", "A", "Return fewer random records.", "B", "Add limit and offset or cursor parameters, update the response schema, and update the frontend to handle pages.", "C", "Cache all records in the browser.", "B", "Pagination requires coordinated changes to the API contract and the frontend consumer.", List.of()),
            open("FS-PROB-O1", CATEGORIES.get(3), "Design the data flow for a real-time notification feature. Describe the frontend, backend, and any infrastructure components.", List.of("notification", "websocket", "event", "frontend", "backend", "push", "subscribe", "real-time"), List.of("design", "connect", "push", "handle", "subscribe", "implement")),
            open("FS-PROB-O2", CATEGORIES.get(3), "A user reports that their profile update saves successfully but the UI still shows the old data. Describe your debugging approach.", List.of("cache", "state", "response", "update", "ui", "stale", "refresh", "debug"), List.of("check", "trace", "debug", "verify", "reproduce", "fix")),

            mcq("FS-COMM-M1", CATEGORIES.get(4), "A product manager asks why a full-stack feature is taking longer than expected. What is the best response?", "A", "Say it is complicated and leave it at that.", "B", "Explain which layer is causing the delay, what you have tried, and the revised estimate.", "C", "Blame the backend team.", "B", "Specific, layer-aware communication helps stakeholders understand and plan.", List.of()),
            mcq("FS-COMM-M2", CATEGORIES.get(4), "How do you keep a frontend developer and a backend developer aligned on an API contract during development?", "A", "Let them figure it out at integration time.", "B", "Agree on the request and response schema upfront, document it, and communicate changes before implementing them.", "C", "Have one person write both sides.", "B", "Upfront schema agreement and documented changes prevent integration surprises.", List.of()),
            open("FS-COMM-O1", CATEGORIES.get(4), "Explain the concept of a REST API to a junior developer who has only built static websites.", List.of("rest", "api", "request", "response", "endpoint", "data", "server", "client"), List.of("explain", "describe", "example", "compare", "show")),
            open("FS-COMM-O2", CATEGORIES.get(4), "A client reports that their dashboard is showing incorrect totals. Describe how you would communicate with them while investigating across the stack.", List.of("dashboard", "total", "data", "investigate", "communicate", "frontend", "backend", "database"), List.of("acknowledge", "investigate", "communicate", "update", "confirm", "fix"))
        );
    }

    private List<InterviewQuestion> javaDeveloperBank() {
        return List.of(
            mcq("JV-HR-M1", CATEGORIES.get(0), "Which introduction is strongest for a Java Developer interview?", "A", "Describe a Java application you built, the frameworks used, and a technical problem you solved.", "B", "Say Java is your favourite language without any examples.", "C", "List every Java version you have heard of.", "A", "A concrete application example with a solved problem demonstrates practical Java experience.", List.of()),
            mcq("JV-HR-M2", CATEGORIES.get(0), "An interviewer asks about your experience with object-oriented design. What is the best answer?", "A", "I avoid classes whenever possible.", "B", "I apply encapsulation, inheritance, and polymorphism to keep code modular and maintainable, and I can give a specific example.", "C", "I only use static methods.", "B", "Naming OOP principles with a concrete example shows applied understanding.", List.of()),
            open("JV-HR-O1", CATEGORIES.get(0), "Introduce yourself as a Java Developer candidate. Mention one Java project, the frameworks or tools used, and a challenge you overcame.", List.of("java", "spring", "project", "framework", "challenge", "solution", "build", "experience"), List.of("built", "implemented", "solved", "designed", "deployed")),
            open("JV-HR-O2", CATEGORIES.get(0), "Describe a Java-related strength and give a specific example of how it improved a project or codebase.", List.of("java", "strength", "example", "project", "design", "pattern", "improve", "quality"), List.of("refactored", "optimized", "improved", "designed", "reviewed")),

            mcq("JV-TECH-M1", CATEGORIES.get(1), "What is the difference between an interface and an abstract class in Java?", "A", "They are identical.", "B", "An interface defines a contract with no state; an abstract class can have state and partial implementation.", "C", "Abstract classes cannot be extended.", "B", "The distinction guides when to use each for flexible, maintainable design.", List.of()),
            mcq("JV-TECH-M2", CATEGORIES.get(1), "What does the synchronized keyword do in Java?", "A", "It speeds up method execution.", "B", "It ensures only one thread executes the method or block at a time, preventing race conditions.", "C", "It makes a variable immutable.", "B", "Synchronization is the basic Java mechanism for thread-safe access to shared state.", List.of()),
            open("JV-TECH-O1", CATEGORIES.get(1), "Explain how Java's garbage collector works at a high level and what a memory leak looks like in a Java application.", List.of("garbage", "collector", "heap", "memory", "leak", "reference", "object", "gc"), List.of("explain", "describe", "identify", "prevent", "monitor")),
            open("JV-TECH-O2", CATEGORIES.get(1), "A Spring Boot REST endpoint is returning 500 errors under load. Walk through your investigation from logs to resolution.", List.of("spring", "endpoint", "error", "log", "thread", "connection", "pool", "investigate"), List.of("check", "investigate", "reproduce", "trace", "fix", "verify", "monitor")),

            mcq("JV-SIT-M1", CATEGORIES.get(2), "You find a NullPointerException in production logs that you cannot reproduce locally. What do you do?", "A", "Ignore it until it causes an outage.", "B", "Add defensive null checks and logging around the suspect code, deploy to staging, and monitor.", "C", "Delete the logs.", "B", "Defensive checks and targeted logging help surface intermittent null issues safely.", List.of()),
            mcq("JV-SIT-M2", CATEGORIES.get(2), "A junior developer on your team is struggling with a Java concept. How do you help?", "A", "Tell them to read the documentation and leave.", "B", "Explain the concept with a simple example, pair on a small task, and check in later.", "C", "Do their work for them without explaining.", "B", "Explanation with a practical example and follow-up builds lasting understanding.", List.of()),
            open("JV-SIT-O1", CATEGORIES.get(2), "You are asked to migrate a Java 8 codebase to Java 17. Describe your approach and the risks you would manage.", List.of("java", "migrate", "version", "dependency", "test", "risk", "compatibility", "build"), List.of("assess", "test", "migrate", "verify", "update", "communicate")),
            open("JV-SIT-O2", CATEGORIES.get(2), "A performance regression appears after a dependency upgrade. Describe how you would identify the cause and decide whether to roll back or fix forward.", List.of("performance", "regression", "dependency", "upgrade", "profile", "rollback", "investigate", "compare"), List.of("profile", "compare", "investigate", "rollback", "fix", "verify", "communicate")),

            mcq("JV-PROB-M1", CATEGORIES.get(3), "You need to process a large collection in Java efficiently. Which approach is most appropriate?", "A", "Load everything into memory and sort repeatedly.", "B", "Use Java Streams with lazy evaluation or process in batches to keep memory usage manageable.", "C", "Write the data to a file and read it back.", "B", "Lazy streams and batching avoid memory exhaustion for large datasets.", List.of()),
            mcq("JV-PROB-M2", CATEGORIES.get(3), "A deadlock is occurring in a multi-threaded Java service. What is your first investigation step?", "A", "Restart the server repeatedly.", "B", "Take a thread dump, identify threads waiting on each other's locks, and trace the lock acquisition order.", "C", "Add more threads.", "B", "Thread dumps reveal the lock cycle that causes a deadlock.", List.of()),
            open("JV-PROB-O1", CATEGORIES.get(3), "Design a simple in-memory cache in Java. Describe the data structure, eviction policy, and thread safety approach.", List.of("cache", "map", "eviction", "thread", "synchronized", "concurrent", "lru", "expire"), List.of("design", "implement", "handle", "synchronize", "evict", "test")),
            open("JV-PROB-O2", CATEGORIES.get(3), "A scheduled Java job is failing silently. Describe how you would add observability and prevent silent failures in future.", List.of("scheduled", "job", "log", "monitor", "alert", "exception", "observe", "silent"), List.of("add", "log", "monitor", "alert", "handle", "test", "verify")),

            mcq("JV-COMM-M1", CATEGORIES.get(4), "A stakeholder asks why a Java service is slow. What is the best response?", "A", "Say Java is always slow.", "B", "Explain what profiling showed, which component is the bottleneck, and what the fix involves.", "C", "Avoid the question.", "B", "Evidence-based explanation with a clear fix builds stakeholder confidence.", List.of()),
            mcq("JV-COMM-M2", CATEGORIES.get(4), "How do you explain a checked exception to a non-Java developer?", "A", "Tell them it is too complex to explain.", "B", "Describe it as a situation the compiler forces you to plan for, like a method that might fail to read a file.", "C", "Send them the Java specification.", "B", "A concrete analogy makes the concept accessible without requiring Java knowledge.", List.of()),
            open("JV-COMM-O1", CATEGORIES.get(4), "Explain the concept of dependency injection to a developer who has only written procedural code.", List.of("dependency", "injection", "interface", "decouple", "test", "spring", "constructor", "example"), List.of("explain", "describe", "example", "compare", "show")),
            open("JV-COMM-O2", CATEGORIES.get(4), "A client reports that their Java-based report generation is timing out. Describe how you would communicate with them while investigating.", List.of("timeout", "report", "investigate", "communicate", "log", "query", "performance", "update"), List.of("acknowledge", "investigate", "communicate", "update", "confirm", "fix"))
        );
    }

    private List<InterviewQuestion> dataAnalystBank() {
        return List.of(
            mcq("DA-HR-M1", CATEGORIES.get(0), "Which introduction is strongest for a Data Analyst interview?", "A", "Describe an analysis you completed, the data source, the tool used, and the insight it produced.", "B", "Say you are good with numbers without any examples.", "C", "List every spreadsheet function you know.", "A", "A concrete analysis with a real insight demonstrates applied data skills.", List.of()),
            mcq("DA-HR-M2", CATEGORIES.get(0), "An interviewer asks how you handle ambiguous data requests. What is the best answer?", "A", "I start analysing immediately without asking questions.", "B", "I clarify the business question, confirm the data sources, and agree on the success metric before starting.", "C", "I refuse ambiguous requests.", "B", "Clarifying the question and metric before starting prevents wasted effort.", List.of()),
            open("DA-HR-O1", CATEGORIES.get(0), "Introduce yourself as a Data Analyst candidate. Mention one analysis project, the tools used, and an insight that influenced a decision.", List.of("analysis", "data", "sql", "excel", "insight", "decision", "tool", "project"), List.of("analysed", "found", "reported", "visualised", "recommended")),
            open("DA-HR-O2", CATEGORIES.get(0), "Describe a strength relevant to data analysis and give a concrete example of how it helped you deliver a useful insight.", List.of("strength", "data", "analysis", "example", "insight", "accuracy", "communicate", "stakeholder"), List.of("analysed", "identified", "communicated", "visualised", "improved")),

            mcq("DA-TECH-M1", CATEGORIES.get(1), "What is the difference between GROUP BY and HAVING in SQL?", "A", "They are identical.", "B", "GROUP BY aggregates rows; HAVING filters the aggregated results, similar to WHERE but applied after grouping.", "C", "HAVING replaces WHERE entirely.", "B", "Understanding the execution order of GROUP BY and HAVING is essential for correct aggregation queries.", List.of()),
            mcq("DA-TECH-M2", CATEGORIES.get(1), "What does a left join return that an inner join does not?", "A", "Only matching rows from both tables.", "B", "All rows from the left table, with nulls for columns from the right table where there is no match.", "C", "Only rows from the right table.", "B", "Left joins preserve unmatched rows from the left table, which is critical for completeness checks.", List.of()),
            open("DA-TECH-O1", CATEGORIES.get(1), "Describe how you would investigate a sudden drop in a key metric. Walk through your steps from noticing the drop to presenting a finding.", List.of("metric", "drop", "investigate", "data", "segment", "cause", "compare", "trend"), List.of("investigate", "compare", "segment", "identify", "verify", "communicate")),
            open("DA-TECH-O2", CATEGORIES.get(1), "Explain the difference between correlation and causation and give an example of why confusing them could lead to a bad business decision.", List.of("correlation", "causation", "confound", "example", "data", "decision", "variable", "relationship"), List.of("explain", "describe", "example", "distinguish", "warn")),

            mcq("DA-SIT-M1", CATEGORIES.get(2), "A stakeholder asks for a report by end of day but the data source is incomplete. What do you do?", "A", "Deliver the report with the incomplete data without mentioning it.", "B", "Communicate the data gap, deliver what is reliable, and clearly label what is missing or estimated.", "C", "Refuse to deliver anything.", "B", "Transparent labelling of incomplete data prevents misleading decisions.", List.of()),
            mcq("DA-SIT-M2", CATEGORIES.get(2), "You find an anomaly in a dataset that contradicts the expected trend. What is your first step?", "A", "Remove the anomaly from the dataset.", "B", "Investigate whether it is a data quality issue or a genuine signal before drawing conclusions.", "C", "Report it as a confirmed finding immediately.", "B", "Distinguishing data quality issues from genuine signals prevents false conclusions.", List.of()),
            open("DA-SIT-O1", CATEGORIES.get(2), "A business team asks you to prove that a marketing campaign caused a sales increase. Describe how you would approach this analysis carefully.", List.of("campaign", "sales", "cause", "correlation", "control", "segment", "compare", "evidence"), List.of("compare", "segment", "control", "analyse", "communicate", "caveat")),
            open("DA-SIT-O2", CATEGORIES.get(2), "Two departments give you conflicting data for the same metric. Describe how you would resolve the discrepancy.", List.of("discrepancy", "data", "source", "definition", "reconcile", "communicate", "metric", "align"), List.of("investigate", "compare", "communicate", "reconcile", "align", "document")),

            mcq("DA-PROB-M1", CATEGORIES.get(3), "A dashboard is showing a spike that looks like a data error. What is your first investigation step?", "A", "Delete the spike from the chart.", "B", "Check the data pipeline for ingestion errors, compare with the raw source, and verify the time range.", "C", "Assume the spike is real and report it.", "B", "Checking the pipeline and raw source distinguishes errors from genuine events.", List.of()),
            mcq("DA-PROB-M2", CATEGORIES.get(3), "You need to combine data from three tables with different granularities. What is the key risk?", "A", "The query will always fail.", "B", "Row duplication or incorrect aggregation if joins are not carefully designed for each granularity level.", "C", "The tables will merge automatically.", "B", "Mismatched granularity is a common source of inflated or incorrect aggregation results.", List.of()),
            open("DA-PROB-O1", CATEGORIES.get(3), "Describe how you would build a simple churn prediction model using only SQL and basic statistics. What data would you need and what would you measure?", List.of("churn", "predict", "sql", "metric", "retention", "segment", "measure", "data"), List.of("define", "measure", "segment", "analyse", "predict", "validate")),
            open("DA-PROB-O2", CATEGORIES.get(3), "A product team asks you to identify why user engagement dropped last month. Describe your end-to-end analysis approach.", List.of("engagement", "drop", "segment", "funnel", "cohort", "compare", "cause", "data"), List.of("segment", "compare", "investigate", "identify", "communicate", "recommend")),

            mcq("DA-COMM-M1", CATEGORIES.get(4), "A non-technical manager asks you to explain a regression analysis result. What is the best approach?", "A", "Show them the full statistical output.", "B", "Explain what the model predicts, how confident you are, and what it means for the business decision.", "C", "Tell them to trust the numbers.", "B", "Business-framed interpretation is more useful than raw statistical output for decision-makers.", List.of()),
            mcq("DA-COMM-M2", CATEGORIES.get(4), "A stakeholder disagrees with your analysis conclusion. How do you respond?", "A", "Tell them they are wrong.", "B", "Walk through your methodology, invite them to identify any assumptions they question, and explore the data together.", "C", "Change your conclusion to match theirs.", "B", "Transparent methodology and collaborative exploration build trust and may surface valid concerns.", List.of()),
            open("DA-COMM-O1", CATEGORIES.get(4), "Explain what a confidence interval means to a marketing manager who has no statistics background.", List.of("confidence", "interval", "range", "estimate", "uncertainty", "sample", "explain", "example"), List.of("explain", "describe", "example", "simplify", "communicate")),
            open("DA-COMM-O2", CATEGORIES.get(4), "A client asks why their monthly report numbers differ from last month's report for the same period. Describe how you would investigate and communicate.", List.of("report", "discrepancy", "data", "definition", "filter", "investigate", "communicate", "reconcile"), List.of("investigate", "compare", "communicate", "explain", "reconcile", "confirm"))
        );
    }

    private List<InterviewQuestion> customerSupportBank() {
        return List.of(
            mcq("CS-HR-M1", CATEGORIES.get(0), "Which introduction is strongest for a Customer Support Engineer interview?", "A", "Describe a time you resolved a complex technical issue for a customer and what the outcome was.", "B", "Say you are patient without any examples.", "C", "List every ticketing system you have used.", "A", "A concrete resolution story with an outcome demonstrates both technical and communication skills.", List.of()),
            mcq("CS-HR-M2", CATEGORIES.get(0), "An interviewer asks how you balance technical investigation with customer communication. What is the best answer?", "A", "I investigate silently and only contact the customer when I have a fix.", "B", "I keep the customer informed at agreed intervals while investigating, so they never feel ignored.", "C", "I let the customer investigate themselves.", "B", "Regular updates maintain trust even when a fix is not yet available.", List.of()),
            open("CS-HR-O1", CATEGORIES.get(0), "Introduce yourself as a Customer Support Engineer candidate. Describe one complex issue you resolved, how you communicated with the customer, and what you learned.", List.of("customer", "issue", "resolve", "communicate", "technical", "support", "learn", "outcome"), List.of("resolved", "communicated", "investigated", "explained", "followed")),
            open("CS-HR-O2", CATEGORIES.get(0), "Describe a strength relevant to customer support engineering and give a concrete example of how it helped a customer.", List.of("strength", "customer", "example", "technical", "communicate", "empathy", "resolve", "support"), List.of("resolved", "communicated", "explained", "helped", "improved")),

            mcq("CS-TECH-M1", CATEGORIES.get(1), "A customer reports an API returning 401 errors. What is the most likely cause and first investigation step?", "A", "The server is down.", "B", "Check whether the customer's token is expired, missing, or malformed before investigating further.", "C", "Tell the customer to restart their computer.", "B", "Authentication errors are most commonly caused by token issues, which are quick to verify.", List.of()),
            mcq("CS-TECH-M2", CATEGORIES.get(1), "What is the purpose of reading application logs when investigating a customer issue?", "A", "Logs are only useful for developers, not support engineers.", "B", "Logs provide a timestamped record of what the system did, which helps correlate events with the customer's reported problem.", "C", "Logs automatically fix issues.", "B", "Correlating log events with the reported time and behaviour is the foundation of technical investigation.", List.of()),
            open("CS-TECH-O1", CATEGORIES.get(1), "A customer says their data export is incomplete. Describe your step-by-step investigation from first contact to resolution.", List.of("export", "data", "incomplete", "investigate", "log", "reproduce", "filter", "query"), List.of("investigate", "reproduce", "check", "verify", "communicate", "resolve")),
            open("CS-TECH-O2", CATEGORIES.get(1), "Explain what an HTTP status code is and give examples of 200, 404, and 500 in plain language a non-technical customer would understand.", List.of("http", "status", "200", "404", "500", "error", "response", "explain"), List.of("explain", "describe", "example", "simplify", "communicate")),

            mcq("CS-SIT-M1", CATEGORIES.get(2), "A customer is angry because the same issue has recurred three times. What is your first response?", "A", "Tell them it is not your fault.", "B", "Acknowledge the frustration, apologise for the recurrence, and commit to a root cause investigation rather than another quick fix.", "C", "Close the ticket.", "B", "Acknowledging recurrence and committing to root cause analysis rebuilds trust.", List.of()),
            mcq("CS-SIT-M2", CATEGORIES.get(2), "You are handling five open tickets and a new critical issue arrives. What do you do?", "A", "Ignore the new issue until the others are closed.", "B", "Triage the critical issue immediately, communicate expected response times to other customers, and escalate if needed.", "C", "Close all existing tickets to focus on the new one.", "B", "Triage and communication ensure critical issues are addressed without abandoning other customers.", List.of()),
            open("CS-SIT-O1", CATEGORIES.get(2), "A customer reports that a feature is not working as documented. After investigation you find the documentation is wrong, not the feature. How do you handle this?", List.of("documentation", "feature", "wrong", "customer", "communicate", "update", "apologise", "correct"), List.of("acknowledge", "apologise", "communicate", "update", "confirm", "follow")),
            open("CS-SIT-O2", CATEGORIES.get(2), "You suspect a customer issue is caused by a bug in the product, not user error. Describe how you would escalate it internally and communicate with the customer.", List.of("bug", "escalate", "internal", "communicate", "customer", "reproduce", "report", "update"), List.of("reproduce", "escalate", "communicate", "update", "confirm", "follow")),

            mcq("CS-PROB-M1", CATEGORIES.get(3), "A customer cannot reproduce an issue on demand but it happens regularly. What is your investigation approach?", "A", "Close the ticket as cannot reproduce.", "B", "Ask for logs, timestamps, and environment details to identify a pattern without requiring live reproduction.", "C", "Tell the customer to record their screen at all times.", "B", "Pattern analysis from logs and metadata can identify intermittent issues without live reproduction.", List.of()),
            mcq("CS-PROB-M2", CATEGORIES.get(3), "You need to explain a complex technical root cause to a non-technical customer. What is the best approach?", "A", "Send them the full stack trace.", "B", "Describe what happened in terms of user impact, what caused it, and what has been done to prevent recurrence.", "C", "Tell them it was a server issue and leave it at that.", "B", "Impact, cause, and prevention framing gives customers the information they need without requiring technical knowledge.", List.of()),
            open("CS-PROB-O1", CATEGORIES.get(3), "A customer's integration with your API stopped working after a platform update. Describe how you would diagnose and resolve it.", List.of("integration", "api", "update", "breaking", "change", "diagnose", "resolve", "communicate"), List.of("investigate", "compare", "diagnose", "communicate", "fix", "verify", "follow")),
            open("CS-PROB-O2", CATEGORIES.get(3), "You receive ten tickets in one day reporting the same error. Describe how you would triage, investigate, and communicate at scale.", List.of("triage", "scale", "error", "pattern", "communicate", "investigate", "escalate", "update"), List.of("triage", "identify", "escalate", "communicate", "update", "resolve", "follow")),

            mcq("CS-COMM-M1", CATEGORIES.get(4), "A customer asks for a fix timeline you cannot commit to. What is the best response?", "A", "Give a random date to satisfy them.", "B", "Explain what is known, what is still being investigated, and commit to a specific update time rather than a fix time.", "C", "Tell them you have no idea.", "B", "A committed update time is more trustworthy than a speculative fix date.", List.of()),
            mcq("CS-COMM-M2", CATEGORIES.get(4), "How do you write a ticket resolution summary that is useful for both the customer and internal teams?", "A", "Write only the fix in technical terms.", "B", "Include the reported symptom, root cause in plain language, the fix applied, and any steps the customer should take.", "C", "Copy the error log into the ticket.", "B", "A structured summary serves both audiences and creates a useful knowledge base entry.", List.of()),
            open("CS-COMM-O1", CATEGORIES.get(4), "Write a response to a customer who has been waiting three days for a resolution and has just sent a frustrated follow-up.", List.of("frustrated", "wait", "apologise", "update", "status", "communicate", "empathy", "resolve"), List.of("acknowledge", "apologise", "update", "commit", "communicate", "follow")),
            open("CS-COMM-O2", CATEGORIES.get(4), "A customer asks you to explain why their data was not included in last night's batch job. Describe how you would investigate and communicate the answer.", List.of("batch", "job", "data", "missing", "investigate", "log", "communicate", "explain"), List.of("investigate", "check", "communicate", "explain", "confirm", "follow"))
        );
    }

    private List<InterviewQuestion> bdrBank() {
        return List.of(
            mcq("BDR-HR-M1", CATEGORIES.get(0), "Which introduction is strongest for a Business Development Representative interview?", "A", "Describe a prospecting or outreach effort you ran, the approach you used, and the outcome.", "B", "Say you are a people person without any examples.", "C", "List every CRM you have heard of.", "A", "A concrete outreach example with an outcome demonstrates applied BDR skills.", List.of()),
            mcq("BDR-HR-M2", CATEGORIES.get(0), "An interviewer asks how you handle rejection in a sales development role. What is the best answer?", "A", "I take it personally and stop outreach.", "B", "I treat each no as information, adjust my approach based on patterns, and maintain consistent activity.", "C", "I ignore rejections entirely.", "B", "Treating rejection as data and adjusting shows resilience and a growth mindset.", List.of()),
            open("BDR-HR-O1", CATEGORIES.get(0), "Introduce yourself as a BDR candidate. Describe one outreach campaign or prospecting effort, the method used, and the result.", List.of("prospect", "outreach", "campaign", "lead", "pipeline", "result", "contact", "qualify"), List.of("contacted", "qualified", "booked", "followed", "converted")),
            open("BDR-HR-O2", CATEGORIES.get(0), "Describe a strength relevant to business development and give a concrete example of how it helped you generate or advance a lead.", List.of("strength", "lead", "prospect", "communicate", "example", "pipeline", "qualify", "follow"), List.of("generated", "qualified", "advanced", "booked", "communicated")),

            mcq("BDR-TECH-M1", CATEGORIES.get(1), "What is the purpose of a CRM in a BDR role?", "A", "It automatically closes deals.", "B", "It tracks prospect interactions, pipeline stage, and follow-up tasks so nothing falls through the cracks.", "C", "It replaces the need for outreach.", "B", "A CRM is the system of record that keeps pipeline activity organised and visible.", List.of()),
            mcq("BDR-TECH-M2", CATEGORIES.get(1), "What does a qualified lead mean in a sales development context?", "A", "Any contact in the database.", "B", "A prospect who meets defined criteria such as budget, authority, need, and timeline that make them worth pursuing.", "C", "A lead that has already purchased.", "B", "Qualification criteria ensure sales effort is focused on prospects most likely to convert.", List.of()),
            open("BDR-TECH-O1", CATEGORIES.get(1), "Describe how you would research a target account before making first contact. What information would you gather and why?", List.of("research", "account", "prospect", "industry", "pain", "contact", "personalise", "outreach"), List.of("research", "identify", "personalise", "prepare", "contact", "qualify")),
            open("BDR-TECH-O2", CATEGORIES.get(1), "Explain what a sales cadence is and describe the sequence you would use for a cold outreach campaign.", List.of("cadence", "sequence", "email", "call", "follow", "touch", "prospect", "outreach"), List.of("design", "sequence", "follow", "personalise", "adjust", "track")),

            mcq("BDR-SIT-M1", CATEGORIES.get(2), "A prospect goes silent after an initial positive conversation. What do you do?", "A", "Give up and remove them from the pipeline.", "B", "Send a brief, value-focused follow-up, try a different channel, and set a final break-up message if there is still no response.", "C", "Call them every day.", "B", "A structured follow-up sequence respects the prospect's time while keeping the opportunity alive.", List.of()),
            mcq("BDR-SIT-M2", CATEGORIES.get(2), "A prospect raises a pricing objection early in the conversation. What is the best response?", "A", "Immediately offer a discount.", "B", "Acknowledge the concern, ask questions to understand their budget context, and focus on value before discussing price.", "C", "End the call.", "B", "Understanding context before discussing price keeps the conversation focused on value.", List.of()),
            open("BDR-SIT-O1", CATEGORIES.get(2), "You have a weekly meeting quota and it is Thursday with only half your target met. Describe how you would approach the rest of the week.", List.of("quota", "target", "pipeline", "outreach", "prioritise", "activity", "follow", "plan"), List.of("prioritise", "contact", "follow", "plan", "focus", "communicate")),
            open("BDR-SIT-O2", CATEGORIES.get(2), "A prospect asks a detailed technical question you cannot answer. How do you handle it without losing their confidence?", List.of("technical", "question", "answer", "honest", "follow", "resource", "connect", "confidence"), List.of("acknowledge", "follow", "connect", "communicate", "confirm", "update")),

            mcq("BDR-PROB-M1", CATEGORIES.get(3), "Your outreach response rate drops significantly one month. What is your first investigation step?", "A", "Send more emails without changing anything.", "B", "Review messaging, subject lines, target segment, and timing to identify what changed.", "C", "Blame the product.", "B", "Systematic review of variables identifies the cause of a response rate drop.", List.of()),
            mcq("BDR-PROB-M2", CATEGORIES.get(3), "You are given a new territory with no existing pipeline. What is your first priority?", "A", "Wait for inbound leads.", "B", "Research the territory, identify ideal customer profiles, build a prospect list, and begin outreach with a clear cadence.", "C", "Ask to be reassigned.", "B", "Structured research and a clear outreach plan are the foundation of building a new territory.", List.of()),
            open("BDR-PROB-O1", CATEGORIES.get(3), "Describe how you would build a target account list from scratch for a new product launch. What criteria would you use?", List.of("account", "list", "criteria", "icp", "segment", "research", "prioritise", "prospect"), List.of("research", "identify", "prioritise", "build", "qualify", "segment")),
            open("BDR-PROB-O2", CATEGORIES.get(3), "A prospect says your product does something a competitor does better. How do you respond and keep the conversation moving?", List.of("competitor", "objection", "value", "differentiate", "respond", "prospect", "feature", "benefit"), List.of("acknowledge", "differentiate", "respond", "focus", "ask", "advance")),

            mcq("BDR-COMM-M1", CATEGORIES.get(4), "A prospect asks for more information before agreeing to a meeting. What is the best response?", "A", "Send a 20-page brochure.", "B", "Ask what specific information would be most useful, then send a concise, relevant resource and propose a time to discuss.", "C", "Tell them to visit the website.", "B", "Asking what is most useful and following up with a meeting proposal keeps momentum.", List.of()),
            mcq("BDR-COMM-M2", CATEGORIES.get(4), "How do you personalise an outreach email to a prospect you have never spoken to?", "A", "Use a generic template with their first name.", "B", "Reference a specific detail about their company, role, or a recent event that connects to the value you offer.", "C", "Send the same email to everyone.", "B", "Specific personalisation shows research and increases relevance to the prospect.", List.of()),
            open("BDR-COMM-O1", CATEGORIES.get(4), "Write a brief cold outreach email to a VP of Engineering at a mid-size software company. Focus on a relevant pain point and a clear call to action.", List.of("email", "outreach", "personalise", "pain", "value", "call", "action", "prospect"), List.of("personalise", "focus", "propose", "communicate", "follow", "connect")),
            open("BDR-COMM-O2", CATEGORIES.get(4), "A prospect says they are happy with their current vendor. Describe how you would respond to keep the door open without being pushy.", List.of("vendor", "objection", "respond", "value", "differentiate", "follow", "relationship", "open"), List.of("acknowledge", "differentiate", "follow", "communicate", "respect", "propose"))
        );
    }
}
