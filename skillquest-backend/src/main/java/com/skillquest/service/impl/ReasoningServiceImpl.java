package com.skillquest.service.impl;

import com.skillquest.dto.ReasoningQuestionDto;
import com.skillquest.dto.ReasoningQuizResponse;
import com.skillquest.dto.ReasoningResultResponse;
import com.skillquest.dto.ReasoningSubmitRequest;
import com.skillquest.entity.ReasoningAttempt;
import com.skillquest.entity.ReasoningAssessmentSession;
import com.skillquest.entity.ReasoningQuestion;
import com.skillquest.entity.User;
import com.skillquest.exception.AssessmentExpiredException;
import com.skillquest.exception.UserNotFoundException;
import com.skillquest.repository.ReasoningAssessmentSessionRepository;
import com.skillquest.repository.ReasoningAttemptRepository;
import com.skillquest.repository.ReasoningQuestionRepository;
import com.skillquest.repository.UserRepository;
import com.skillquest.service.ReasoningService;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.dao.DuplicateKeyException;

import java.time.LocalDateTime;
import java.time.Duration;
import java.time.Instant;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReasoningServiceImpl implements ReasoningService {

    private static final Logger log = LoggerFactory.getLogger(ReasoningServiceImpl.class);

    private final ReasoningQuestionRepository questionRepository;
    private final ReasoningAttemptRepository attemptRepository;
    private final ReasoningAssessmentSessionRepository sessionRepository;
    private final UserRepository userRepository;

    public ReasoningServiceImpl(ReasoningQuestionRepository questionRepository,
                                ReasoningAttemptRepository attemptRepository,
                                ReasoningAssessmentSessionRepository sessionRepository,
                                UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void initQuestions() {
        try {
            seedMissingQuestions(createSeedQuestions());
        } catch (Exception ex) {
            log.error("Could not seed reasoning questions: {}", ex.getMessage());
        }
    }

    private void seedMissingQuestions(List<ReasoningQuestion> seedQuestions) {
        List<ReasoningQuestion> existingQuestions = questionRepository.findAll();
        Set<String> existingIds = new HashSet<>();
        Set<String> existingQuestionKeys = new HashSet<>();

        for (ReasoningQuestion question : existingQuestions) {
            if (question.getId() != null) {
                existingIds.add(question.getId());
            }
            existingQuestionKeys.add(questionKey(question));
        }

        List<ReasoningQuestion> missingQuestions = new ArrayList<>();
        for (ReasoningQuestion seedQuestion : seedQuestions) {
            String questionKey = questionKey(seedQuestion);
            if (!existingIds.contains(seedQuestion.getId())
                    && !existingQuestionKeys.contains(questionKey)) {
                missingQuestions.add(seedQuestion);
                existingIds.add(seedQuestion.getId());
                existingQuestionKeys.add(questionKey);
            }
        }

        if (!missingQuestions.isEmpty()) {
            questionRepository.saveAll(missingQuestions);
            log.info("Seeded {} missing reasoning questions into MongoDB.", missingQuestions.size());
        }
    }

    private String questionKey(ReasoningQuestion question) {
        String difficulty = question.getDifficulty() == null
                ? ""
                : question.getDifficulty().trim().toUpperCase(Locale.ROOT);
        String text = question.getQuestion() == null
                ? ""
                : question.getQuestion().trim().toLowerCase(Locale.ROOT);
        return difficulty + "|" + text;
    }

    @Override
    public ReasoningQuizResponse getQuiz(String difficulty, String userEmail, String submissionKey) {
        String diff = normalizeDifficulty(difficulty);
        String sessionId = sessionDocumentId(userEmail, diff);
        Optional<ReasoningAssessmentSession> currentSession = sessionRepository.findById(sessionId);
        if (currentSession.isEmpty()) {
            if (submissionKey != null && !submissionKey.isBlank()) {
                throw new IllegalArgumentException("Assessment session is invalid. Start a new quest.");
            }
            return startQuiz(diff, userEmail);
        }
        ReasoningAssessmentSession session = currentSession.get();

        if (submissionKey != null && !submissionKey.isBlank()
                && !submissionKey.equals(session.getSubmissionKey())) {
            throw new IllegalArgumentException("This assessment session is no longer active. Start a new quest.");
        }

        return toQuizResponse(session);
    }

    @Override
    public synchronized ReasoningQuizResponse startQuiz(String difficulty, String userEmail) {
        return toQuizResponse(startSession(userEmail, normalizeDifficulty(difficulty)));
    }

    private ReasoningAssessmentSession startSession(String userEmail, String difficulty) {
        String sessionId = sessionDocumentId(userEmail, difficulty);
        Optional<ReasoningAssessmentSession> current = sessionRepository.findById(sessionId);
        Instant now = Instant.now();

        if (current.isPresent()) {
            ReasoningAssessmentSession existing = current.get();
            boolean alreadySubmitted = attemptRepository
                    .findByUserEmailAndSubmissionKey(userEmail, existing.getSubmissionKey())
                    .isPresent();
            if (!alreadySubmitted && "ACTIVE".equals(existing.getStatus())
                    && now.isBefore(existing.getDeadlineAt())) {
                return existing;
            }
            if ("ACTIVE".equals(existing.getStatus()) && !now.isBefore(existing.getDeadlineAt())) {
                existing.setStatus("EXPIRED");
                sessionRepository.save(existing);
            }
        }

        int durationMinutes = durationMinutes(difficulty);
        List<ReasoningQuestion> questions = loadQuestions(difficulty);
        ReasoningAssessmentSession session = ReasoningAssessmentSession.builder()
                .id(sessionId)
                .userEmail(userEmail)
                .difficulty(difficulty)
                .submissionKey(UUID.randomUUID().toString())
                .status("ACTIVE")
                .startedAt(now)
                .deadlineAt(now.plus(Duration.ofMinutes(durationMinutes)))
                .questions(questions)
                .build();
        return sessionRepository.save(session);
    }

    private List<ReasoningQuestion> loadQuestions(String difficulty) {
        List<ReasoningQuestion> questions = questionRepository.findByDifficulty(difficulty);
        if (questions == null || questions.isEmpty()) {
            List<ReasoningQuestion> seedList = createSeedQuestions();
            try {
                seedMissingQuestions(seedList);
                questions = questionRepository.findByDifficulty(difficulty);
            } catch (Exception e) {
                questions = seedList.stream()
                        .filter(q -> q.getDifficulty().equalsIgnoreCase(difficulty))
                        .collect(Collectors.toList());
            }
        }

        int expectedCount = questionLimit(difficulty);
        if (questions != null && questions.size() > expectedCount) {
            questions = questions.subList(0, expectedCount);
        }
        return questions == null ? Collections.emptyList() : questions;
    }

    private ReasoningQuizResponse toQuizResponse(ReasoningAssessmentSession session) {
        List<ReasoningQuestionDto> dtoList = session.getQuestions().stream()
                .map(q -> ReasoningQuestionDto.builder()
                        .id(q.getId())
                        .question(q.getQuestion())
                        .statement(q.getStatement())
                        .options(q.getOptions())
                        .topic(q.getTopic())
                        .build())
                .collect(Collectors.toList());

        return ReasoningQuizResponse.builder()
                .difficulty(session.getDifficulty())
                .questionCount(dtoList.size())
                .durationMinutes(durationMinutes(session.getDifficulty()))
                .baseXP(baseXP(session.getDifficulty()))
                .questions(dtoList)
                .submissionKey(session.getSubmissionKey())
                .deadlineAt(session.getDeadlineAt())
                .build();
    }

    private String sessionDocumentId(String userEmail, String difficulty) {
        return UUID.nameUUIDFromBytes((userEmail + "|" + difficulty).getBytes(StandardCharsets.UTF_8)).toString();
    }

    private int durationMinutes(String difficulty) {
        if ("ADVANCED".equals(difficulty)) return 20;
        if ("INTERMEDIATE".equals(difficulty)) return 15;
        return 10;
    }

    private int questionLimit(String difficulty) {
        if ("ADVANCED".equals(difficulty)) return 20;
        if ("INTERMEDIATE".equals(difficulty)) return 15;
        return 10;
    }

    private int baseXP(String difficulty) {
        if ("ADVANCED".equals(difficulty)) return 250;
        if ("INTERMEDIATE".equals(difficulty)) return 150;
        return 80;
    }

    @Override
    public synchronized ReasoningResultResponse submitQuiz(String userEmail, ReasoningSubmitRequest request) {
        String diff = normalizeDifficulty(request.getDifficulty());
        String submissionKey = request.getSubmissionKey();
        if (submissionKey == null || submissionKey.isBlank()) {
            throw new IllegalArgumentException("Assessment session key is required.");
        }

        Optional<ReasoningAttempt> existingAttempt =
                attemptRepository.findByUserEmailAndSubmissionKey(userEmail, submissionKey);
        if (existingAttempt.isPresent()) {
            ReasoningAttempt existing = existingAttempt.get();
            if (!existing.getDifficulty().equals(diff)) {
                throw new IllegalArgumentException("Assessment session does not match the selected difficulty.");
            }
            return toResult(existing, "Assessment result previously recorded.");
        }

        String sessionId = sessionDocumentId(userEmail, diff);
        ReasoningAssessmentSession session = sessionRepository.findById(sessionId)
                .filter(candidate -> submissionKey.equals(candidate.getSubmissionKey()))
                .orElseThrow(() -> new IllegalArgumentException("Assessment session is invalid. Start a new quest."));

        if ("EXPIRED".equals(session.getStatus())) {
            throw new AssessmentExpiredException("The assessment deadline has passed. Start a new quest to try again.");
        }
        if (!"ACTIVE".equals(session.getStatus())) {
            throw new IllegalArgumentException("Assessment session is no longer active. Start a new quest.");
        }

        Instant submittedAt = Instant.now();
        if (submittedAt.isAfter(session.getDeadlineAt())) {
            session.setStatus("EXPIRED");
            sessionRepository.save(session);
            throw new AssessmentExpiredException("The assessment deadline has passed. Your answers were not scored. Start a new quest to try again.");
        }

        List<ReasoningQuestion> questions = session.getQuestions();
        int baseXP = baseXP(diff);
        Map<String, String> userAnswers = request.getAnswers() != null ? request.getAnswers() : Collections.emptyMap();
        int score = 0;

        for (ReasoningQuestion q : questions) {
            String selected = userAnswers.get(q.getId());
            if (selected != null && selected.trim().equalsIgnoreCase(q.getCorrectAnswer().trim())) {
                score++;
            }
        }

        int totalQuestions = questions.size();
        int accuracy = totalQuestions > 0 ? Math.round(((float) score / totalQuestions) * 100) : 0;
        boolean passed = accuracy >= 70;
        int timeTakenSeconds = (int) Math.max(0, Duration.between(session.getStartedAt(), submittedAt).getSeconds());

        // Calculate earned XP based on base XP and accuracy
        int earnedXp;
        String badge;

        if (accuracy >= 90) {
            earnedXp = baseXP;
            badge = "🏆 Logic Master";
        } else if (accuracy >= 80) {
            earnedXp = (int) Math.round(baseXP * 0.85);
            badge = "🥇 Logic Expert";
        } else if (accuracy >= 70) {
            earnedXp = (int) Math.round(baseXP * 0.70);
            badge = "🥈 Puzzle Solver";
        } else if (accuracy >= 50) {
            earnedXp = (int) Math.round(baseXP * 0.40);
            badge = "🥉 Explorer";
        } else {
            earnedXp = 20; // Minimum effort XP
            badge = "🌱 Quest Beginner";
        }

        // Save Attempt in MongoDB
        ReasoningAttempt attempt = ReasoningAttempt.builder()
                .id(submissionKey)
                .userEmail(userEmail)
                .difficulty(diff)
                .score(score)
                .totalQuestions(totalQuestions)
                .accuracy(accuracy)
                .passed(passed)
                .earnedXp(earnedXp)
                .badge(badge)
                .timeTakenSeconds(timeTakenSeconds)
                .answers(userAnswers)
                .submissionKey(submissionKey)
                .completedAt(LocalDateTime.now())
                .build();

        try {
            attemptRepository.insert(attempt);
        } catch (DuplicateKeyException ex) {
            return attemptRepository.findByUserEmailAndSubmissionKey(userEmail, submissionKey)
                    .map(savedAttempt -> toResult(savedAttempt, "Assessment result previously recorded."))
                    .orElseThrow(() -> ex);
        }

        // Update User profile in MongoDB Atlas
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userEmail));

        user.setXp(user.getXp() + earnedXp);
        user.setLevel((user.getXp() / 500) + 1);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        session.setStatus("COMPLETED");
        sessionRepository.save(session);

        log.info("Candidate {} scored {}/{} ({}%) on {} quest. Awarded {} XP. New Total XP: {}",
                userEmail, score, totalQuestions, accuracy, diff, earnedXp, user.getXp());

        return ReasoningResultResponse.builder()
                .score(score)
                .totalQuestions(totalQuestions)
                .accuracy(accuracy)
                .passed(passed)
                .earnedXp(earnedXp)
                .badge(badge)
                .timeTakenSeconds(timeTakenSeconds)
                .correctAnswers(score)
                .wrongAnswers(totalQuestions - score)
                .message(passed ? "Congratulations! You completed the quest successfully." : "Quest finished. Practice more to achieve a passing score.")
                .build();
    }

    private ReasoningResultResponse toResult(ReasoningAttempt attempt, String message) {
        return ReasoningResultResponse.builder()
                .score(attempt.getScore())
                .totalQuestions(attempt.getTotalQuestions())
                .accuracy(attempt.getAccuracy())
                .passed(attempt.isPassed())
                .earnedXp(attempt.getEarnedXp())
                .badge(attempt.getBadge())
                .timeTakenSeconds(attempt.getTimeTakenSeconds())
                .correctAnswers(attempt.getScore())
                .wrongAnswers(attempt.getTotalQuestions() - attempt.getScore())
                .message(message)
                .build();
    }

    private String normalizeDifficulty(String diff) {
        if (diff == null) return "BEGINNER";
        String upper = diff.trim().toUpperCase();
        if (upper.contains("ADV") || upper.contains("EXP")) return "ADVANCED";
        if (upper.contains("INT")) return "INTERMEDIATE";
        return "BEGINNER";
    }

    private List<ReasoningQuestion> createSeedQuestions() {
        List<ReasoningQuestion> list = new ArrayList<>();

        // --- 10 BEGINNER QUESTIONS ---
        list.add(ReasoningQuestion.builder()
                .id("B01")
                .difficulty("BEGINNER")
                .question("What comes next in the sequence?")
                .statement("2, 4, 8, 16, ?")
                .options(List.of("18", "20", "24", "32"))
                .correctAnswer("32")
                .topic("Number Series")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("B02")
                .difficulty("BEGINNER")
                .question("Find the odd one out among the given animals.")
                .statement("")
                .options(List.of("Lion", "Tiger", "Cow", "Leopard"))
                .correctAnswer("Cow")
                .topic("Classification")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("B03")
                .difficulty("BEGINNER")
                .question("If SOUTH is coded as TPVUI, how is NORTH coded in the same language?")
                .statement("")
                .options(List.of("OPSUI", "OPSUII", "OPSUIH", "OPSUIJ"))
                .correctAnswer("OPSUI")
                .topic("Coding-Decoding")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("B04")
                .difficulty("BEGINNER")
                .question("Ravi is taller than Kiran. Kiran is taller than Deepa. Who is the shortest?")
                .statement("")
                .options(List.of("Ravi", "Kiran", "Deepa", "Cannot be determined"))
                .correctAnswer("Deepa")
                .topic("Ranking & Ordering")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("B05")
                .difficulty("BEGINNER")
                .question("Complete the analogy: Doctor : Hospital :: Teacher : ?")
                .statement("")
                .options(List.of("Book", "School", "Student", "Classroom"))
                .correctAnswer("School")
                .topic("Analogy")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("B06")
                .difficulty("BEGINNER")
                .question("A person walks 5 km East, then turns right and walks 3 km. Which direction is he facing now?")
                .statement("")
                .options(List.of("North", "South", "East", "West"))
                .correctAnswer("South")
                .topic("Direction Sense")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("B07")
                .difficulty("BEGINNER")
                .question("Pointing to a girl in a photograph, Arun said, 'She is the daughter of my mother’s only son.' How is Arun related to the girl?")
                .statement("")
                .options(List.of("Brother", "Uncle", "Father", "Grandfather"))
                .correctAnswer("Father")
                .topic("Blood Relations")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("B08")
                .difficulty("BEGINNER")
                .question("What number should come next in this square series?")
                .statement("1, 4, 9, 16, 25, ?")
                .options(List.of("30", "36", "49", "64"))
                .correctAnswer("36")
                .topic("Number Series")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("B09")
                .difficulty("BEGINNER")
                .question("All roses are flowers. All flowers are plants. Which statement is definitely true?")
                .statement("")
                .options(List.of("All roses are plants", "All plants are roses", "No roses are plants", "Some roses are not flowers"))
                .correctAnswer("All roses are plants")
                .topic("Syllogism")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("B10")
                .difficulty("BEGINNER")
                .question("Find the odd one out among the fruits and vegetables.")
                .statement("")
                .options(List.of("Apple", "Mango", "Carrot", "Banana"))
                .correctAnswer("Carrot")
                .topic("Classification")
                .build());

        // --- 15 INTERMEDIATE QUESTIONS ---
        list.add(ReasoningQuestion.builder()
                .id("I01")
                .difficulty("INTERMEDIATE")
                .question("Find the missing letter in the alphabetical series: B, D, G, K, ?")
                .statement("")
                .options(List.of("N", "O", "P", "Q"))
                .correctAnswer("P")
                .topic("Letter Series")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("I02")
                .difficulty("INTERMEDIATE")
                .question("Find the next number in the series: 3, 7, 15, 31, 63, ?")
                .statement("")
                .options(List.of("95", "112", "127", "128"))
                .correctAnswer("127")
                .topic("Number Series")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("I03")
                .difficulty("INTERMEDIATE")
                .question("If DELHI is coded as 73541 and CALCUTTA as 82589662, how is CALICUT coded?")
                .statement("")
                .options(List.of("8251896", "8254896", "8251869", "8251966"))
                .correctAnswer("8251896")
                .topic("Coding-Decoding")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("I04")
                .difficulty("INTERMEDIATE")
                .question("A runner travels 4 km North from point A, then turns right and travels 3 km. How far is he from point A in a straight line?")
                .statement("")
                .options(List.of("7 km", "5 km", "6 km", "4.5 km"))
                .correctAnswer("5 km")
                .topic("Direction & Distance")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("I05")
                .difficulty("INTERMEDIATE")
                .question("A is the father of B. But B is not the son of A. What is B to A?")
                .statement("")
                .options(List.of("Father", "Mother", "Daughter", "Grandson"))
                .correctAnswer("Daughter")
                .topic("Blood Relations")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("I06")
                .difficulty("INTERMEDIATE")
                .question("Five friends A, B, C, D, E sit in a row facing North. C is in the middle. B is to the immediate right of C. D is to the immediate left of C. A is at the extreme left. Who is at the extreme right?")
                .statement("")
                .options(List.of("B", "D", "E", "C"))
                .correctAnswer("E")
                .topic("Seating Arrangement")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("I07")
                .difficulty("INTERMEDIATE")
                .question("Complete the analogy: Clock : Time :: Thermometer : ?")
                .statement("")
                .options(List.of("Heat", "Temperature", "Mercury", "Radiation"))
                .correctAnswer("Temperature")
                .topic("Analogy")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("I08")
                .difficulty("INTERMEDIATE")
                .question("Identify the next term in the progression: 12, 14, 18, 26, 42, ?")
                .statement("")
                .options(List.of("58", "64", "74", "84"))
                .correctAnswer("74")
                .topic("Number Series")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("I09")
                .difficulty("INTERMEDIATE")
                .question("Statements: Some pens are books. All books are pencils.\nConclusions:\nI. Some pens are pencils.\nII. All pencils are pens.")
                .statement("")
                .options(List.of("Only Conclusion I follows", "Only Conclusion II follows", "Both follow", "Neither follows"))
                .correctAnswer("Only Conclusion I follows")
                .topic("Syllogism")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("I10")
                .difficulty("INTERMEDIATE")
                .question("If FRIEND is coded as HUMJTK (+2, +3, +4, ...), how is CANDLE coded?")
                .statement("")
                .options(List.of("EDRIRL", "ESRIRL", "DCQJQK", "FDRJRM"))
                .correctAnswer("EDRIRL")
                .topic("Coding-Decoding")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("I11")
                .difficulty("INTERMEDIATE")
                .question("In a class of 40 students, Priya is ranked 11th from the top. What is her rank from the bottom?")
                .statement("")
                .options(List.of("29th", "30th", "31st", "28th"))
                .correctAnswer("30th")
                .topic("Ranking & Ordering")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("I12")
                .difficulty("INTERMEDIATE")
                .question("What is the angle between the hour hand and the minute hand of a clock at 3:30?")
                .statement("")
                .options(List.of("60°", "75°", "80°", "90°"))
                .correctAnswer("75°")
                .topic("Clock Logic")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("I13")
                .difficulty("INTERMEDIATE")
                .question("If 1st January 2024 was a Monday, what day of the week was 1st January 2025? (Note: 2024 is a leap year)")
                .statement("")
                .options(List.of("Tuesday", "Wednesday", "Thursday", "Friday"))
                .correctAnswer("Wednesday")
                .topic("Calendar Logic")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("I14")
                .difficulty("INTERMEDIATE")
                .question("All squares are rectangles. All rectangles are polygons. Therefore:")
                .statement("")
                .options(List.of("All squares are polygons", "Some polygons are not rectangles", "All polygons are squares", "No rectangle is a square"))
                .correctAnswer("All squares are polygons")
                .topic("Logical Deduction")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("I15")
                .difficulty("INTERMEDIATE")
                .question("Find the odd pair out: (2, 8), (3, 27), (4, 64), (5, 100)")
                .statement("")
                .options(List.of("(2, 8)", "(3, 27)", "(4, 64)", "(5, 100)"))
                .correctAnswer("(5, 100)")
                .topic("Classification")
                .build());

        // --- 20 ADVANCED QUESTIONS ---
        list.add(ReasoningQuestion.builder()
                .id("A01")
                .difficulty("ADVANCED")
                .question("What is the next number in the cubic series: 2, 3, 10, 29, 66, ? (Hint: n^3 + 2)")
                .statement("")
                .options(List.of("99", "127", "130", "144"))
                .correctAnswer("127")
                .topic("Advanced Series")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A02")
                .difficulty("ADVANCED")
                .question("Statements: All cats are dogs. No dog is a horse. Some horses are cows.\nConclusions:\nI. No cat is a horse.\nII. Some cows are not dogs.")
                .statement("")
                .options(List.of("Only I follows", "Only II follows", "Both I and II follow", "Neither follows"))
                .correctAnswer("Both I and II follow")
                .topic("Complex Syllogism")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A03")
                .difficulty("ADVANCED")
                .question("A traveler walks 10 km South, turns left and walks 15 km, turns left and walks 10 km, then turns right and walks 5 km. How far and in which direction is he from the starting point?")
                .statement("")
                .options(List.of("20 km East", "25 km East", "15 km South-East", "20 km North"))
                .correctAnswer("20 km East")
                .topic("Direction & Vectors")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A04")
                .difficulty("ADVANCED")
                .question("P is the brother of Q. R is the daughter of Q. S is the sister of P. T is the brother of R. Who is the paternal/maternal uncle of T?")
                .statement("")
                .options(List.of("P", "Q", "S", "R"))
                .correctAnswer("P")
                .topic("Complex Blood Relations")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A05")
                .difficulty("ADVANCED")
                .question("Eight persons sit around a circular table facing the center. A is second to the left of D. F is diametrically opposite to A. What is F's position relative to D?")
                .statement("")
                .options(List.of("Second to the right", "Immediate left", "Third to the right", "Directly opposite"))
                .correctAnswer("Second to the right")
                .topic("Circular Seating")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A06")
                .difficulty("ADVANCED")
                .question("Statement: 'Invest in our fixed deposit scheme and double your money in 5 years.' — An advertisement.\nAssumption I: The scheme is genuinely profitable.\nAssumption II: People want to double their investments.")
                .statement("")
                .options(List.of("Only I is implicit", "Only II is implicit", "Both I and II are implicit", "Neither is implicit"))
                .correctAnswer("Both I and II are implicit")
                .topic("Statement & Assumptions")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A07")
                .difficulty("ADVANCED")
                .question("In a code language: '786' means 'study very hard', '958' means 'hard work pays', and '645' means 'study and work'. What digit represents 'very'?")
                .statement("")
                .options(List.of("6", "7", "8", "9"))
                .correctAnswer("7")
                .topic("Fictitious Language Coding")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A08")
                .difficulty("ADVANCED")
                .question("Find the next term in the polynomial series: 4, 18, 48, 100, 180, ? (Pattern: n * (n+1)^2 or n^3 + n^2)")
                .statement("")
                .options(List.of("248", "280", "294", "310"))
                .correctAnswer("294")
                .topic("Advanced Series")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A09")
                .difficulty("ADVANCED")
                .question("Two views of a standard dice show adjacent faces (1, 2, 3) and (1, 3, 5). Which number is opposite to 2?")
                .statement("")
                .options(List.of("4", "5", "6", "1"))
                .correctAnswer("5")
                .topic("Cube & Dice")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A10")
                .difficulty("ADVANCED")
                .question("In a line of candidates, Deepak is 7th from the left and Madhu is 12th from the right. If they swap positions, Deepak becomes 22nd from the left. How many candidates are in the line?")
                .statement("")
                .options(List.of("31", "32", "33", "34"))
                .correctAnswer("33")
                .topic("Position Interchanging")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A11")
                .difficulty("ADVANCED")
                .question("Who among P, Q, R, S, T is the tallest?\nI. Q is taller than R and S, but shorter than P.\nII. T is taller than S, but shorter than R.")
                .statement("")
                .options(List.of("Statement I alone is sufficient", "Statement II alone is sufficient", "Statements I and II together are sufficient", "Neither statement is sufficient"))
                .correctAnswer("Statement I alone is sufficient")
                .topic("Data Sufficiency")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A12")
                .difficulty("ADVANCED")
                .question("Premise: All tech startups that adopted cloud infrastructure cut deployment costs by 40%. Conclusion: Every company wanting to reduce deployment costs by 40% must adopt cloud infrastructure. What is the fundamental logical fallacy?")
                .statement("")
                .options(List.of("Confusing a sufficient condition with a necessary condition", "Ad hominem attack", "Circular reasoning", "False dilemma"))
                .correctAnswer("Confusing a sufficient condition with a necessary condition")
                .topic("Critical Reasoning")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A13")
                .difficulty("ADVANCED")
                .question("An arrangement machine reorders: '45 step 23 high 78 jump 12 low'. Step 1 produces: '78 45 step 23 high jump 12 low'. What rule guides the step-by-step arrangement?")
                .statement("")
                .options(List.of("Descending numbers placed first alternately", "Alphabetical words placed first", "Smallest numbers first", "Random sorting"))
                .correctAnswer("Descending numbers placed first alternately")
                .topic("Machine Input-Output")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A14")
                .difficulty("ADVANCED")
                .question("Find the missing number in the Pythagorean triad matrix:\nRow 1: 3, 4, 25 (3² + 4² = 5²)\nRow 2: 5, 12, 169 (5² + 12² = 13²)\nRow 3: 8, 15, ?")
                .statement("")
                .options(List.of("225", "256", "289", "324"))
                .correctAnswer("289")
                .topic("Matrix Puzzle")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A15")
                .difficulty("ADVANCED")
                .question("I. The global crude oil prices surged by 25%.\nII. Domestic airline operators raised domestic airfares by 10%.")
                .statement("")
                .options(List.of("Statement I is cause and II is effect", "Statement II is cause and I is effect", "Both statements are independent causes", "Both statements are effects of independent causes"))
                .correctAnswer("Statement I is cause and II is effect")
                .topic("Cause and Effect")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A16")
                .difficulty("ADVANCED")
                .question("Statement: High employee turnover is impacting sprint velocity at an engineering firm.\nCourses of Action:\nI. Conduct exit interviews to identify systemic work-culture issues.\nII. Arbitrarily freeze all resignations.")
                .statement("")
                .options(List.of("Only Course I follows", "Only Course II follows", "Both I and II follow", "Neither follows"))
                .correctAnswer("Only Course I follows")
                .topic("Course of Action")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A17")
                .difficulty("ADVANCED")
                .question("Complete the synonym analogy: Veneration : Reverence :: Condemn : ?")
                .statement("")
                .options(List.of("Praise", "Censure", "Ignore", "Acquit"))
                .correctAnswer("Censure")
                .topic("Verbal Analogy")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A18")
                .difficulty("ADVANCED")
                .question("In a family of six (A, B, C, D, E, F), D is grandmother of A and mother of B. C is wife of B and mother of F. What is C's relation to A?")
                .statement("")
                .options(List.of("Aunt", "Mother", "Sister", "Grandmother"))
                .correctAnswer("Mother")
                .topic("Family Tree Logic")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A19")
                .difficulty("ADVANCED")
                .question("Should all company decisions be voted democratically by all employees?\nArgument I: No, operational speed and specialized domain knowledge are critical for complex business decisions.\nArgument II: Yes, all employees feel valued and ownership increases.")
                .statement("")
                .options(List.of("Only Argument I is strong", "Only Argument II is strong", "Both Arguments I and II are strong", "Neither argument is strong"))
                .correctAnswer("Both Arguments I and II are strong")
                .topic("Statement & Arguments")
                .build());

        list.add(ReasoningQuestion.builder()
                .id("A20")
                .difficulty("ADVANCED")
                .question("If 5 # 3 = 16 and 7 # 4 = 33 and 9 # 2 = 77 (Rule: a² - b²), what is 8 # 5?")
                .statement("")
                .options(List.of("36", "39", "40", "49"))
                .correctAnswer("39")
                .topic("Mathematical Operations")
                .build());

        return list;
    }
}
