package com.skillquest.controller;

import com.skillquest.dto.*;
import com.skillquest.service.CodingAssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/coding")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class CodingController {
    private final CodingAssessmentService service;
    public CodingController(CodingAssessmentService service) { this.service = service; }
    @PostMapping("/{language}/{concept}/{difficulty}/start")
    public ResponseEntity<CodingSessionDto> start(@PathVariable String language, @PathVariable String concept, @PathVariable String difficulty, Principal principal) {
        return ResponseEntity.ok(service.start(principal.getName(), language, concept, difficulty));
    }
    @PostMapping("/{language}/{concept}/{difficulty}/submit")
    public ResponseEntity<CodingSubmitResponse> submit(@PathVariable String language, @PathVariable String concept, @PathVariable String difficulty, @RequestBody CodingSubmitRequest request, Principal principal) {
        return ResponseEntity.ok(service.submit(principal.getName(), language, concept, difficulty, request));
    }
}
