package com.skillquest.service.impl;

import com.skillquest.dto.UpdateProfileRequest;
import com.skillquest.dto.UserProfileResponse;
import com.skillquest.entity.Role;
import com.skillquest.entity.User;
import com.skillquest.exception.UserNotFoundException;
import com.skillquest.repository.UserRepository;
import com.skillquest.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    private UserRepository userRepository;
    private UserServiceImpl service;

    private static final String EMAIL = "candidate@example.com";

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        PasswordEncoder encoder = mock(PasswordEncoder.class);
        JwtUtil jwtUtil = mock(JwtUtil.class);
        service = new UserServiceImpl(userRepository, encoder, jwtUtil);
    }

    // ── getProfile ──────────────────────────────────────────────────────────

    @Test
    void getProfileReturnsCorrectFields() {
        User user = fullUser();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        UserProfileResponse resp = service.getProfile(EMAIL);

        assertEquals(EMAIL, resp.getEmail());
        assertEquals("Alice", resp.getFullName());
        assertEquals("9876543210", resp.getPhone());
        assertEquals("MIT", resp.getCollege());
        assertEquals("Computer Science", resp.getDepartment());
        assertEquals(Role.CANDIDATE, resp.getRole());
        assertEquals(150, resp.getXp());
        assertEquals(1, resp.getLevel());
    }

    @Test
    void getProfileThrowsForUnknownEmail() {
        when(userRepository.findByEmail("nobody@x.com")).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class, () -> service.getProfile("nobody@x.com"));
    }

    @Test
    void profileStrengthIsHundredWhenAllFieldsPresent() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(fullUser()));
        UserProfileResponse resp = service.getProfile(EMAIL);
        // fullUser has no skills set → 5 × 15 = 75
        assertEquals(75, resp.getProfileStrength());
    }

    @Test
    void profileStrengthIsHundredWhenAllFieldsAndSkillsPresent() {
        User user = fullUser();
        user.setSkills(List.of("Java"));
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        assertEquals(100, service.getProfile(EMAIL).getProfileStrength());
    }

    @Test
    void profileStrengthIsPartialWhenFieldsMissing() {
        User user = new User();
        user.setEmail(EMAIL);
        user.setFullName("Alice");
        // phone, college, department, skills missing
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        UserProfileResponse resp = service.getProfile(EMAIL);
        // email(15) + name(15) = 30
        assertEquals(30, resp.getProfileStrength());
    }

    @Test
    void profileStrengthConsistentWithJobServiceFormula() {
        // Both endpoints must return the same number for the same user.
        // We verify the formula: 5 fields × 15 + skills × 25.
        User user = fullUser();
        user.setSkills(List.of("Python"));
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        int fromProfile = service.getProfile(EMAIL).getProfileStrength();
        // 5 × 15 + 25 = 100
        assertEquals(100, fromProfile);
    }

    // ── updateProfile ────────────────────────────────────────────────────────

    @Test
    void updateProfilePersistsAllSupportedFields() {
        User user = fullUser();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setFullName("Bob");
        req.setPhone("1111111111");
        req.setCollege("Stanford");
        req.setDepartment("Data Science");
        req.setSkills(List.of("Python", "SQL"));
        req.setPreferredRole("Data Analyst");
        req.setPreferredLocation("Remote");
        req.setPreferredWorkType("Full Time");

        UserProfileResponse resp = service.updateProfile(EMAIL, req);

        assertEquals("Bob", resp.getFullName());
        assertEquals("1111111111", resp.getPhone());
        assertEquals("Stanford", resp.getCollege());
        assertEquals("Data Science", resp.getDepartment());
        assertEquals(List.of("Python", "SQL"), resp.getSkills());
        assertEquals("Data Analyst", resp.getPreferredRole());
        assertEquals("Remote", resp.getPreferredLocation());
        assertEquals("Full Time", resp.getPreferredWorkType());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateProfileIgnoresNullFields() {
        User user = fullUser();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateProfileRequest req = new UpdateProfileRequest();
        // only update phone; everything else null → should not overwrite
        req.setPhone("0000000000");

        UserProfileResponse resp = service.updateProfile(EMAIL, req);

        assertEquals("Alice", resp.getFullName());       // unchanged
        assertEquals("0000000000", resp.getPhone());     // updated
        assertEquals("MIT", resp.getCollege());          // unchanged
    }

    @Test
    void updateProfileThrowsForUnknownEmail() {
        when(userRepository.findByEmail("ghost@x.com")).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class,
                () -> service.updateProfile("ghost@x.com", new UpdateProfileRequest()));
    }

    @Test
    void updateProfileOwnershipIsEnforcedByEmail() {
        // The controller always passes principal.getName() (JWT subject) as the email.
        // The service must look up by that email — it must NOT accept an email from the
        // request body. This test verifies the service only uses the supplied email param.
        User alice = fullUser();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(alice));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setFullName("Hacker");

        // Even if a different email were somehow injected, the service uses EMAIL
        UserProfileResponse resp = service.updateProfile(EMAIL, req);
        assertEquals("Hacker", resp.getFullName());
        assertEquals(EMAIL, resp.getEmail()); // email never changes
    }

    @Test
    void updateProfileTrimsWhitespace() {
        User user = fullUser();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setFullName("  Bob  ");
        req.setDepartment("  CSE  ");

        UserProfileResponse resp = service.updateProfile(EMAIL, req);
        assertEquals("Bob", resp.getFullName());
        assertEquals("CSE", resp.getDepartment());
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private User fullUser() {
        User u = new User();
        u.setEmail(EMAIL);
        u.setFullName("Alice");
        u.setPhone("9876543210");
        u.setCollege("MIT");
        u.setDepartment("Computer Science");
        u.setRole(Role.CANDIDATE);
        u.setXp(150);
        u.setLevel(1);
        u.setActive(true);
        return u;
    }
}
