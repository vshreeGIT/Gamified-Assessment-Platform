package com.skillquest.controller;

import com.skillquest.dto.JobMatchDto;
import com.skillquest.dto.ProfileStrengthDto;
import com.skillquest.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<List<JobMatchDto>> getJobs(Principal principal) {
        return ResponseEntity.ok(jobService.getJobMatches(principal.getName()));
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<?> getJob(@PathVariable String jobId, Principal principal) {
        try {
            return ResponseEntity.ok(jobService.getJobById(principal.getName(), jobId));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/profile-strength")
    public ResponseEntity<ProfileStrengthDto> profileStrength(Principal principal) {
        return ResponseEntity.ok(jobService.getProfileStrength(principal.getName()));
    }

    @GetMapping("/saved")
    public ResponseEntity<Set<String>> getSavedIds(Principal principal) {
        return ResponseEntity.ok(jobService.getSavedJobIds(principal.getName()));
    }

    @PostMapping("/{jobId}/save")
    public ResponseEntity<Map<String, String>> saveJob(@PathVariable String jobId, Principal principal) {
        try {
            jobService.saveJob(principal.getName(), jobId);
            return ResponseEntity.ok(Map.of("status", "saved"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{jobId}/save")
    public ResponseEntity<Map<String, String>> unsaveJob(@PathVariable String jobId, Principal principal) {
        jobService.unsaveJob(principal.getName(), jobId);
        return ResponseEntity.ok(Map.of("status", "unsaved"));
    }
}
