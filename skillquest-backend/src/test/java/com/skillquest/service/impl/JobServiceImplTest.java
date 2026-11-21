package com.skillquest.service.impl;

import com.skillquest.dto.CandidateAssessmentHistoryDto;
import com.skillquest.dto.CandidateChallengeHistoryDto;
import com.skillquest.dto.CandidateSkillProfileDto;
import com.skillquest.dto.CandidateSkillScoreDto;
import com.skillquest.dto.JobApplicationStatusRequest;
import com.skillquest.dto.JobRequest;
import com.skillquest.dto.ProfileStrengthDto;
import com.skillquest.entity.Job;
import com.skillquest.entity.JobApplication;
import com.skillquest.entity.Role;
import com.skillquest.entity.SavedJob;
import com.skillquest.entity.User;
import com.skillquest.exception.UserNotFoundException;
import com.skillquest.repository.JobApplicationRepository;
import com.skillquest.repository.JobRepository;
import com.skillquest.repository.SavedJobRepository;
import com.skillquest.repository.UserRepository;
import com.skillquest.service.CandidateSkillEvidenceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class JobServiceImplTest {
    private static final String CANDIDATE = "candidate@example.com";
    private static final String RECRUITER = "recruiter@example.com";
    private static final String OTHER_RECRUITER = "other@example.com";

    private JobRepository jobs;
    private SavedJobRepository savedJobs;
    private UserRepository users;
    private JobApplicationRepository applications;
    private CandidateSkillEvidenceService skillEvidence;
    private JobServiceImpl service;

    @BeforeEach
    void setUp() {
        jobs = mock(JobRepository.class);
        savedJobs = mock(SavedJobRepository.class);
        users = mock(UserRepository.class);
        applications = mock(JobApplicationRepository.class);
        skillEvidence = mock(CandidateSkillEvidenceService.class);
        when(jobs.count()).thenReturn(1L);
        service = new JobServiceImpl(jobs, savedJobs, users, applications, skillEvidence);
    }

    @Test
    void weightedMatchUsesVerifiedScoresAndSkillImportance() {
        User candidate = candidate();
        candidate.setSkills(List.of("HTML", "CSS", "JavaScript", "React", "Communication"));
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(candidate));
        when(savedJobs.findByUserEmail(CANDIDATE)).thenReturn(List.of());
        when(applications.findAllByCandidateEmailOrderByAppliedAtDesc(CANDIDATE)).thenReturn(List.of());
        when(skillEvidence.getProfile(CANDIDATE, RECRUITER)).thenReturn(profile(Map.of(
                "html", score("HTML", 90),
                "css", score("CSS", 80),
                "javascript", score("JavaScript", 85),
                "react", score("React", 70),
                "communication", score("Communication", 95))));
        Job job = job("job-1", RECRUITER, "PUBLISHED", List.of("HTML", "CSS", "JavaScript", "React", "Communication"),
                Map.of("HTML", 20, "CSS", 15, "JavaScript", 30, "React", 25, "Communication", 10));
        when(jobs.findAll()).thenReturn(List.of(job));

        var result = service.getJobMatches(CANDIDATE).get(0);

        assertEquals(83, result.getMatchScore());
        assertEquals(5, result.getSkillBreakdown().size());
        assertTrue(result.getMatchExplanation().contains("Unrated skills contribute 0"));
    }

    @Test
    void missingEvidenceContributesZeroEvenWhenCandidateDeclaredSkill() {
        User candidate = candidate();
        candidate.setSkills(List.of("React", "JavaScript"));
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(candidate));
        when(savedJobs.findByUserEmail(CANDIDATE)).thenReturn(List.of());
        when(applications.findAllByCandidateEmailOrderByAppliedAtDesc(CANDIDATE)).thenReturn(List.of());
        when(skillEvidence.getProfile(CANDIDATE, RECRUITER)).thenReturn(profile(Map.of("react", score("React", 70))));
        when(jobs.findAll()).thenReturn(List.of(job("job-1", RECRUITER, "PUBLISHED",
                List.of("React", "JavaScript"), Map.of("React", 25, "JavaScript", 75))));

        var result = service.getJobMatches(CANDIDATE).get(0);

        assertEquals(18, result.getMatchScore());
        assertEquals(List.of("JavaScript"), result.getMissingSkills());
        assertEquals(null, result.getSkillBreakdown().get(1).candidateScore());
    }

    @Test
    void candidateSeesOnlyPublishedAndLegacyListings() {
        User candidate = candidate();
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(candidate));
        when(savedJobs.findByUserEmail(CANDIDATE)).thenReturn(List.of());
        when(applications.findAllByCandidateEmailOrderByAppliedAtDesc(CANDIDATE)).thenReturn(List.of());
        when(skillEvidence.getProfile(CANDIDATE, RECRUITER)).thenReturn(profile(Map.of()));
        when(skillEvidence.getProfile(CANDIDATE, null)).thenReturn(profile(Map.of()));
        when(jobs.findAll()).thenReturn(List.of(
                job("published", RECRUITER, "PUBLISHED", List.of("React"), Map.of("React", 1)),
                job("draft", RECRUITER, "DRAFT", List.of("React"), Map.of("React", 1)),
                job("closed", RECRUITER, "CLOSED", List.of("React"), Map.of("React", 1)),
                job("legacy", null, null, List.of("React"), Map.of())));

        var result = service.getJobMatches(CANDIDATE);

        assertEquals(List.of("published", "legacy"), result.stream().map(item -> item.getId()).toList());
    }

    @Test
    void recruiterCreatesDraftOwnedJobWithWeights() {
        User recruiter = new User();
        recruiter.setEmail(RECRUITER);
        recruiter.setRole(Role.RECRUITER);
        when(users.findByEmail(RECRUITER)).thenReturn(Optional.of(recruiter));
        when(jobs.save(any(Job.class))).thenAnswer(invocation -> {
            Job job = invocation.getArgument(0);
            job.setId("created-job");
            return job;
        });
        when(applications.countByJobId("created-job")).thenReturn(0L);

        var result = service.createJob(RECRUITER, request());

        assertEquals("DRAFT", result.status());
        assertEquals("React", result.requiredSkills().get(0));
        assertEquals(70, result.skillWeights().get("React"));
        verify(jobs).save(org.mockito.ArgumentMatchers.argThat(job -> RECRUITER.equals(job.getRecruiterEmail())
                && "DRAFT".equals(job.getStatus())));
    }

    @Test
    void recruiterCannotUpdateOrPublishAnotherRecruitersJob() {
        when(jobs.findById("job-1")).thenReturn(Optional.of(job("job-1", OTHER_RECRUITER, "DRAFT", List.of("React"), Map.of())));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.setJobStatus(RECRUITER, "job-1", "PUBLISHED"));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verify(jobs, never()).save(any(Job.class));
    }

    @Test
    void candidateApplicationIsSavedOnceAndIncludesCandidateEvidence() {
        User candidate = candidate();
        candidate.setSkills(List.of("React"));
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(candidate));
        when(jobs.findById("job-1")).thenReturn(Optional.of(job("job-1", RECRUITER, "PUBLISHED", List.of("React"), Map.of("React", 1))));
        when(applications.findByJobIdAndCandidateEmail("job-1", CANDIDATE)).thenReturn(Optional.empty());
        when(applications.insert(any(JobApplication.class))).thenAnswer(invocation -> {
            JobApplication application = invocation.getArgument(0);
            application.setId("application-1");
            return application;
        });
        when(skillEvidence.getProfile(CANDIDATE, RECRUITER)).thenReturn(profile(Map.of("react", score("React", 80))));

        var result = service.applyToJob(CANDIDATE, "job-1");

        assertEquals("application-1", result.id());
        assertEquals("candidate-id", result.candidateId());
        assertEquals(CANDIDATE, result.candidateEmail());
        assertEquals("APPLIED", result.status());
        assertEquals(80, result.matchScore());
        verify(applications).insert(any(JobApplication.class));
    }

    @Test
    void repeatedApplicationReturnsExistingApplicationWithoutDuplicateWrite() {
        User candidate = candidate();
        Job job = job("job-1", RECRUITER, "PUBLISHED", List.of("React"), Map.of("React", 1));
        JobApplication application = JobApplication.builder().id("application-1").jobId("job-1")
                .recruiterEmail(RECRUITER).candidateEmail(CANDIDATE).status("IN_REVIEW").build();
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(candidate));
        when(jobs.findById("job-1")).thenReturn(Optional.of(job));
        when(applications.findByJobIdAndCandidateEmail("job-1", CANDIDATE)).thenReturn(Optional.of(application));
        when(skillEvidence.getProfile(CANDIDATE, RECRUITER)).thenReturn(profile(Map.of()));

        var result = service.applyToJob(CANDIDATE, "job-1");

        assertEquals("application-1", result.id());
        assertEquals("IN_REVIEW", result.status());
        verify(applications, never()).insert(any(JobApplication.class));
    }

    @Test
    void recruiterStatusUpdateIsScopedToOwnedJobApplication() {
        Job job = job("job-1", RECRUITER, "PUBLISHED", List.of("React"), Map.of("React", 1));
        JobApplication application = JobApplication.builder().id("application-1").jobId("job-1")
                .recruiterEmail(RECRUITER).candidateEmail(CANDIDATE).status("APPLIED").build();
        when(jobs.findById("job-1")).thenReturn(Optional.of(job));
        when(applications.findById("application-1")).thenReturn(Optional.of(application));
        when(applications.save(any(JobApplication.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(candidate()));
        when(skillEvidence.getProfile(CANDIDATE, RECRUITER)).thenReturn(profile(Map.of()));
        JobApplicationStatusRequest request = new JobApplicationStatusRequest();
        request.setStatus("shortlisted");

        var result = service.updateApplicationStatus(RECRUITER, "job-1", "application-1", request);

        assertEquals("SHORTLISTED", result.status());
        verify(applications).save(org.mockito.ArgumentMatchers.argThat(item -> "SHORTLISTED".equals(item.getStatus())));
    }

        @Test
        void candidateApplicationListShowsRecruiterUpdatedStatus() {
        User candidate = candidate();
        Job job = job("job-1", RECRUITER, "PUBLISHED", List.of("React"), Map.of("React", 1));
        JobApplication application = JobApplication.builder().id("application-1").jobId("job-1")
            .recruiterEmail(RECRUITER).candidateId(candidate.getId()).candidateEmail(CANDIDATE)
            .status("SHORTLISTED").appliedAt(LocalDateTime.now()).build();
        when(applications.findAllByCandidateEmailOrderByAppliedAtDesc(CANDIDATE)).thenReturn(List.of(application));
        when(jobs.findById("job-1")).thenReturn(Optional.of(job));
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(candidate));
        when(skillEvidence.getProfile(CANDIDATE, RECRUITER)).thenReturn(profile(Map.of("react", score("React", 80))));

        var result = service.getCandidateApplications(CANDIDATE);

        assertEquals(1, result.size());
        assertEquals("SHORTLISTED", result.get(0).status());
        assertEquals("job-1", result.get(0).jobId());
        }

        @Test
        void recruiterApplicationReviewIncludesCandidateChallengeAndOwnedAssessmentHistory() {
        User candidate = candidate();
        Job job = job("job-1", RECRUITER, "PUBLISHED", List.of("React"), Map.of("React", 1));
        JobApplication application = JobApplication.builder().id("application-1").jobId("job-1")
            .recruiterEmail(RECRUITER).candidateId(candidate.getId()).candidateEmail(CANDIDATE)
            .status("APPLIED").appliedAt(LocalDateTime.now()).build();
        CandidateSkillProfileDto evidence = new CandidateSkillProfileDto(
            Map.of("react", score("React", 88)),
            List.of(new com.skillquest.dto.CandidateChallengeHistoryDto("Logical Sprint", 82, true, Instant.now(), true)),
            List.of(new com.skillquest.dto.CandidateAssessmentHistoryDto("React Review", "React", 88, Instant.now())));
        when(jobs.findById("job-1")).thenReturn(Optional.of(job));
        when(applications.findAllByRecruiterEmailAndJobIdOrderByAppliedAtDesc(RECRUITER, "job-1"))
            .thenReturn(List.of(application));
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(candidate));
        when(skillEvidence.getProfile(CANDIDATE, RECRUITER)).thenReturn(evidence);

        var result = service.getRecruiterApplications(RECRUITER, "job-1").get(0);

        assertEquals("Logical Sprint", result.challengeHistory().get(0).module());
        assertEquals("React Review", result.assessmentResults().get(0).assessmentName());
        assertEquals(CANDIDATE, result.candidateEmail());
        }

    @Test
    void recruiterCannotReadApplicationsForAnotherOwnersJob() {
        when(jobs.findById("job-1")).thenReturn(Optional.of(job("job-1", OTHER_RECRUITER, "PUBLISHED", List.of("React"), Map.of())));

        assertThrows(ResponseStatusException.class, () -> service.getRecruiterApplications(RECRUITER, "job-1"));
        verify(applications, never()).findAllByRecruiterEmailAndJobIdOrderByAppliedAtDesc(RECRUITER, "job-1");
    }

    @Test
    void unownedLegacySampleListingCannotReceivePlatformApplications() {
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(candidate()));
        when(jobs.findById("legacy")).thenReturn(Optional.of(job("legacy", null, null, List.of("Java"), Map.of())));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.applyToJob(CANDIDATE, "legacy"));

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        verify(applications, never()).insert(any(JobApplication.class));
    }

    @Test
    void saveJobPersistsOnlyVisibleJobsAndRemainsIdempotent() {
        Job job = job("job-1", RECRUITER, "PUBLISHED", List.of("React"), Map.of());
        when(jobs.findById("job-1")).thenReturn(Optional.of(job));
        when(savedJobs.existsByUserEmailAndJobId(CANDIDATE, "job-1")).thenReturn(false, true);

        service.saveJob(CANDIDATE, "job-1");
        service.saveJob(CANDIDATE, "job-1");

        verify(savedJobs, times(1)).save(any(SavedJob.class));
    }

    @Test
    void candidateCannotSaveUnpublishedJobs() {
        when(jobs.findById("draft-job")).thenReturn(Optional.of(job("draft-job", RECRUITER,
                "DRAFT", List.of("React"), Map.of())));

        assertThrows(NoSuchElementException.class, () -> service.saveJob(CANDIDATE, "draft-job"));
        verify(savedJobs, never()).save(any(SavedJob.class));
    }

    @Test
    void profileStrengthRemainsBasedOnProfileCompleteness() {
        User user = candidate();
        user.setFullName("Candidate");
        user.setPhone("12345678");
        user.setCollege("College");
        user.setDepartment("Engineering");
        user.setSkills(List.of("React"));
        when(users.findByEmail(CANDIDATE)).thenReturn(Optional.of(user));

        ProfileStrengthDto result = service.getProfileStrength(CANDIDATE);

        assertEquals(100, result.getStrength());
    }

    private CandidateSkillProfileDto profile(Map<String, CandidateSkillScoreDto> scores) {
        return new CandidateSkillProfileDto(scores, List.of(), List.of());
    }

    private CandidateSkillScoreDto score(String skill, int score) {
        return new CandidateSkillScoreDto(skill, score, "Verified challenge", Instant.parse("2026-11-20T12:00:00Z"));
    }

    private User candidate() {
        User candidate = new User();
        candidate.setId("candidate-id");
        candidate.setEmail(CANDIDATE);
        candidate.setFullName("Candidate Name");
        candidate.setRole(Role.CANDIDATE);
        candidate.setActive(true);
        candidate.setLevel(2);
        return candidate;
    }

    private Job job(String id, String recruiterEmail, String status, List<String> skills, Map<String, Integer> weights) {
        Job job = new Job();
        job.setId(id);
        job.setRecruiterEmail(recruiterEmail);
        job.setTitle("Test Engineer");
        job.setCompany("SkillQuest Test Co");
        job.setStatus(status);
        job.setRequiredSkills(skills);
        job.setPreferredSkills(List.of());
        job.setSkillWeights(weights);
        return job;
    }

    private JobRequest request() {
        JobRequest request = new JobRequest();
        request.setTitle("Test Engineer");
        request.setCompany("SkillQuest Test Co");
        request.setDescription("A role for testing the recruitment flow.");
        request.setLocation("Remote");
        request.setWorkMode("Remote");
        request.setEmploymentType("Full Time");
        request.setRequiredSkills(List.of("React"));
        request.setSkillWeights(Map.of("React", 70));
        return request;
    }
}