package com.skillquest.controller;

import com.skillquest.dto.CandidateAssessmentSubmissionRequest;
import com.skillquest.entity.RecruiterAssessmentSubmission;
import com.skillquest.service.CandidateAssessmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/candidate/assessments")
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateAssessmentController {
    private final CandidateAssessmentService candidateAssessmentService;

    public CandidateAssessmentController(CandidateAssessmentService candidateAssessmentService) {
        this.candidateAssessmentService = candidateAssessmentService;
    }

    @GetMapping("/{assessmentId}")
    public ResponseEntity<?> getAssessment(Principal principal, @PathVariable String assessmentId) {
        return ResponseEntity.ok(candidateAssessmentService.getAssessment(principal.getName(), assessmentId));
    }

    @PostMapping("/{assessmentId}/submit")
    public ResponseEntity<Map<String, Object>> submitAssessment(Principal principal,
                                                               @PathVariable String assessmentId,
                                                               @Valid @RequestBody CandidateAssessmentSubmissionRequest request) {
        RecruiterAssessmentSubmission submission = candidateAssessmentService
                .submitAssessment(principal.getName(), assessmentId, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "submissionId", submission.getId(),
                "score", submission.getScore(),
                "passedTests", submission.getPassedTests(),
                "totalTests", submission.getTotalTests(),
                "status", submission.getStatus()));
    }
}
