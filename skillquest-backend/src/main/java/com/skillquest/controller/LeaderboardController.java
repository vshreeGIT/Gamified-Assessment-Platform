package com.skillquest.controller;

import com.skillquest.dto.LeaderboardItemDto;
import com.skillquest.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class LeaderboardController {

    private final DashboardService dashboardService;

    public LeaderboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<List<LeaderboardItemDto>> getLeaderboard(Principal principal) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(dashboardService.getLeaderboard(email));
    }
}
