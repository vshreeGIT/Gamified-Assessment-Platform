package com.skillquest.service.impl;

import com.skillquest.dto.JobMatchDto;
import com.skillquest.dto.JobApplicationDto;
import com.skillquest.dto.JobApplicationStatusRequest;
import com.skillquest.dto.JobManagementDto;
import com.skillquest.dto.JobRequest;
import com.skillquest.dto.SkillMatchDto;
import com.skillquest.dto.CandidateSkillProfileDto;
import com.skillquest.dto.ProfileStrengthDto;
import com.skillquest.entity.Job;
import com.skillquest.entity.JobApplication;
import com.skillquest.entity.Role;
import com.skillquest.entity.SavedJob;
import com.skillquest.entity.User;
import com.skillquest.exception.UserNotFoundException;
import com.skillquest.repository.JobRepository;
import com.skillquest.repository.JobApplicationRepository;
import com.skillquest.repository.SavedJobRepository;
import com.skillquest.repository.UserRepository;
import com.skillquest.service.JobService;
import com.skillquest.service.CandidateSkillEvidenceService;
import com.skillquest.util.ProfileStrengthCalculator;
import jakarta.annotation.PostConstruct;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final SavedJobRepository savedJobRepository;
    private final UserRepository userRepository;
        private final JobApplicationRepository applicationRepository;
        private final CandidateSkillEvidenceService skillEvidenceService;

    public JobServiceImpl(JobRepository jobRepository,
                          SavedJobRepository savedJobRepository,
                                                  UserRepository userRepository,
                                                  JobApplicationRepository applicationRepository,
                                                  CandidateSkillEvidenceService skillEvidenceService) {
        this.jobRepository = jobRepository;
        this.savedJobRepository = savedJobRepository;
        this.userRepository = userRepository;
                this.applicationRepository = applicationRepository;
                this.skillEvidenceService = skillEvidenceService;
    }

    // ---------------------------------------------------------------------------
    // Sample job catalogue — seeded once on startup if collection is empty.
    // These are illustrative listings; no live employer connection exists.
    // applicationUrl is null on all sample records to make this explicit.
    // ---------------------------------------------------------------------------
    @PostConstruct
    void seedSampleJobs() {
        if (jobRepository.count() > 0) return;

        List<Job> samples = new ArrayList<>();

        samples.add(job("Frontend Developer Intern", "TechNova Solutions", "💻", "blue",
                "Build responsive UIs using React and modern JavaScript. Work alongside senior engineers on real product features.",
                "Chennai, Tamil Nadu", "On-site", "Internship", "₹15,000 / month", "Fresher",
                List.of("React", "JavaScript", "HTML/CSS"),
                List.of("TypeScript", "Git"), null));

        samples.add(job("Data Analyst Intern", "DataSphere Analytics", "📊", "purple",
                "Analyse business datasets, create dashboards, and present insights to stakeholders.",
                "Bengaluru, Karnataka", "Hybrid", "Internship", "₹18,000 / month", "Fresher",
                List.of("Python", "SQL", "Power BI"),
                List.of("Excel", "Tableau"), null));

        samples.add(job("Junior Software Engineer", "CloudNest Technologies", "☁️", "cyan",
                "Develop and maintain backend services in Java. Participate in code reviews and agile ceremonies.",
                "Remote", "Remote", "Full Time", "₹4.5 LPA", "0-1 years",
                List.of("Java", "Git", "Problem Solving"),
                List.of("Spring Boot", "Docker"), null));

        samples.add(job("UI/UX Design Intern", "BrightPath Digital", "🚀", "pink",
                "Design user flows, wireframes, and high-fidelity prototypes for mobile and web products.",
                "Chennai, Tamil Nadu", "On-site", "Internship", "₹12,000 / month", "Fresher",
                List.of("Figma", "Canva", "UI Design"),
                List.of("Adobe XD", "User Research"), null));

        samples.add(job("Python Developer Intern", "Nexus AI Labs", "🤖", "orange",
                "Assist in building ML pipelines and data preprocessing scripts for AI products.",
                "Remote", "Remote", "Internship", "₹14,000 / month", "Fresher",
                List.of("Python", "SQL", "Problem Solving"),
                List.of("Pandas", "NumPy", "Git"), null));

        samples.add(job("Full Stack Developer", "Orion Tech", "🌐", "blue",
                "Own end-to-end feature development across React frontend and Spring Boot backend.",
                "Bengaluru, Karnataka", "Hybrid", "Full Time", "₹6 LPA", "0-1 years",
                List.of("React", "Java", "SQL", "Git"),
                List.of("Spring Boot", "Docker", "TypeScript"), null));

        samples.add(job("Business Analyst Intern", "StratEdge Consulting", "📈", "purple",
                "Support senior analysts in requirements gathering, process mapping, and report creation.",
                "Chennai, Tamil Nadu", "On-site", "Internship", "₹10,000 / month", "Fresher",
                List.of("SQL", "Excel", "Problem Solving"),
                List.of("Power BI", "Communication"), null));

        samples.add(job("DevOps Intern", "CloudNest Technologies", "⚙️", "cyan",
                "Assist in CI/CD pipeline setup, container management, and infrastructure monitoring.",
                "Remote", "Remote", "Internship", "₹16,000 / month", "Fresher",
                List.of("Git", "Problem Solving"),
                List.of("Docker", "Linux", "Python"), null));

        jobRepository.saveAll(samples);
    }

    private Job job(String title, String company, String logo, String color,
                    String description, String location, String workMode,
                    String employmentType, String salary, String experience,
                    List<String> required, List<String> preferred, String appUrl) {
        Job j = new Job();
        j.setTitle(title);
        j.setCompany(company);
        j.setCompanyLogo(logo);
        j.setLogoColor(color);
        j.setDescription(description);
        j.setLocation(location);
        j.setWorkMode(workMode);
        j.setEmploymentType(employmentType);
        j.setSalary(salary);
        j.setExperienceLevel(experience);
        j.setRequiredSkills(required);
        j.setPreferredSkills(preferred);
        j.setApplicationUrl(appUrl);
        j.setStatus("PUBLISHED");
        j.setCreatedAt(LocalDateTime.now());
        return j;
    }

    private MatchDetails calculateMatch(Job job, CandidateSkillProfileDto profile) {
        List<String> required = safeList(job.getRequiredSkills());
        if (required.isEmpty()) {
            return new MatchDetails(0, List.of(), List.of(), List.of(), List.of(),
                    "No required skills have been defined, so a weighted match score is unavailable.");
        }

        Map<String, Integer> weights = normalizedWeights(job);
        int totalWeight = required.stream().mapToInt(skill -> weights.getOrDefault(
                CandidateSkillEvidenceService.normalizeSkill(skill), 1)).sum();
        if (totalWeight <= 0) {
            return new MatchDetails(0, List.of(), required, List.of(), List.of(),
                    "No positive importance weights are defined; unrated skills receive no match credit.");
        }

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        List<String> gaps = new ArrayList<>();
        List<SkillMatchDto> breakdown = new ArrayList<>();
        double weightedScore = 0;
        for (String skill : required) {
            String key = CandidateSkillEvidenceService.normalizeSkill(skill);
            int weight = weights.getOrDefault(key, 1);
            var evidence = profile.skillScores().get(key);
            Integer candidateScore = evidence == null ? null : evidence.score();
            if (candidateScore == null) {
                missing.add(skill);
            } else {
                weightedScore += candidateScore * (double) weight;
                if (candidateScore >= 70) matched.add(skill);
                else gaps.add(skill);
            }
            breakdown.add(new SkillMatchDto(skill, weight, candidateScore,
                    candidateScore == null ? 0 : Math.round(candidateScore * (double) weight / totalWeight * 10) / 10.0,
                    evidence == null ? "No verified score; declared profile skills are not treated as assessed." : evidence.evidence()));
        }
        int percentage = (int) Math.round(weightedScore / totalWeight);
        return new MatchDetails(percentage, matched, missing, gaps, breakdown,
                "Match = sum(verified skill score × importance weight) ÷ total required-skill weight. "
                        + "Unrated skills contribute 0; profile-declared skills without scored activity remain unverified.");
    }

    private Map<String, Integer> normalizedWeights(Job job) {
        Map<String, Integer> weights = new HashMap<>();
        if (job.getSkillWeights() != null) {
            job.getSkillWeights().forEach((skill, weight) -> {
                if (skill != null && weight != null && weight > 0) {
                    weights.put(CandidateSkillEvidenceService.normalizeSkill(skill), weight);
                }
            });
        }
        return weights;
    }

    private List<String> safeList(List<String> values) {
        return values == null ? List.of() : values;
    }

    private boolean isCandidateVisible(Job job) {
        return job.getStatus() == null || "PUBLISHED".equalsIgnoreCase(job.getStatus());
    }

    private record MatchDetails(int score, List<String> matchedSkills, List<String> missingSkills,
                                List<String> skillGaps, List<SkillMatchDto> skillBreakdown, String explanation) { }

    // ---------------------------------------------------------------------------
    // Public API
    // ---------------------------------------------------------------------------

    @Override
    public List<JobMatchDto> getJobMatches(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Set<String> savedIds = getSavedJobIds(userEmail);
        Map<String, JobApplication> applicationsByJob = applicationRepository
                .findAllByCandidateEmailOrderByAppliedAtDesc(userEmail).stream()
                .collect(Collectors.toMap(JobApplication::getJobId, application -> application, (first, ignored) -> first));
        Map<String, CandidateSkillProfileDto> profilesByRecruiter = new HashMap<>();

        return jobRepository.findAll().stream()
                .filter(this::isCandidateVisible)
                .map(job -> {
                    String recruiterEmail = job.getRecruiterEmail() == null ? "" : job.getRecruiterEmail();
                    CandidateSkillProfileDto profile = profilesByRecruiter.computeIfAbsent(recruiterEmail,
                            key -> skillEvidenceService.getProfile(userEmail, key.isBlank() ? null : key));
                    return toDto(job, user, savedIds, applicationsByJob.get(job.getId()), profile);
                })
                .sorted(Comparator.comparingInt(JobMatchDto::getMatchScore).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public JobMatchDto getJobById(String userEmail, String jobId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Job job = jobRepository.findById(jobId)
                .filter(this::isCandidateVisible)
                .orElseThrow(() -> new NoSuchElementException("Job not found: " + jobId));
        Set<String> savedIds = getSavedJobIds(userEmail);
        JobApplication application = applicationRepository.findByJobIdAndCandidateEmail(jobId, userEmail).orElse(null);
        CandidateSkillProfileDto profile = skillEvidenceService.getProfile(userEmail, job.getRecruiterEmail());
        return toDto(job, user, savedIds, application, profile);
    }

    @Override
    public List<JobManagementDto> getRecruiterJobs(String recruiterEmail) {
        return jobRepository.findAllByRecruiterEmailOrderByCreatedAtDesc(recruiterEmail).stream()
                .map(this::toManagementDto).toList();
    }

    @Override
    public JobManagementDto createJob(String recruiterEmail, JobRequest request) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new UserNotFoundException("Recruiter not found"));
        if (recruiter.getRole() != Role.RECRUITER && recruiter.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only recruiters can create job listings");
        }
        validateJobRequest(request);
        LocalDateTime now = LocalDateTime.now();
        Job job = fromRequest(request);
        job.setRecruiterEmail(recruiterEmail);
        job.setStatus("DRAFT");
        job.setCreatedAt(now);
        job.setUpdatedAt(now);
        return toManagementDto(jobRepository.save(job));
    }

    @Override
    public JobManagementDto updateJob(String recruiterEmail, String jobId, JobRequest request) {
        Job job = requireOwnedJob(recruiterEmail, jobId);
        validateJobRequest(request);
        copyRequestToJob(request, job);
        job.setUpdatedAt(LocalDateTime.now());
        return toManagementDto(jobRepository.save(job));
    }

    @Override
    public JobManagementDto getRecruiterJob(String recruiterEmail, String jobId) {
        return toManagementDto(requireOwnedJob(recruiterEmail, jobId));
    }

    @Override
    public JobManagementDto setJobStatus(String recruiterEmail, String jobId, String status) {
        Job job = requireOwnedJob(recruiterEmail, jobId);
        if ("PUBLISHED".equalsIgnoreCase(status)) {
            if (safeList(job.getRequiredSkills()).isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Add at least one required skill before publishing this job");
            }
            job.setStatus("PUBLISHED");
        } else if ("CLOSED".equalsIgnoreCase(status)) {
            job.setStatus("CLOSED");
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported job status");
        }
        job.setUpdatedAt(LocalDateTime.now());
        return toManagementDto(jobRepository.save(job));
    }

    @Override
    public JobApplicationDto applyToJob(String candidateEmail, String jobId) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .filter(user -> user.getRole() == Role.CANDIDATE && user.isActive())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Candidate account is not active"));
        Job job = jobRepository.findById(jobId).filter(this::isCandidateVisible)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Published job not found"));
        if (job.getRecruiterEmail() == null || job.getRecruiterEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This legacy listing is informational and does not accept platform applications");
        }
        Optional<JobApplication> existing = applicationRepository.findByJobIdAndCandidateEmail(jobId, candidateEmail);
        if (existing.isPresent()) return toApplicationDto(existing.get(), job, candidate);
        if (!"PUBLISHED".equalsIgnoreCase(job.getStatus()) && job.getStatus() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This job is not accepting applications");
        }

        LocalDateTime now = LocalDateTime.now();
        JobApplication application = JobApplication.builder()
            .id(UUID.nameUUIDFromBytes((jobId + "|" + candidateEmail).getBytes(StandardCharsets.UTF_8)).toString())
            .jobId(jobId).recruiterEmail(job.getRecruiterEmail())
                .candidateId(candidate.getId()).candidateEmail(candidateEmail).status("APPLIED")
                .appliedAt(now).updatedAt(now).build();
        try {
            application = applicationRepository.insert(application);
        } catch (DuplicateKeyException duplicate) {
            application = applicationRepository.findByJobIdAndCandidateEmail(jobId, candidateEmail)
                    .orElseThrow(() -> duplicate);
        }
        return toApplicationDto(application, job, candidate);
    }

    @Override
    public List<JobApplicationDto> getCandidateApplications(String candidateEmail) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new UserNotFoundException("Candidate not found"));
        return applicationRepository.findAllByCandidateEmailOrderByAppliedAtDesc(candidateEmail).stream()
                .map(application -> jobRepository.findById(application.getJobId())
                        .map(job -> toApplicationDto(application, job, candidate)).orElse(null))
                .filter(Objects::nonNull).toList();
    }

    @Override
    public List<JobApplicationDto> getRecruiterApplications(String recruiterEmail, String jobId) {
        Job job = requireOwnedJob(recruiterEmail, jobId);
        return applicationRepository.findAllByRecruiterEmailAndJobIdOrderByAppliedAtDesc(recruiterEmail, jobId).stream()
                .map(application -> userRepository.findByEmail(application.getCandidateEmail())
                        .map(candidate -> toApplicationDto(application, job, candidate)).orElse(null))
                .filter(Objects::nonNull).toList();
    }

    @Override
    public JobApplicationDto updateApplicationStatus(String recruiterEmail, String jobId, String applicationId,
                                                      JobApplicationStatusRequest request) {
        Job job = requireOwnedJob(recruiterEmail, jobId);
        JobApplication application = applicationRepository.findById(applicationId)
                .filter(item -> jobId.equals(item.getJobId()) && recruiterEmail.equals(item.getRecruiterEmail()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
        application.setStatus(request.getStatus().trim().toUpperCase(Locale.ROOT));
        application.setUpdatedAt(LocalDateTime.now());
        application = applicationRepository.save(application);
        User candidate = userRepository.findByEmail(application.getCandidateEmail())
                .orElseThrow(() -> new UserNotFoundException("Candidate not found"));
        return toApplicationDto(application, job, candidate);
    }

    private Job requireOwnedJob(String recruiterEmail, String jobId) {
        return jobRepository.findById(jobId)
                .filter(job -> recruiterEmail.equals(job.getRecruiterEmail()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
    }

    private void validateJobRequest(JobRequest request) {
        List<String> required = cleanSkills(request.getRequiredSkills());
        if (required.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Add at least one required skill");
        Set<String> normalized = new HashSet<>();
        for (String skill : required) {
            if (!normalized.add(CandidateSkillEvidenceService.normalizeSkill(skill))) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Required skill names must be unique");
            }
        }
    }

    private Job fromRequest(JobRequest request) {
        Job job = new Job();
        copyRequestToJob(request, job);
        return job;
    }

    private void copyRequestToJob(JobRequest request, Job job) {
        job.setTitle(request.getTitle().trim());
        job.setCompany(request.getCompany().trim());
        job.setCompanyLogo(blank(request.getCompanyLogo()) ? "💼" : request.getCompanyLogo().trim());
        job.setLogoColor(blank(request.getLogoColor()) ? "blue" : request.getLogoColor().trim());
        job.setDescription(request.getDescription().trim());
        job.setLocation(request.getLocation().trim());
        job.setWorkMode(request.getWorkMode().trim());
        job.setEmploymentType(request.getEmploymentType().trim());
        job.setSalary(blank(request.getSalary()) ? null : request.getSalary().trim());
        job.setExperienceLevel(blank(request.getExperienceLevel()) ? null : request.getExperienceLevel().trim());
        job.setMinimumExperienceYears(request.getMinimumExperienceYears());
        job.setRequiredSkills(cleanSkills(request.getRequiredSkills()));
        job.setPreferredSkills(cleanSkills(request.getPreferredSkills()));
        Map<String, Integer> weights = new LinkedHashMap<>();
        for (String skill : safeList(job.getRequiredSkills())) {
            Integer weight = request.getSkillWeights() == null ? null : request.getSkillWeights().entrySet().stream()
                    .filter(entry -> CandidateSkillEvidenceService.normalizeSkill(entry.getKey())
                            .equals(CandidateSkillEvidenceService.normalizeSkill(skill)))
                    .map(Map.Entry::getValue).filter(Objects::nonNull).findFirst().orElse(null);
            weights.put(skill, weight == null || weight < 1 ? 1 : weight);
        }
        job.setSkillWeights(weights);
    }

    private List<String> cleanSkills(List<String> skills) {
        if (skills == null) return List.of();
        LinkedHashMap<String, String> unique = new LinkedHashMap<>();
        skills.stream().filter(Objects::nonNull).map(String::trim).filter(skill -> !skill.isBlank())
                .forEach(skill -> unique.putIfAbsent(CandidateSkillEvidenceService.normalizeSkill(skill), skill));
        return new ArrayList<>(unique.values());
    }

    private JobManagementDto toManagementDto(Job job) {
        return new JobManagementDto(job.getId(), job.getTitle(), job.getCompany(), job.getCompanyLogo(), job.getLogoColor(),
                job.getDescription(), job.getLocation(), job.getWorkMode(), job.getEmploymentType(), job.getSalary(),
                job.getExperienceLevel(), job.getMinimumExperienceYears(), safeList(job.getRequiredSkills()),
                safeList(job.getPreferredSkills()), job.getSkillWeights() == null ? Map.of() : job.getSkillWeights(),
                job.getStatus() == null ? "PUBLISHED" : job.getStatus(), job.getCreatedAt(),
                applicationRepository.countByJobId(job.getId()));
    }

    private JobApplicationDto toApplicationDto(JobApplication application, Job job, User candidate) {
        CandidateSkillProfileDto evidence = skillEvidenceService.getProfile(candidate.getEmail(), application.getRecruiterEmail());
        MatchDetails match = calculateMatch(job, evidence);
        return new JobApplicationDto(application.getId(), job.getId(), job.getTitle(), job.getCompany(),
                candidate.getId(), candidate.getEmail(), candidate.getFullName(), safeList(candidate.getSkills()), candidate.getXp(),
                candidate.getLevel(), match.score(), match.skillBreakdown(), match.explanation(),
                evidence.challengeHistory(), evidence.assessmentResults(), application.getStatus(),
                application.getAppliedAt(), application.getUpdatedAt());
    }

    @Override
    public ProfileStrengthDto getProfileStrength(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        int strength = ProfileStrengthCalculator.calculate(user);

        boolean hasName   = user.getFullName()   != null && !user.getFullName().isBlank();
        boolean hasEmail  = user.getEmail()       != null && !user.getEmail().isBlank();
        boolean hasPhone  = user.getPhone()       != null && !user.getPhone().isBlank();
        boolean hasCollege = user.getCollege()    != null && !user.getCollege().isBlank();
        boolean hasDept   = user.getDepartment()  != null && !user.getDepartment().isBlank();
        boolean hasSkills = user.getSkills()      != null && !user.getSkills().isEmpty();

        List<String> savedSkills = hasSkills ? new ArrayList<>(user.getSkills()) : List.of();

        return ProfileStrengthDto.builder()
                .strength(strength)
                .hasName(hasName)
                .hasEmail(hasEmail)
                .hasPhone(hasPhone)
                .hasCollege(hasCollege)
                .hasDepartment(hasDept)
                .hasSkills(hasSkills)
                .xp(user.getXp())
                .level(user.getLevel())
                .inferredSkills(savedSkills)
                .skillBasis(hasSkills
                        ? "Based on your saved profile skills."
                        : "No skills saved — add skills to your profile to improve job match scores.")
                .build();
    }

    @Override
    public void saveJob(String userEmail, String jobId) {
        jobRepository.findById(jobId).filter(this::isCandidateVisible)
            .orElseThrow(() -> new NoSuchElementException("Job not found: " + jobId));
        if (savedJobRepository.existsByUserEmailAndJobId(userEmail, jobId)) {
            return; // already saved — idempotent
        }
        SavedJob saved = new SavedJob();
        saved.setUserEmail(userEmail);
        saved.setJobId(jobId);
        saved.setSavedAt(LocalDateTime.now());
        try {
            savedJobRepository.save(saved);
        } catch (DuplicateKeyException ignored) {
            // race condition — already saved
        }
    }

    @Override
    public void unsaveJob(String userEmail, String jobId) {
        savedJobRepository.deleteByUserEmailAndJobId(userEmail, jobId);
    }

    @Override
    public Set<String> getSavedJobIds(String userEmail) {
        return savedJobRepository.findByUserEmail(userEmail).stream()
                .map(SavedJob::getJobId)
                .collect(Collectors.toSet());
    }

    private JobMatchDto toDto(Job job, User user, Set<String> savedIds) {
        CandidateSkillProfileDto evidence = skillEvidenceService.getProfile(user.getEmail(), job.getRecruiterEmail());
        JobApplication application = applicationRepository.findByJobIdAndCandidateEmail(job.getId(), user.getEmail()).orElse(null);
        return toDto(job, user, savedIds, application, evidence);
    }

    private JobMatchDto toDto(Job job, User user, Set<String> savedIds,
                              JobApplication application, CandidateSkillProfileDto evidence) {
        MatchDetails match = calculateMatch(job, evidence);
        return JobMatchDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(job.getCompany())
                .companyLogo(job.getCompanyLogo())
                .logoColor(job.getLogoColor())
                .description(job.getDescription())
                .location(job.getLocation())
                .workMode(job.getWorkMode())
                .employmentType(job.getEmploymentType())
                .salary(job.getSalary())
                .experienceLevel(job.getExperienceLevel())
                .minimumExperienceYears(job.getMinimumExperienceYears())
                .requiredSkills(job.getRequiredSkills())
                .preferredSkills(job.getPreferredSkills())
                .skillWeights(job.getSkillWeights() == null ? Map.of() : job.getSkillWeights())
                .applicationUrl(job.getApplicationUrl())
                        .matchScore(match.score())
                        .matchedSkills(match.matchedSkills())
                        .missingSkills(match.missingSkills())
                        .skillGaps(match.skillGaps())
                        .skillBreakdown(match.skillBreakdown())
                        .matchExplanation(match.explanation())
                        .applied(application != null)
                        .applicationStatus(application == null ? null : application.getStatus())
                        .canApply(job.getRecruiterEmail() != null && !job.getRecruiterEmail().isBlank()
                            && isCandidateVisible(job))
                                .canApply(job.getRecruiterEmail() != null && !job.getRecruiterEmail().isBlank()
                                        && isCandidateVisible(job))
                .saved(savedIds.contains(job.getId()))
                .build();
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }
}
