package com.skillquest.service.impl;

import com.skillquest.dto.JobMatchDto;
import com.skillquest.dto.ProfileStrengthDto;
import com.skillquest.entity.Job;
import com.skillquest.entity.SavedJob;
import com.skillquest.entity.User;
import com.skillquest.repository.JobRepository;
import com.skillquest.repository.SavedJobRepository;
import com.skillquest.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class JobServiceImplTest {

    private JobRepository jobRepository;
    private SavedJobRepository savedJobRepository;
    private UserRepository userRepository;
    private JobServiceImpl service;

    private static final String EMAIL = "test@example.com";

    @BeforeEach
    void setUp() {
        jobRepository = mock(JobRepository.class);
        savedJobRepository = mock(SavedJobRepository.class);
        userRepository = mock(UserRepository.class);
        when(jobRepository.count()).thenReturn(1L); // skip @PostConstruct seed
        service = new JobServiceImpl(jobRepository, savedJobRepository, userRepository);
    }

    // ── no saved skills ──────────────────────────────────────────────────────

    @Test
    void noSavedSkillsGivesZeroMatchScore() {
        User user = userWithSkills(); // no skills
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        Job job = jobWith(List.of("Java", "Python"), List.of("Git"));
        when(jobRepository.findAll()).thenReturn(List.of(job));

        var matches = service.getJobMatches(EMAIL);
        assertEquals(0, matches.get(0).getMatchScore());
    }

    @Test
    void noSavedSkillsGivesEmptyMatchedSkills() {
        User user = userWithSkills();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        Job job = jobWith(List.of("Java"), List.of());
        when(jobRepository.findAll()).thenReturn(List.of(job));

        var matches = service.getJobMatches(EMAIL);
        assertTrue(matches.get(0).getMatchedSkills().isEmpty());
    }

    @Test
    void noSavedSkillsAllRequiredAreInMissingSkills() {
        User user = userWithSkills();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        Job job = jobWith(List.of("Java", "SQL"), List.of());
        when(jobRepository.findAll()).thenReturn(List.of(job));

        var matches = service.getJobMatches(EMAIL);
        assertTrue(matches.get(0).getMissingSkills().containsAll(List.of("Java", "SQL")));
    }

    // ── required-skill matching (80 pts) ────────────────────────────────────

    @Test
    void allRequiredSkillsMatchedGivesEightyPoints() {
        User user = userWithSkills("Java", "Python", "SQL");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        Job job = jobWith(List.of("Java", "Python", "SQL"), List.of());
        when(jobRepository.findAll()).thenReturn(List.of(job));

        // 3/3 required = 80 pts, no preferred = 0 pts → 80
        assertEquals(80, service.getJobMatches(EMAIL).get(0).getMatchScore());
    }

    @Test
    void partialRequiredSkillMatchIsProportional() {
        User user = userWithSkills("Java");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        Job job = jobWith(List.of("Java", "Python", "SQL"), List.of()); // 1 of 3 required
        when(jobRepository.findAll()).thenReturn(List.of(job));

        // 1/3 × 80 = 26.67 → rounds to 27
        assertEquals(27, service.getJobMatches(EMAIL).get(0).getMatchScore());
    }

    @Test
    void noRequiredSkillsMatchedGivesZeroRequiredComponent() {
        User user = userWithSkills("Figma", "Canva");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        Job job = jobWith(List.of("Java", "Python"), List.of()); // no overlap
        when(jobRepository.findAll()).thenReturn(List.of(job));

        assertEquals(0, service.getJobMatches(EMAIL).get(0).getMatchScore());
    }

    // ── preferred-skill matching (20 pts) ───────────────────────────────────

    @Test
    void allPreferredSkillsMatchedGivesTwentyPoints() {
        User user = userWithSkills("Java", "Git", "Docker");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        // All required matched (80) + all preferred matched (20) = 100
        Job job = jobWith(List.of("Java"), List.of("Git", "Docker"));
        when(jobRepository.findAll()).thenReturn(List.of(job));

        assertEquals(100, service.getJobMatches(EMAIL).get(0).getMatchScore());
    }

    @Test
    void partialPreferredMatchIsProportional() {
        User user = userWithSkills("Java", "Git");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        // 1/1 required = 80, 1/2 preferred = 10 → 90
        Job job = jobWith(List.of("Java"), List.of("Git", "Docker"));
        when(jobRepository.findAll()).thenReturn(List.of(job));

        assertEquals(90, service.getJobMatches(EMAIL).get(0).getMatchScore());
    }

    // ── jobs with empty requirements ─────────────────────────────────────────

    @Test
    void jobWithNoRequiredSkillsGivesZeroRequiredComponent() {
        User user = userWithSkills("Java", "Python");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        Job job = jobWith(List.of(), List.of()); // no requirements at all
        when(jobRepository.findAll()).thenReturn(List.of(job));

        // No requirements → score = 0, not an artificial 100
        assertEquals(0, service.getJobMatches(EMAIL).get(0).getMatchScore());
    }

    @Test
    void jobWithNoRequiredButSomePreferredScoresOnlyPreferred() {
        User user = userWithSkills("Git", "Docker");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        Job job = jobWith(List.of(), List.of("Git", "Docker")); // 2/2 preferred
        when(jobRepository.findAll()).thenReturn(List.of(job));

        // 0 required component + 2/2 preferred = 20
        assertEquals(20, service.getJobMatches(EMAIL).get(0).getMatchScore());
    }

    @Test
    void jobWithNullRequiredAndNullPreferredGivesZero() {
        User user = userWithSkills("Java");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        Job job = new Job();
        job.setId("j1");
        job.setTitle("Null Skills Job");
        job.setRequiredSkills(null);
        job.setPreferredSkills(null);
        when(jobRepository.findAll()).thenReturn(List.of(job));

        assertEquals(0, service.getJobMatches(EMAIL).get(0).getMatchScore());
    }

    // ── case-insensitive matching ────────────────────────────────────────────

    @Test
    void skillMatchingIsCaseInsensitive() {
        User user = userWithSkills("java", "PYTHON", "Sql");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        Job job = jobWith(List.of("Java", "Python", "SQL"), List.of());
        when(jobRepository.findAll()).thenReturn(List.of(job));

        // All 3 required matched despite different casing → 80
        assertEquals(80, service.getJobMatches(EMAIL).get(0).getMatchScore());
    }

    @Test
    void skillMatchingTrimsWhitespace() {
        User user = userWithSkills("  Java  ", "Python");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        Job job = jobWith(List.of("Java"), List.of());
        when(jobRepository.findAll()).thenReturn(List.of(job));

        assertEquals(80, service.getJobMatches(EMAIL).get(0).getMatchScore());
    }

    // ── XP does not affect score ─────────────────────────────────────────────

    @Test
    void xpDoesNotInfluenceMatchScore() {
        User lowXp  = userWithSkillsAndXp(0,    "Java");
        User highXp = userWithSkillsAndXp(9999, "Java");

        Job job = jobWith(List.of("Java"), List.of());

        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());
        when(jobRepository.findAll()).thenReturn(List.of(job));

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(lowXp));
        int scoreLow = service.getJobMatches(EMAIL).get(0).getMatchScore();

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(highXp));
        int scoreHigh = service.getJobMatches(EMAIL).get(0).getMatchScore();

        assertEquals(scoreLow, scoreHigh, "XP must not affect the match score");
    }

    // ── matched / missing skill lists ────────────────────────────────────────

    @Test
    void matchedSkillsListIsCorrect() {
        User user = userWithSkills("Java", "Git");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        Job job = jobWith(List.of("Java", "Python"), List.of("Git"));
        when(jobRepository.findAll()).thenReturn(List.of(job));

        JobMatchDto dto = service.getJobMatches(EMAIL).get(0);
        assertTrue(dto.getMatchedSkills().contains("Java"));
        assertTrue(dto.getMatchedSkills().contains("Git"));
        assertFalse(dto.getMatchedSkills().contains("Python"));
    }

    @Test
    void missingSkillsListContainsUnmatchedRequired() {
        User user = userWithSkills("Java");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        Job job = jobWith(List.of("Java", "Python", "SQL"), List.of());
        when(jobRepository.findAll()).thenReturn(List.of(job));

        JobMatchDto dto = service.getJobMatches(EMAIL).get(0);
        assertFalse(dto.getMissingSkills().contains("Java"));
        assertTrue(dto.getMissingSkills().contains("Python"));
        assertTrue(dto.getMissingSkills().contains("SQL"));
    }

    // ── sorting ──────────────────────────────────────────────────────────────

    @Test
    void jobsAreSortedByMatchScoreDescending() {
        User user = userWithSkills("Java", "SQL");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of());

        Job highMatch = jobWith(List.of("Java", "SQL"), List.of()); // 80
        Job lowMatch  = jobWith(List.of("Figma"),       List.of()); // 0
        when(jobRepository.findAll()).thenReturn(List.of(lowMatch, highMatch));

        var matches = service.getJobMatches(EMAIL);
        assertTrue(matches.get(0).getMatchScore() >= matches.get(1).getMatchScore());
    }

    // ── save / unsave ────────────────────────────────────────────────────────

    @Test
    void saveJobPersistsRecord() {
        when(jobRepository.existsById("job1")).thenReturn(true);
        when(savedJobRepository.existsByUserEmailAndJobId(EMAIL, "job1")).thenReturn(false);

        service.saveJob(EMAIL, "job1");

        verify(savedJobRepository).save(any(SavedJob.class));
    }

    @Test
    void saveJobIsIdempotentWhenAlreadySaved() {
        when(jobRepository.existsById("job1")).thenReturn(true);
        when(savedJobRepository.existsByUserEmailAndJobId(EMAIL, "job1")).thenReturn(true);

        service.saveJob(EMAIL, "job1");

        verify(savedJobRepository, never()).save(any());
    }

    @Test
    void saveJobThrowsForUnknownJob() {
        when(jobRepository.existsById("bad")).thenReturn(false);
        assertThrows(NoSuchElementException.class, () -> service.saveJob(EMAIL, "bad"));
    }

    @Test
    void unsaveJobDelegatesDelete() {
        service.unsaveJob(EMAIL, "job1");
        verify(savedJobRepository).deleteByUserEmailAndJobId(EMAIL, "job1");
    }

    @Test
    void savedFlagReflectsPersistedState() {
        User user = userWithSkills("Java");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        Job job = jobWith(List.of("Java"), List.of());
        SavedJob savedJob = new SavedJob();
        savedJob.setJobId(job.getId());
        savedJob.setUserEmail(EMAIL);

        when(savedJobRepository.findByUserEmail(EMAIL)).thenReturn(List.of(savedJob));
        when(jobRepository.findAll()).thenReturn(List.of(job));

        assertTrue(service.getJobMatches(EMAIL).get(0).isSaved());
    }

    // ── profile strength (15/15/15/15/15/25) ────────────────────────────────

    @Test
    void profileStrengthIsZeroForEmptyUser() {
        User user = new User();
        // email is null, all fields null
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        ProfileStrengthDto dto = service.getProfileStrength(EMAIL);
        assertEquals(0, dto.getStrength());
    }

    @Test
    void profileStrengthWithNoSkillsMaxesAtSeventyFive() {
        User user = new User();
        user.setFullName("Alice");
        user.setEmail(EMAIL);
        user.setPhone("9999999999");
        user.setCollege("MIT");
        user.setDepartment("Computer Science");
        // no skills
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        ProfileStrengthDto dto = service.getProfileStrength(EMAIL);
        assertEquals(75, dto.getStrength()); // 5 × 15 = 75
        assertFalse(dto.isHasSkills());
    }

    @Test
    void profileStrengthIsHundredWithAllFieldsAndSkills() {
        User user = new User();
        user.setFullName("Alice");
        user.setEmail(EMAIL);
        user.setPhone("9999999999");
        user.setCollege("MIT");
        user.setDepartment("Computer Science");
        user.setSkills(List.of("Java"));
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        ProfileStrengthDto dto = service.getProfileStrength(EMAIL);
        assertEquals(100, dto.getStrength());
        assertTrue(dto.isHasSkills());
    }

    @Test
    void profileStrengthSkillsContributeExactlyTwentyFivePoints() {
        // User with only skills set — all other fields null
        User user = new User();
        user.setSkills(List.of("Python", "SQL"));
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        ProfileStrengthDto dto = service.getProfileStrength(EMAIL);
        assertEquals(25, dto.getStrength());
    }

    @Test
    void profileStrengthEachNonSkillFieldContributesFifteenPoints() {
        User user = new User();
        user.setEmail(EMAIL); // only email set
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        assertEquals(15, service.getProfileStrength(EMAIL).getStrength());
    }

    @Test
    void profileStrengthInferredSkillsReflectsSavedSkills() {
        User user = new User();
        user.setEmail(EMAIL);
        user.setSkills(List.of("React", "TypeScript"));
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        ProfileStrengthDto dto = service.getProfileStrength(EMAIL);
        assertTrue(dto.getInferredSkills().containsAll(List.of("React", "TypeScript")));
    }

    @Test
    void profileStrengthInferredSkillsIsEmptyWhenNoSkillsSaved() {
        User user = new User();
        user.setEmail(EMAIL);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        ProfileStrengthDto dto = service.getProfileStrength(EMAIL);
        assertTrue(dto.getInferredSkills().isEmpty());
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private User userWithSkills(String... skills) {
        User u = new User();
        u.setEmail(EMAIL);
        u.setSkills(skills.length > 0 ? List.of(skills) : null);
        return u;
    }

    private User userWithSkillsAndXp(int xp, String... skills) {
        User u = userWithSkills(skills);
        u.setXp(xp);
        return u;
    }

    private Job jobWith(List<String> required, List<String> preferred) {
        Job j = new Job();
        j.setId("job-" + System.nanoTime());
        j.setTitle("Test Job");
        j.setCompany("Test Co");
        j.setRequiredSkills(required);
        j.setPreferredSkills(preferred);
        return j;
    }
}
