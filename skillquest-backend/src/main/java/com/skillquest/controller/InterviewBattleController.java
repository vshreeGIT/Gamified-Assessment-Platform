package com.skillquest.controller;

import com.skillquest.dto.InterviewAssessmentResponse;
import com.skillquest.dto.InterviewDraftRequest;
import com.skillquest.dto.InterviewResultResponse;
import com.skillquest.dto.InterviewSubmitRequest;
import com.skillquest.service.InterviewBattleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class InterviewBattleController {
    private final InterviewBattleService service;
    public InterviewBattleController(InterviewBattleService service) { this.service = service; }

    @PostMapping("/start")
    public ResponseEntity<InterviewAssessmentResponse> start(Principal principal) {
        return ResponseEntity.ok(service.start(principal.getName()));
    }

    @GetMapping("/session")
    public ResponseEntity<InterviewAssessmentResponse> activeSession(Principal principal) {
        return service.getActiveSession(principal.getName()).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PutMapping("/session/answers")
    public ResponseEntity<InterviewAssessmentResponse> saveDraft(@RequestBody InterviewDraftRequest request, Principal principal) {
        return ResponseEntity.ok(service.saveDraft(principal.getName(), request));
    }

    @PostMapping("/submit")
    public ResponseEntity<InterviewResultResponse> submit(@RequestBody InterviewSubmitRequest request, Principal principal) {
        return ResponseEntity.ok(service.submit(principal.getName(), request));
    }

    @GetMapping("/attempt/{attemptId}")
    public ResponseEntity<InterviewResultResponse> attempt(@PathVariable String attemptId, Principal principal) {
        return ResponseEntity.ok(service.getAttempt(principal.getName(), attemptId));
    }
}
