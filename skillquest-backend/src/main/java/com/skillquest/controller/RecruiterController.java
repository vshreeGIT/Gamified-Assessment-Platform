package com.skillquest.controller;

import com.skillquest.dto.RecruiterAssessmentRequest;
import com.skillquest.dto.RecruiterAssignmentRequest;
import com.skillquest.dto.RecruiterDecisionRequest;
import com.skillquest.dto.RecruiterSettingsRequest;
import com.skillquest.service.RecruiterService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/recruiter")
public class RecruiterController {
    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard(Principal principal) {
        return ResponseEntity.ok(recruiterService.dashboard(principal.getName()));
    }

    @GetMapping("/assessments")
    public ResponseEntity<Map<String, Object>> assessments(
            Principal principal,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String technology) {
        return ResponseEntity.ok(recruiterService.listAssessments(principal.getName(), search, status, type, technology));
    }

    @PostMapping("/assessments")
    public ResponseEntity<?> createAssessment(Principal principal,
                                               @Valid @RequestBody RecruiterAssessmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recruiterService.createAssessment(principal.getName(), request));
    }

    @GetMapping("/assessments/{id}")
    public ResponseEntity<?> assessment(Principal principal, @PathVariable String id) {
        return ResponseEntity.ok(recruiterService.getAssessment(principal.getName(), id));
    }

    @PutMapping("/assessments/{id}")
    public ResponseEntity<?> updateAssessment(Principal principal, @PathVariable String id,
                                               @Valid @RequestBody RecruiterAssessmentRequest request) {
        return ResponseEntity.ok(recruiterService.updateAssessment(principal.getName(), id, request));
    }

    @DeleteMapping("/assessments/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteAssessment(Principal principal, @PathVariable String id) {
        recruiterService.deleteAssessment(principal.getName(), id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/assessments/{id}/{action:publish|close|duplicate}")
    public ResponseEntity<?> assessmentAction(Principal principal, @PathVariable String id,
                                               @PathVariable String action) {
        return ResponseEntity.ok(recruiterService.assessmentAction(principal.getName(), id, action));
    }

    /** Assignment endpoint used to populate the recruiter-owned candidate pipeline. */
    @PostMapping("/assessments/{id}/assignments")
    public ResponseEntity<?> assignCandidate(Principal principal, @PathVariable String id,
                                              @Valid @RequestBody RecruiterAssignmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(recruiterService.assignCandidate(principal.getName(), id, request));
    }

    @GetMapping("/candidates")
    public ResponseEntity<Map<String, Object>> candidates(
            Principal principal,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String technology) {
        return ResponseEntity.ok(recruiterService.listCandidates(principal.getName(), search, status, technology));
    }

    /** Lists active CANDIDATE users not yet assigned to the given assessment. */
    @GetMapping("/candidates/eligible")
    public ResponseEntity<Map<String, Object>> eligibleCandidates(
            Principal principal,
            @RequestParam String assessmentId,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(recruiterService.listEligibleCandidates(principal.getName(), assessmentId, search));
    }

    @GetMapping("/candidates/{id}")
    public ResponseEntity<?> candidate(Principal principal, @PathVariable String id) {
        return ResponseEntity.ok(recruiterService.getCandidate(principal.getName(), id));
    }

    @PatchMapping("/candidates/{id}/decision")
    public ResponseEntity<?> decision(Principal principal, @PathVariable String id,
                                      @Valid @RequestBody RecruiterDecisionRequest request) {
        return ResponseEntity.ok(recruiterService.updateDecision(principal.getName(), id, request));
    }

    @GetMapping("/results")
    public ResponseEntity<Map<String, Object>> results(
            Principal principal,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String technology,
            @RequestParam(required = false) String assessment) {
        return ResponseEntity.ok(recruiterService.results(principal.getName(), search, status, technology, assessment));
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> analytics(Principal principal) {
        return ResponseEntity.ok(recruiterService.analytics(principal.getName()));
    }

    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> settings(Principal principal) {
        return ResponseEntity.ok(recruiterService.settings(principal.getName()));
    }

    @PutMapping("/settings")
    public ResponseEntity<Map<String, Object>> updateSettings(Principal principal,
                                                               @Valid @RequestBody RecruiterSettingsRequest request) {
        return ResponseEntity.ok(recruiterService.updateSettings(principal.getName(), request));
    }
}
