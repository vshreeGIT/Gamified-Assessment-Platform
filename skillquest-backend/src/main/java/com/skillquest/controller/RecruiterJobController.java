package com.skillquest.controller;

import com.skillquest.dto.JobApplicationStatusRequest;
import com.skillquest.dto.JobRequest;
import com.skillquest.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/recruiter/jobs")
public class RecruiterJobController {
    private final JobService jobService;

    public RecruiterJobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<?> jobs(Principal principal) {
        return ResponseEntity.ok(jobService.getRecruiterJobs(principal.getName()));
    }

    @PostMapping
    public ResponseEntity<?> create(Principal principal, @Valid @RequestBody JobRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.createJob(principal.getName(), request));
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<?> get(Principal principal, @PathVariable String jobId) {
        return ResponseEntity.ok(jobService.getRecruiterJob(principal.getName(), jobId));
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<?> update(Principal principal, @PathVariable String jobId,
                                    @Valid @RequestBody JobRequest request) {
        return ResponseEntity.ok(jobService.updateJob(principal.getName(), jobId, request));
    }

    @PostMapping("/{jobId}/{action:publish|close}")
    public ResponseEntity<?> status(Principal principal, @PathVariable String jobId, @PathVariable String action) {
        return ResponseEntity.ok(jobService.setJobStatus(principal.getName(), jobId,
                "publish".equals(action) ? "PUBLISHED" : "CLOSED"));
    }

    @GetMapping("/{jobId}/applications")
    public ResponseEntity<?> applications(Principal principal, @PathVariable String jobId) {
        return ResponseEntity.ok(jobService.getRecruiterApplications(principal.getName(), jobId));
    }

    @PatchMapping("/{jobId}/applications/{applicationId}")
    public ResponseEntity<?> updateApplication(Principal principal, @PathVariable String jobId,
                                               @PathVariable String applicationId,
                                               @Valid @RequestBody JobApplicationStatusRequest request) {
        return ResponseEntity.ok(jobService.updateApplicationStatus(principal.getName(), jobId, applicationId, request));
    }
}