package com.skillquest.controller;

import com.skillquest.dto.DataDetectiveProgressDto;
import com.skillquest.dto.DataDetectiveResultDto;
import com.skillquest.dto.DataDetectiveSubmitRequest;
import com.skillquest.dto.DataInvestigationDto;
import com.skillquest.service.DataDetectiveService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/data-detective")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ChallengeController {
    private final DataDetectiveService service;

    public ChallengeController(DataDetectiveService service) { this.service = service; }

    @GetMapping("/investigations")
    public ResponseEntity<List<DataInvestigationDto>> list(Principal principal) {
        return ResponseEntity.ok(service.listInvestigations(principal.getName()));
    }

    @GetMapping("/progress")
    public ResponseEntity<DataDetectiveProgressDto> progress(Principal principal) {
        return ResponseEntity.ok(service.getProgress(principal.getName()));
    }

    @GetMapping("/{investigationId}")
    public ResponseEntity<DataInvestigationDto> get(@PathVariable String investigationId, Principal principal) {
        return ResponseEntity.ok(service.getInvestigation(investigationId, principal.getName()));
    }

    @PostMapping("/{investigationId}/start")
    public ResponseEntity<DataInvestigationDto> start(@PathVariable String investigationId, Principal principal) {
        return ResponseEntity.ok(service.start(investigationId, principal.getName()));
    }

    @GetMapping("/{investigationId}/session")
    public ResponseEntity<DataInvestigationDto> session(@PathVariable String investigationId,
            @RequestParam String submissionKey, Principal principal) {
        return ResponseEntity.ok(service.getSession(investigationId, principal.getName(), submissionKey));
    }

    @PostMapping("/{investigationId}/submit")
    public ResponseEntity<DataDetectiveResultDto> submit(@PathVariable String investigationId,
            @RequestBody DataDetectiveSubmitRequest request, Principal principal) {
        return ResponseEntity.ok(service.submit(investigationId, principal.getName(), request));
    }

    @GetMapping("/attempt/{attemptId}")
    public ResponseEntity<DataDetectiveResultDto> attempt(@PathVariable String attemptId, Principal principal) {
        return ResponseEntity.ok(service.getAttempt(attemptId, principal.getName()));
    }
}
