package com.skillquest.service.impl;

import com.skillquest.dto.*;
import com.skillquest.entity.TeamworkAssessmentSession;
import com.skillquest.entity.TeamworkAttempt;
import com.skillquest.exception.UserNotFoundException;
import com.skillquest.repository.TeamworkAssessmentSessionRepository;
import com.skillquest.repository.TeamworkAttemptRepository;
import com.skillquest.service.TeamworkService;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TeamworkServiceImpl implements TeamworkService {
    public static final int PASS_THRESHOLD = 70;
    private final TeamworkAssessmentSessionRepository sessionRepository;
    private final TeamworkAttemptRepository attemptRepository;

    public TeamworkServiceImpl(TeamworkAssessmentSessionRepository sessionRepository,
            TeamworkAttemptRepository attemptRepository) {
        this.sessionRepository = sessionRepository;
        this.attemptRepository = attemptRepository;
    }

    @Override
    public synchronized TeamworkQuizResponse start(String email) {
        String id = sessionId(email);
        Optional<TeamworkAssessmentSession> stored = sessionRepository.findById(id);
        if (stored.isPresent() && "ACTIVE".equals(stored.get().getStatus())
                && attemptRepository.findByUserEmailAndSubmissionKey(email, stored.get().getSubmissionKey()).isEmpty()) {
            return quiz(stored.get());
        }
        TeamworkAssessmentSession session = TeamworkAssessmentSession.builder().id(id).userEmail(email)
                .submissionKey(UUID.randomUUID().toString()).status("ACTIVE").startedAt(Instant.now()).build();
        return quiz(sessionRepository.save(session));
    }

    @Override
    public TeamworkQuizResponse resume(String email, String key) {
        TeamworkAssessmentSession session = sessionRepository.findById(sessionId(email))
                .filter(candidate -> key != null && key.equals(candidate.getSubmissionKey()) && "ACTIVE".equals(candidate.getStatus()))
                .orElseThrow(() -> new IllegalArgumentException("Teamwork session is invalid. Start or resume the quest."));
        return quiz(session);
    }

    @Override
    public synchronized TeamworkResultDto submit(String email, TeamworkSubmitRequest request) {
        if (request == null || request.getSubmissionKey() == null || request.getSubmissionKey().isBlank()) {
            throw new IllegalArgumentException("Teamwork session key is required.");
        }
        String key = request.getSubmissionKey();
        Optional<TeamworkAttempt> previous = attemptRepository.findByUserEmailAndSubmissionKey(email, key);
        if (previous.isPresent()) return result(previous.get(), "This Teamwork attempt was already recorded.");
        TeamworkAssessmentSession session = sessionRepository.findById(sessionId(email))
                .filter(candidate -> key.equals(candidate.getSubmissionKey()) && "ACTIVE".equals(candidate.getStatus()))
                .orElseThrow(() -> new IllegalArgumentException("Teamwork session is invalid. Start the quest again."));
        Map<String, String> answers = request.getAnswers() == null ? Collections.emptyMap() : request.getAnswers();
        Set<String> validIds = questions().stream().map(Question::id).collect(java.util.stream.Collectors.toSet());
        if (answers.keySet().stream().anyMatch(id -> !validIds.contains(id))) {
            throw new IllegalArgumentException("Submission contains an unknown Teamwork question.");
        }
        Map<String, Question> byId = new HashMap<>();
        questions().forEach(question -> byId.put(question.id(), question));
        if (answers.entrySet().stream().anyMatch(entry -> !byId.get(entry.getKey()).choices().containsKey(entry.getValue()))) {
            throw new IllegalArgumentException("Submission contains an invalid choice for a Teamwork question.");
        }
        if (answers.values().stream().anyMatch(value -> value != null && value.length() > 20)) {
            throw new IllegalArgumentException("A selected response is invalid.");
        }
        int score = (int) questions().stream().filter(question -> question.answer().equals(answers.get(question.id()))).count();
        int total = questions().size();
        int accuracy = Math.round(score * 100f / total);
        TeamworkAttempt attempt = TeamworkAttempt.builder().id(key).userEmail(email).submissionKey(key)
                .score(score).totalQuestions(total).accuracy(accuracy).passed(accuracy >= PASS_THRESHOLD)
                .answers(new HashMap<>(answers)).completedAt(LocalDateTime.now()).build();
        try {
            attemptRepository.insert(attempt);
        } catch (DuplicateKeyException duplicate) {
            return attemptRepository.findByUserEmailAndSubmissionKey(email, key)
                    .map(saved -> result(saved, "This Teamwork attempt was already recorded.")).orElseThrow(() -> duplicate);
        }
        session.setStatus("COMPLETED");
        sessionRepository.save(session);
        return result(attempt, attempt.isPassed() ? "Teamwork Mission passed." : "Attempt saved. Review the scenarios and try again.");
    }

    public TeamworkResultDto getAttempt(String email, String attemptId) {
        return attemptRepository.findByUserEmailAndSubmissionKey(email, attemptId)
                .map(attempt -> result(attempt, attempt.isPassed() ? "Teamwork Mission passed." : "Review the scenarios and try again."))
                .orElseThrow(() -> new IllegalArgumentException("Saved Teamwork result was not found."));
    }

    private TeamworkQuizResponse quiz(TeamworkAssessmentSession session) {
        List<TeamworkQuestionDto> items = questions().stream().map(question -> TeamworkQuestionDto.builder()
                .id(question.id()).title(question.title()).scenario(question.scenario()).prompt(question.prompt())
                .choices(question.choices().entrySet().stream().map(entry -> TeamworkChoiceDto.builder()
                        .id(entry.getKey()).text(entry.getValue()).build()).toList()).build()).toList();
        return TeamworkQuizResponse.builder().submissionKey(session.getSubmissionKey()).startedAt(session.getStartedAt())
                .questions(items).build();
    }

    private TeamworkResultDto result(TeamworkAttempt attempt, String message) {
        return TeamworkResultDto.builder().attemptId(attempt.getId()).score(attempt.getScore())
                .totalQuestions(attempt.getTotalQuestions()).accuracy(attempt.getAccuracy())
                .passed(attempt.isPassed()).message(message).build();
    }

    private String sessionId(String email) {
        return UUID.nameUUIDFromBytes((email + "|TEAMWORK").getBytes(StandardCharsets.UTF_8)).toString();
    }

    private record Question(String id, String title, String scenario, String prompt,
                            Map<String, String> choices, String answer) { }

    private List<Question> questions() {
        return List.of(
                q("T1", "Share ownership", "Two teammates assume the other person owns the final report, and the deadline is tomorrow.", "What should you do first?", "A", "Wait to see who submits it.", "B", "Assign blame in the team chat.", "C", "Bring both teammates together, clarify responsibilities, and agree on an owner and checkpoint.", "C"),
                q("T2", "Address disagreement", "A colleague challenges your approach in a planning meeting.", "How do you keep the discussion productive?", "A", "Defend your idea until the meeting ends.", "B", "Ask about their concerns, compare evidence, and agree on the decision criteria.", "C", "Escalate the disagreement immediately.", "B"),
                q("T3", "Raise a delivery risk", "A teammate tells you privately that their part may be late, which could affect the release.", "What is the best next step?", "A", "Promise the release date without checking.", "B", "Leave the teammate to handle it alone.", "C", "Understand the blocker, agree on a recovery plan, and alert affected teammates early.", "C"),
                q("T4", "Give constructive feedback", "A recurring handoff omission is creating rework for your team.", "How should you address it?", "A", "Describe a specific example and impact, then agree on a clear handoff checklist.", "B", "Complain to other teammates instead.", "C", "Wait until the annual review.", "A"),
                q("T5", "Coordinate priorities", "Two urgent requests compete for your team's limited capacity.", "How should the team decide what to do first?", "A", "Choose the request from the most senior person without discussion.", "B", "Compare impact, deadlines, and dependencies with stakeholders, then communicate the tradeoff.", "C", "Start both and hope the team can finish.", "B"));
    }

    private Question q(String id, String title, String scenario, String prompt,
                       String aId, String aText, String bId, String bText, String cId, String cText, String answer) {
        Map<String, String> options = new LinkedHashMap<>();
        options.put(aId, aText); options.put(bId, bText); options.put(cId, cText);
        return new Question(id, title, scenario, prompt, options, answer);
    }
}
