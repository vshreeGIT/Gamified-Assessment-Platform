package com.skillquest.service.impl;

import com.skillquest.dto.DataDetectiveProgressDto;
import com.skillquest.dto.DataDetectiveResultDto;
import com.skillquest.dto.DataDetectiveSubmitRequest;
import com.skillquest.dto.DataInvestigationDto;
import com.skillquest.dto.DataTaskDto;
import com.skillquest.entity.DataDetectiveAttempt;
import com.skillquest.entity.DataDetectiveSession;
import com.skillquest.entity.User;
import com.skillquest.exception.AssessmentExpiredException;
import com.skillquest.exception.UserNotFoundException;
import com.skillquest.repository.DataDetectiveAttemptRepository;
import com.skillquest.repository.DataDetectiveSessionRepository;
import com.skillquest.repository.UserRepository;
import com.skillquest.service.DataDetectiveService;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DataDetectiveServiceImpl implements DataDetectiveService {
    public static final int DURATION_MINUTES = 10;
    public static final int MAX_XP = 120;
    private static final int PASS_PERCENT = 70;

    private final DataDetectiveSessionRepository sessionRepository;
    private final DataDetectiveAttemptRepository attemptRepository;
    private final UserRepository userRepository;

    public DataDetectiveServiceImpl(DataDetectiveSessionRepository sessionRepository,
                                    DataDetectiveAttemptRepository attemptRepository,
                                    UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.attemptRepository = attemptRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<DataInvestigationDto> listInvestigations(String userEmail) {
        return definitions().values().stream().map(def -> publicDto(def, null, null)).toList();
    }

    @Override
    public DataInvestigationDto getInvestigation(String investigationId, String userEmail) {
        return publicDto(definition(investigationId), null, null);
    }

    @Override
    public synchronized DataInvestigationDto start(String investigationId, String userEmail) {
        Definition definition = definition(investigationId);
        String id = sessionId(userEmail, investigationId);
        Instant now = Instant.now();
        Optional<DataDetectiveSession> stored = sessionRepository.findById(id);
        if (stored.isPresent()) {
            DataDetectiveSession existing = stored.get();
            boolean submitted = attemptRepository.findByUserEmailAndId(userEmail, existing.getSubmissionKey()).isPresent();
            if (!submitted && "ACTIVE".equals(existing.getStatus()) && now.isBefore(existing.getDeadlineAt())) {
                return publicDto(definition, existing.getSubmissionKey(), existing.getDeadlineAt());
            }
            if ("ACTIVE".equals(existing.getStatus()) && !now.isBefore(existing.getDeadlineAt())) {
                existing.setStatus("EXPIRED");
                sessionRepository.save(existing);
            }
        }
        DataDetectiveSession session = DataDetectiveSession.builder()
                .id(id).userEmail(userEmail).investigationId(investigationId)
                .submissionKey(UUID.randomUUID().toString()).status("ACTIVE")
                .startedAt(now).deadlineAt(now.plus(Duration.ofMinutes(DURATION_MINUTES))).build();
        sessionRepository.save(session);
        return publicDto(definition, session.getSubmissionKey(), session.getDeadlineAt());
    }

    @Override
    public DataInvestigationDto getSession(String investigationId, String userEmail, String submissionKey) {
        Definition definition = definition(investigationId);
        DataDetectiveSession session = activeSession(investigationId, userEmail, submissionKey);
        if (!Instant.now().isBefore(session.getDeadlineAt())) {
            session.setStatus("EXPIRED");
            sessionRepository.save(session);
            throw new AssessmentExpiredException("This investigation has timed out. Start a new investigation to try again.");
        }
        return publicDto(definition, session.getSubmissionKey(), session.getDeadlineAt());
    }

    @Override
    public synchronized DataDetectiveResultDto submit(String investigationId, String userEmail,
                                                      DataDetectiveSubmitRequest request) {
        Definition definition = definition(investigationId);
        if (request == null || request.getSubmissionKey() == null || request.getSubmissionKey().isBlank()) {
            throw new IllegalArgumentException("Assessment session key is required.");
        }
        String key = request.getSubmissionKey();
        Optional<DataDetectiveAttempt> previous = attemptRepository.findByUserEmailAndId(userEmail, key);
        if (previous.isPresent()) {
            if (!investigationId.equals(previous.get().getInvestigationId())) {
                throw new IllegalArgumentException("Submission does not match this investigation.");
            }
            return toResult(previous.get());
        }

        DataDetectiveSession session = activeSession(investigationId, userEmail, key);
        Instant submittedAt = Instant.now();
        if (!submittedAt.isBefore(session.getDeadlineAt())) {
            session.setStatus("EXPIRED");
            sessionRepository.save(session);
            throw new AssessmentExpiredException("The investigation deadline has passed. Your answers were not scored.");
        }
        if (!"ACTIVE".equals(session.getStatus())) {
            throw new IllegalArgumentException("This investigation session is no longer active. Start a new investigation.");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found."));
        Map<String, String> answers = request.getAnswers() == null ? Collections.emptyMap() : request.getAnswers();
        Set<String> validTaskIds = definition.tasks().stream().map(Task::id).collect(Collectors.toSet());
        if (answers.keySet().stream().anyMatch(answerId -> !validTaskIds.contains(answerId))
                || answers.values().stream().anyMatch(answer -> answer != null && answer.length() > 500)) {
            throw new IllegalArgumentException("Submission contains an invalid task or oversized response.");
        }
        int score = 0;
        List<String> feedback = new ArrayList<>();
        for (Task task : definition.tasks()) {
            boolean correct = task.accepted().stream().anyMatch(value -> matches(value, answers.get(task.id()), task.inputType()));
            if (correct) score++;
            feedback.add((correct ? "Correct: " : "Review: ") + task.feedback());
        }
        int maxScore = definition.tasks().size();
        int accuracy = Math.round(score * 100f / maxScore);
        int earnedXp = Math.round(MAX_XP * score / (float) maxScore);
        DataDetectiveAttempt attempt = DataDetectiveAttempt.builder()
                .id(key).userEmail(userEmail).investigationId(investigationId)
                .score(score).maxScore(maxScore).accuracy(accuracy).passed(accuracy >= PASS_PERCENT)
                .earnedXp(earnedXp).answers(new HashMap<>(answers)).feedback(feedback)
                .completedAt(LocalDateTime.now()).build();
        try {
            attemptRepository.insert(attempt);
        } catch (DuplicateKeyException ex) {
            return attemptRepository.findByUserEmailAndId(userEmail, key).map(this::toResult).orElseThrow(() -> ex);
        }
        user.setXp(user.getXp() + earnedXp);
        user.setLevel((user.getXp() / 500) + 1);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        session.setStatus("COMPLETED");
        sessionRepository.save(session);
        return toResult(attempt);
    }

    @Override
    public DataDetectiveResultDto getAttempt(String attemptId, String userEmail) {
        DataDetectiveAttempt attempt = attemptRepository.findByUserEmailAndId(userEmail, attemptId)
                .orElseThrow(() -> new IllegalArgumentException("Saved investigation result was not found."));
        return toResult(attempt);
    }

    @Override
    public DataDetectiveProgressDto getProgress(String userEmail) {
        List<DataDetectiveAttempt> attempts = attemptRepository.findByUserEmailOrderByCompletedAtDesc(userEmail);
        Map<String, Integer> progress = definitions().keySet().stream().collect(Collectors.toMap(
                id -> id,
                id -> attempts.stream().anyMatch(a -> id.equals(a.getInvestigationId())) ? 100 : 0,
                (a, b) -> a,
                LinkedHashMap::new));
        int completed = (int) progress.values().stream().filter(value -> value == 100).count();
        List<DataDetectiveResultDto> latest = attempts.stream().limit(3).map(this::toResult).toList();
        return DataDetectiveProgressDto.builder().progress(completed * 100 / definitions().size())
                .completedInvestigations(completed).attemptCount(attempts.size())
                .totalXpEarned(attempts.stream().mapToInt(DataDetectiveAttempt::getEarnedXp).sum())
                .investigationProgress(progress).latestResults(latest).build();
    }

    private DataDetectiveSession activeSession(String investigationId, String userEmail, String key) {
        DataDetectiveSession session = sessionRepository.findById(sessionId(userEmail, investigationId))
                .filter(s -> key != null && key.equals(s.getSubmissionKey()))
                .orElseThrow(() -> new IllegalArgumentException("Investigation session is invalid. Start the investigation again."));
        if (!"ACTIVE".equals(session.getStatus())) {
            throw new IllegalArgumentException("Investigation session is no longer active.");
        }
        return session;
    }

    private DataInvestigationDto publicDto(Definition d, String key, Instant deadline) {
        List<DataTaskDto> tasks = d.tasks().stream().map(t -> DataTaskDto.builder().id(t.id()).title(t.title())
                .prompt(t.prompt()).inputType(t.inputType()).options(t.options()).build()).toList();
        return DataInvestigationDto.builder().id(d.id()).title(d.title()).description(d.description())
                .columns(d.columns()).rows(d.rows()).tasks(tasks).durationMinutes(DURATION_MINUTES).maxXp(MAX_XP)
                .submissionKey(key).deadlineAt(deadline).build();
    }

    private DataDetectiveResultDto toResult(DataDetectiveAttempt a) {
        return DataDetectiveResultDto.builder().attemptId(a.getId()).investigationId(a.getInvestigationId())
                .investigationName(definitions().get(a.getInvestigationId()).title()).score(a.getScore())
                .maxScore(a.getMaxScore()).accuracy(a.getAccuracy()).passed(a.isPassed()).earnedXp(a.getEarnedXp())
                .feedback(a.getFeedback()).completedAt(a.getCompletedAt()).build();
    }

    private String sessionId(String email, String investigationId) {
        return UUID.nameUUIDFromBytes((email + "|" + investigationId).getBytes(StandardCharsets.UTF_8)).toString();
    }

    private Definition definition(String id) {
        Definition def = definitions().get(id);
        if (def == null) throw new IllegalArgumentException("Unknown Data Detective investigation.");
        return def;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().replaceAll("\\s+", " ").toLowerCase(Locale.ROOT);
    }

    private boolean matches(String expected, String submitted, String inputType) {
        if ("NUMBER".equals(inputType)) {
            try { return Double.compare(Double.parseDouble(expected), Double.parseDouble(submitted.trim())) == 0; }
            catch (RuntimeException ignored) { return false; }
        }
        return normalize(expected).equals(normalize(submitted));
    }

    private record Task(String id, String title, String prompt, String inputType, List<String> options,
                        Set<String> accepted, String feedback) { }
    private record Definition(String id, String title, String description, List<String> columns,
                              List<Map<String, Object>> rows, List<Task> tasks) { }

    private Map<String, Definition> definitions() {
        Map<String, Definition> all = new LinkedHashMap<>();
        all.put("sales-revenue", new Definition("sales-revenue", "Sales & Revenue Analysis",
                "Review five months of sales performance. Find trends, calculate unit economics, and investigate a revenue dip.",
                List.of("Month", "Revenue ($)", "Orders", "Marketing Spend ($)"),
                rows(new String[]{"Jan", "Feb", "Mar", "Apr", "May"}, new int[]{12000, 15000, 14500, 19000, 22800}, new int[]{200, 250, 290, 320, 380}, new int[]{2200, 2400, 3100, 3000, 3300}),
                List.of(task("trend", "Revenue trend", "Overall, did revenue rise or fall from January to May?", "TEXT", List.of(), "increase", "Compare the first and last months."),
                        task("growth", "Largest increase", "Between which consecutive months was the largest absolute revenue increase? Enter both month names.", "TEXT", List.of(), "March-April", "Compare the month-to-month revenue differences."),
                        task("order-value", "Average order value", "What was May revenue per order, in dollars?", "NUMBER", List.of(), "60", "Divide May revenue by May orders."),
                        task("dip", "Anomaly check", "Which month breaks the otherwise rising revenue trend?", "TEXT", List.of(), "March", "Look for a month lower than the preceding month."),
                        task("action", "Business action", "What is the most evidence-based next step after the March dip?", "SELECT", List.of("Review March campaign and conversion data", "Increase every month's budget equally", "Assume the dip is a data-entry error"), "Review March campaign and conversion data", "Investigate the month where revenue fell while marketing spend rose."))));
        all.put("customer-behaviour", new Definition("customer-behaviour", "Customer Behaviour Analysis",
                "Compare acquisition channels by conversion, repeat purchasing, and refunds.",
                List.of("Channel", "Visitors", "Purchases", "Repeat Purchases", "Refunds"),
                rows(new String[]{"Email", "Search", "Social", "Referral"}, new int[]{8000, 15000, 12000, 5000}, new int[]{640, 900, 480, 550}, new int[]{320, 270, 120, 330}, new int[]{22, 35, 48, 10}),
                List.of(task("conversion-leader", "Conversion comparison", "Which channel has the highest purchase conversion rate?", "TEXT", List.of(), "Referral", "Compare purchases divided by visitors for each channel."),
                        task("social-rate", "Calculate conversion", "What percentage of Social visitors purchased? Enter a number without the percent sign.", "NUMBER", List.of(), "4", "Divide Social purchases by Social visitors, then multiply by 100."),
                        task("repeat-leader", "Repeat behaviour", "Which channel has the highest repeat-purchase share of its purchases?", "TEXT", List.of(), "Referral", "Compare repeat purchases divided by purchases."),
                        task("refund-outlier", "Anomaly detection", "Which channel has the highest refund share of purchases?", "TEXT", List.of(), "Social", "Compare refunds divided by purchases."),
                        task("action", "Business action", "What should the team investigate first?", "SELECT", List.of("Review Social targeting and customer feedback", "Stop using the highest-converting Referral channel", "Treat all channel performance as identical"), "Review Social targeting and customer feedback", "Social has the highest refund share and lowest conversion."))));
        all.put("product-performance", new Definition("product-performance", "Product Performance Analysis",
                "Compare product revenue, unit economics, returns, and inventory to prioritize action.",
                List.of("Product", "Units Sold", "Revenue ($)", "Returns", "Stock Remaining"),
                rows(new String[]{"Atlas", "Beacon", "Cove", "Dune"}, new int[]{420, 600, 350, 500}, new int[]{33600, 30000, 28000, 25000}, new int[]{12, 54, 7, 20}, new int[]{80, 30, 140, 55}),
                List.of(task("revenue-leader", "Revenue comparison", "Which product generated the most revenue?", "TEXT", List.of(), "Atlas", "Compare total revenue, not units sold."),
                        task("unit-value", "Unit economics", "What was Beacon's revenue per unit sold, in dollars?", "NUMBER", List.of(), "50", "Divide Beacon revenue by Beacon units sold."),
                        task("return-rate", "Return-rate anomaly", "What percentage of Beacon units were returned? Enter a number without the percent sign.", "NUMBER", List.of(), "9", "Divide Beacon returns by units sold, then multiply by 100."),
                        task("inventory", "Inventory signal", "Which product combines the highest sales volume with the lowest remaining stock?", "TEXT", List.of(), "Beacon", "Compare units sold and stock remaining together."),
                        task("action", "Business priority", "What is the strongest next action for Beacon?", "SELECT", List.of("Prioritize replenishment and investigate elevated returns", "Increase its price because it leads revenue", "Reduce stock further before checking demand"), "Prioritize replenishment and investigate elevated returns", "Beacon has high volume, low stock, and a notably high return rate."))));
        return all;
    }

    private Task task(String id, String title, String prompt, String type, List<String> options,
                      String answer, String feedback) {
        return new Task(id, title, prompt, type, options, Set.of(answer), feedback);
    }

    private List<Map<String, Object>> rows(String[] labels, int[] a, int[] b, int[] c) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < labels.length; i++) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("label", labels[i]); row.put("metricA", a[i]); row.put("metricB", b[i]); row.put("metricC", c[i]);
            result.add(row);
        }
        return result;
    }

    private List<Map<String, Object>> rows(String[] labels, int[] a, int[] b, int[] c, int[] d) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < labels.length; i++) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("label", labels[i]); row.put("metricA", a[i]); row.put("metricB", b[i]);
            row.put("metricC", c[i]); row.put("metricD", d[i]); result.add(row);
        }
        return result;
    }
}
