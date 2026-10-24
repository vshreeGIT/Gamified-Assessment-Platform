package com.skillquest.controller;

import com.skillquest.dto.ReasoningQuizResponse;
import com.skillquest.dto.ReasoningResultResponse;
import com.skillquest.dto.ReasoningSubmitRequest;
import com.skillquest.service.ReasoningService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/reasoning")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ReasoningController {

    private final ReasoningService reasoningService;

    public ReasoningController(ReasoningService reasoningService) {
        this.reasoningService = reasoningService;
    }

    @GetMapping("/quiz")
    public ResponseEntity<ReasoningQuizResponse> getQuiz(
            @RequestParam(defaultValue = "BEGINNER") String difficulty,
            @RequestParam(required = false) String submissionKey,
            Principal principal) {
        return ResponseEntity.ok(reasoningService.getQuiz(difficulty, principal.getName(), submissionKey));
    }

    @PostMapping("/start")
    public ResponseEntity<ReasoningQuizResponse> startQuiz(
            @RequestParam(defaultValue = "BEGINNER") String difficulty,
            Principal principal) {
        return ResponseEntity.ok(reasoningService.startQuiz(difficulty, principal.getName()));
    }

    @PostMapping("/submit")
    public ResponseEntity<ReasoningResultResponse> submitQuiz(
            @RequestBody ReasoningSubmitRequest request,
            Principal principal) {
        String email = principal.getName();
        return ResponseEntity.ok(reasoningService.submitQuiz(email, request));
    }
}
