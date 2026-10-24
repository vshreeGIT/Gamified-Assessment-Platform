package com.skillquest.service.impl;

import com.skillquest.dto.JobMatchDto;
import com.skillquest.dto.ProfileStrengthDto;
import com.skillquest.entity.Job;
import com.skillquest.entity.SavedJob;
import com.skillquest.entity.User;
import com.skillquest.exception.UserNotFoundException;
import com.skillquest.repository.JobRepository;
import com.skillquest.repository.SavedJobRepository;
import com.skillquest.repository.UserRepository;
import com.skillquest.service.JobService;
import com.skillquest.util.ProfileStrengthCalculator;
import jakarta.annotation.PostConstruct;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final SavedJobRepository savedJobRepository;
    private final UserRepository userRepository;

    public JobServiceImpl(JobRepository jobRepository,
                          SavedJobRepository savedJobRepository,
                          UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.savedJobRepository = savedJobRepository;
        this.userRepository = userRepository;
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
        return j;
    }

    // ---------------------------------------------------------------------------
    // Match scoring
    //
    // Uses only the candidate's explicitly saved profile skills.
    // If the candidate has no saved skills, every job scores 0.
    //
    // Weights:
    //   Required skills  → up to 80 pts  (reqMatched / reqTotal × 80)
    //   Preferred skills → up to 20 pts  (prefMatched / prefTotal × 20)
    //
    // Edge cases:
    //   - No required skills on job  → required component = 0 (not a free 80)
    //   - No preferred skills on job → preferred component = 0
    //   - Both empty                 → score = 0
    //
    // XP does not affect the compatibility score.
    // ---------------------------------------------------------------------------
    private int computeMatch(User user, Job job) {
        List<String> savedSkills = user.getSkills();
        if (savedSkills == null || savedSkills.isEmpty()) {
            return 0;
        }

        // Normalise candidate skills once
        Set<String> candidateNorm = savedSkills.stream()
                .map(s -> s.trim().toLowerCase())
                .collect(Collectors.toSet());

        List<String> required  = job.getRequiredSkills()  != null ? job.getRequiredSkills()  : List.of();
        List<String> preferred = job.getPreferredSkills() != null ? job.getPreferredSkills() : List.of();

        double reqScore  = 0.0;
        double prefScore = 0.0;

        if (!required.isEmpty()) {
            long matched = required.stream()
                    .filter(s -> candidateNorm.contains(s.trim().toLowerCase()))
                    .count();
            reqScore = matched * 80.0 / required.size();
        }

        if (!preferred.isEmpty()) {
            long matched = preferred.stream()
                    .filter(s -> candidateNorm.contains(s.trim().toLowerCase()))
                    .count();
            prefScore = matched * 20.0 / preferred.size();
        }

        return (int) Math.round(reqScore + prefScore);
    }

    private List<String> matchedSkills(User user, Job job) {
        List<String> savedSkills = user.getSkills();
        if (savedSkills == null || savedSkills.isEmpty()) return List.of();

        Set<String> candidateNorm = savedSkills.stream()
                .map(s -> s.trim().toLowerCase())
                .collect(Collectors.toSet());

        List<String> all = new ArrayList<>();
        if (job.getRequiredSkills()  != null) all.addAll(job.getRequiredSkills());
        if (job.getPreferredSkills() != null) all.addAll(job.getPreferredSkills());

        return all.stream()
                .filter(s -> candidateNorm.contains(s.trim().toLowerCase()))
                .distinct()
                .collect(Collectors.toList());
    }

    private List<String> missingSkills(User user, Job job) {
        List<String> savedSkills = user.getSkills();
        Set<String> candidateNorm = (savedSkills != null && !savedSkills.isEmpty())
                ? savedSkills.stream().map(s -> s.trim().toLowerCase()).collect(Collectors.toSet())
                : Set.of();

        List<String> required = job.getRequiredSkills() != null ? job.getRequiredSkills() : List.of();
        return required.stream()
                .filter(s -> !candidateNorm.contains(s.trim().toLowerCase()))
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------------------
    // Public API
    // ---------------------------------------------------------------------------

    @Override
    public List<JobMatchDto> getJobMatches(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Set<String> savedIds = getSavedJobIds(userEmail);

        return jobRepository.findAll().stream()
                .map(job -> toDto(job, user, savedIds))
                .sorted(Comparator.comparingInt(JobMatchDto::getMatchScore).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public JobMatchDto getJobById(String userEmail, String jobId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new NoSuchElementException("Job not found: " + jobId));
        Set<String> savedIds = getSavedJobIds(userEmail);
        return toDto(job, user, savedIds);
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
        if (!jobRepository.existsById(jobId)) {
            throw new NoSuchElementException("Job not found: " + jobId);
        }
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
                .requiredSkills(job.getRequiredSkills())
                .preferredSkills(job.getPreferredSkills())
                .applicationUrl(job.getApplicationUrl())
                .matchScore(computeMatch(user, job))
                .matchedSkills(matchedSkills(user, job))
                .missingSkills(missingSkills(user, job))
                .saved(savedIds.contains(job.getId()))
                .build();
    }
}
