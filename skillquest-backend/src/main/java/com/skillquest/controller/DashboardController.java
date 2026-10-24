package com.skillquest.controller;

import com.skillquest.dto.CandidateDashboardResponse;
import com.skillquest.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/candidate")
    public ResponseEntity<CandidateDashboardResponse> getCandidateDashboard(Principal principal) {
        String email = principal.getName();
        return ResponseEntity.ok(dashboardService.getCandidateDashboard(email));
    }
}
