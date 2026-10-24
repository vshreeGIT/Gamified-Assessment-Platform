package com.skillquest.service.impl;

import com.skillquest.dto.*;
import com.skillquest.entity.*;
import com.skillquest.repository.*;
import com.skillquest.service.CodingAssessmentService;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
public class CodingAssessmentServiceImpl implements CodingAssessmentService {
    private static final Duration LIMIT = Duration.ofMinutes(20);
    private static final Map<String, Set<String>> CONCEPTS = Map.of(
            "java", Set.of("variables", "data-types", "operators", "conditional-statements", "loops", "arrays", "strings", "methods", "oop", "inheritance", "polymorphism", "abstraction", "collections", "exception-handling", "file-handling"),
            "python", Set.of("variables", "loops", "functions", "lists", "tuples", "dictionary", "sets", "strings", "oop", "modules"),
            "c", Set.of("variables", "pointers", "arrays", "functions", "structures", "file-handling"),
            "cpp", Set.of("stl", "vectors", "pointers", "oop", "templates", "inheritance"),
            "javascript", Set.of("variables", "dom", "functions", "arrays", "objects", "promises", "async-await", "es6"),
            "sql", Set.of("select", "where", "group-by", "join", "sub-queries", "views", "stored-procedures"));
    private final CodingAssessmentSessionRepository sessions;
    private final CodingAttemptRepository attempts;
    public CodingAssessmentServiceImpl(CodingAssessmentSessionRepository sessions, CodingAttemptRepository attempts) { this.sessions = sessions; this.attempts = attempts; }

    @Override public synchronized CodingSessionDto start(String email, String language, String concept, String difficulty) {
        validateRoute(language, concept, difficulty);
        String id = sessionId(email, language, concept, difficulty);
        Optional<CodingAssessmentSession> previous = sessions.findById(id);
        if (previous.isPresent() && "ACTIVE".equals(previous.get().getStatus()) && Instant.now().isBefore(previous.get().getDeadlineAt())) {
            CodingAssessmentSession s = previous.get();
            if (s.getLanguage().equals(language) && s.getConcept().equals(concept) && s.getDifficulty().equals(difficulty)) return dto(s);
        }
        Instant now = Instant.now();
        CodingAssessmentSession session = CodingAssessmentSession.builder().id(id).userEmail(email).sessionKey(UUID.randomUUID().toString())
                .language(language).concept(concept).difficulty(difficulty).startedAt(now).deadlineAt(now.plus(LIMIT)).status("ACTIVE").build();
        return dto(sessions.save(session));
    }

    @Override public synchronized CodingSubmitResponse submit(String email, String language, String concept, String difficulty, CodingSubmitRequest request) {
        validateRoute(language, concept, difficulty);
        if (request == null || request.getSessionKey() == null || request.getSessionKey().isBlank()) throw new IllegalArgumentException("Coding assessment session is required.");
        if (request.getQuestionNumber() < 1 || request.getQuestionNumber() > 10) throw new IllegalArgumentException("Question number is invalid.");
        String code = request.getCode();
        if (code == null || code.isBlank() || code.length() > 50000) throw new IllegalArgumentException("Submit a non-empty code response under 50,000 characters.");
        Optional<CodingAttempt> previous = attempts.findByUserEmailAndSessionKey(email, request.getSessionKey());
        if (previous.isPresent()) return response(previous.get(), "This Coding Arena submission was already recorded.");
        CodingAssessmentSession session = sessions.findById(sessionId(email, language, concept, difficulty))
                .filter(s -> request.getSessionKey().equals(s.getSessionKey()) && "ACTIVE".equals(s.getStatus()))
                .orElseThrow(() -> new IllegalArgumentException("Coding assessment session is invalid. Start the assessment again."));
        if (!session.getLanguage().equals(language) || !session.getConcept().equals(concept) || !session.getDifficulty().equals(difficulty)) throw new IllegalArgumentException("Coding assessment route does not match its session.");
        if (session.getDeadlineAt() == null || !Instant.now().isBefore(session.getDeadlineAt())) { session.setStatus("EXPIRED"); sessions.save(session); throw new IllegalArgumentException("Coding assessment deadline has passed."); }
        CodingAttempt attempt = CodingAttempt.builder().id(request.getSessionKey()).userEmail(email).sessionKey(request.getSessionKey())
                .language(language).concept(concept).difficulty(difficulty).questionNumber(request.getQuestionNumber()).submittedCode(code).completedAt(Instant.now()).build();
        try { attempts.insert(attempt); }
        catch (DuplicateKeyException duplicate) { return attempts.findByUserEmailAndSessionKey(email, request.getSessionKey()).map(a -> response(a, "This Coding Arena submission was already recorded.")).orElseThrow(() -> duplicate); }
        session.setStatus("COMPLETED"); sessions.save(session);
        return response(attempt, "Coding response saved. Code execution and correctness are not evaluated by the current server.");
    }

    private void validateRoute(String language, String concept, String difficulty) {
        if (!CONCEPTS.containsKey(language) || !CONCEPTS.get(language).contains(concept) || !Set.of("easy", "medium", "hard").contains(difficulty)) throw new IllegalArgumentException("Coding assessment selection is invalid.");
    }
    private String sessionId(String email, String language, String concept, String difficulty) { return UUID.nameUUIDFromBytes((email + "|CODING_ARENA|" + language + "|" + concept + "|" + difficulty).getBytes(java.nio.charset.StandardCharsets.UTF_8)).toString(); }
    private CodingSessionDto dto(CodingAssessmentSession s) { return CodingSessionDto.builder().sessionKey(s.getSessionKey()).startedAt(s.getStartedAt()).deadlineAt(s.getDeadlineAt()).build(); }
    private CodingSubmitResponse response(CodingAttempt a, String message) { return CodingSubmitResponse.builder().attemptId(a.getId()).completedAt(a.getCompletedAt()).message(message).build(); }
}
