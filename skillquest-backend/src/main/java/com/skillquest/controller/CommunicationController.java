package com.skillquest.controller;

import com.skillquest.dto.CommunicationQuizResponse;
import com.skillquest.dto.CommunicationResultResponse;
import com.skillquest.dto.CommunicationSubmitRequest;
import com.skillquest.dto.CommunicationHubProgressDto;
import com.skillquest.dto.CommunicationHubResultDto;
import com.skillquest.dto.CommunicationHubResponse;
import com.skillquest.dto.CommunicationHubSubmitRequest;
import com.skillquest.dto.CommunicationRoleplayTurnDto;
import com.skillquest.dto.CommunicationRoleplayTurnRequest;
import com.skillquest.dto.CommunicationActivityDto;
import com.skillquest.service.CommunicationService;
import com.skillquest.service.CommunicationHubService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/communication")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class CommunicationController {

    private final CommunicationService communicationService;
    private final CommunicationHubService communicationHubService;

    public CommunicationController(CommunicationService communicationService,
                                   CommunicationHubService communicationHubService) {
        this.communicationService = communicationService;
        this.communicationHubService = communicationHubService;
    }

    @PostMapping("/start")
    public ResponseEntity<CommunicationQuizResponse> start(Principal principal) {
        return ResponseEntity.ok(communicationService.startAssessment(principal.getName()));
    }

    @GetMapping("/quiz")
    public ResponseEntity<CommunicationQuizResponse> getQuiz(
            @RequestParam(required = false) String submissionKey,
            Principal principal) {
        return ResponseEntity.ok(communicationService.getAssessment(principal.getName(), submissionKey));
    }

    @PostMapping("/submit")
    public ResponseEntity<CommunicationResultResponse> submit(
            @RequestBody CommunicationSubmitRequest request,
            Principal principal) {
        return ResponseEntity.ok(communicationService.submitAssessment(principal.getName(), request));
    }

    @GetMapping("/hub/progress")
    public ResponseEntity<CommunicationHubProgressDto> hubProgress(Principal principal) {
        return ResponseEntity.ok(communicationHubService.getProgress(principal.getName()));
    }

    @GetMapping("/hub/{subdivisionId}/activities")
    public ResponseEntity<List<CommunicationActivityDto>> subdivisionActivities(@PathVariable String subdivisionId) {
        return ResponseEntity.ok(communicationHubService.getActivities(subdivisionId));
    }

    @PostMapping("/hub/{subdivisionId}/start")
    public ResponseEntity<CommunicationHubResponse> startSubdivision(
            @PathVariable String subdivisionId, Principal principal) {
        return ResponseEntity.ok(communicationHubService.start(principal.getName(), subdivisionId));
    }

    @GetMapping("/hub/{subdivisionId}/session")
    public ResponseEntity<CommunicationHubResponse> getSubdivisionSession(
            @PathVariable String subdivisionId,
            @RequestParam(required = false) String submissionKey,
            Principal principal) {
        return ResponseEntity.ok(communicationHubService.getSession(principal.getName(), subdivisionId, submissionKey));
    }

    @PostMapping("/hub/{subdivisionId}/roleplay-turn")
    public ResponseEntity<CommunicationRoleplayTurnDto> roleplayTurn(
            @PathVariable String subdivisionId,
            @RequestBody CommunicationRoleplayTurnRequest request,
            Principal principal) {
        return ResponseEntity.ok(communicationHubService.submitRoleplayTurn(principal.getName(), subdivisionId, request));
    }

    @PostMapping("/hub/{subdivisionId}/submit")
    public ResponseEntity<CommunicationHubResultDto> submitSubdivision(
            @PathVariable String subdivisionId,
            @RequestBody CommunicationHubSubmitRequest request,
            Principal principal) {
        return ResponseEntity.ok(communicationHubService.submit(principal.getName(), subdivisionId, request));
    }

    @GetMapping("/hub/{subdivisionId}/attempt/{attemptId}")
    public ResponseEntity<CommunicationHubResultDto> getSubdivisionAttempt(
            @PathVariable String subdivisionId,
            @PathVariable String attemptId,
            Principal principal) {
        return ResponseEntity.ok(communicationHubService.getAttempt(principal.getName(), subdivisionId, attemptId));
    }
}
