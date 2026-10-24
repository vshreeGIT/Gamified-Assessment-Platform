package com.skillquest.controller;

import com.skillquest.dto.QuestProgressItemDto;
import com.skillquest.dto.QuestProgressResponse;
import com.skillquest.dto.TeamworkQuizResponse;
import com.skillquest.dto.TeamworkResultDto;
import com.skillquest.dto.TeamworkSubmitRequest;
import com.skillquest.service.QuestProgressService;
import com.skillquest.service.TeamworkService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class QuestProgressController {
    private final QuestProgressService progressService;
    private final TeamworkService teamworkService;

    public QuestProgressController(QuestProgressService progressService, TeamworkService teamworkService) {
        this.progressService = progressService;
        this.teamworkService = teamworkService;
    }

    @GetMapping("/progress")
    public ResponseEntity<QuestProgressResponse> progress(Principal principal) {
        return ResponseEntity.ok(progressService.getProgress(principal.getName()));
    }

    @PostMapping("/teamwork/start")
    public ResponseEntity<TeamworkQuizResponse> startTeamwork(Principal principal) {
        return ResponseEntity.ok(teamworkService.start(principal.getName()));
    }

    @GetMapping("/teamwork/session")
    public ResponseEntity<TeamworkQuizResponse> teamworkSession(@RequestParam String submissionKey, Principal principal) {
        return ResponseEntity.ok(teamworkService.resume(principal.getName(), submissionKey));
    }

    @PostMapping("/teamwork/submit")
    public ResponseEntity<TeamworkResultDto> submitTeamwork(@RequestBody TeamworkSubmitRequest request, Principal principal) {
        return ResponseEntity.ok(teamworkService.submit(principal.getName(), request));
    }

    @GetMapping("/teamwork/attempt/{attemptId}")
    public ResponseEntity<TeamworkResultDto> teamworkAttempt(@PathVariable String attemptId, Principal principal) {
        return ResponseEntity.ok(teamworkService.getAttempt(principal.getName(), attemptId));
    }

    @GetMapping("/interview/access")
    public ResponseEntity<QuestProgressItemDto> interviewAccess(Principal principal) {
        QuestProgressItemDto status = progressService.getProgress(principal.getName()).getQuests().get("interview");
        return "LOCKED".equals(status.getStatus())
                ? ResponseEntity.status(HttpStatus.FORBIDDEN).body(status)
                : ResponseEntity.ok(status);
    }
}
