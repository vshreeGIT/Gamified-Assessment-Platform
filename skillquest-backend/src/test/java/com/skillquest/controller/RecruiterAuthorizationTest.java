package com.skillquest.controller;

import com.skillquest.config.CorsConfig;
import com.skillquest.config.SecurityConfig;
import com.skillquest.dto.AuthUserDto;
import com.skillquest.service.JobService;
import com.skillquest.security.JwtUtil;
import com.skillquest.service.RecruiterService;
import com.skillquest.service.CustomUserDetailsService;
import com.skillquest.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {RecruiterController.class, RecruiterJobController.class, JobController.class, AuthController.class})
@Import({SecurityConfig.class, CorsConfig.class})
class RecruiterAuthorizationTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RecruiterService recruiterService;

    @MockBean
    private JobService jobService;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void candidateCannotAccessRecruiterApi() throws Exception {
        mockMvc.perform(get("/api/recruiter/dashboard").with(user("candidate@example.com").roles("CANDIDATE")))
                .andExpect(status().isForbidden());
    }

    @Test
    void recruiterCannotAccessCandidateChallengeProgress() throws Exception {
        mockMvc.perform(get("/api/challenges/progress").with(user("recruiter@example.com").roles("RECRUITER")))
                .andExpect(status().isForbidden());
    }

    @Test
    void candidateCannotAccessRecruiterJobManagement() throws Exception {
        mockMvc.perform(get("/api/recruiter/jobs").with(user("candidate@example.com").roles("CANDIDATE")))
                .andExpect(status().isForbidden());
    }

    @Test
    void recruiterCannotAccessCandidateApplications() throws Exception {
        mockMvc.perform(get("/api/jobs/applications").with(user("recruiter@example.com").roles("RECRUITER")))
                .andExpect(status().isForbidden());
    }

    @Test
    void recruiterCanAccessRecruiterApi() throws Exception {
        when(recruiterService.dashboard("recruiter@example.com")).thenReturn(Map.of("metrics", Map.of()));

        mockMvc.perform(get("/api/recruiter/dashboard").with(user("recruiter@example.com").roles("RECRUITER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.metrics").exists());
    }

    @Test
    void adminCanAccessRecruiterApi() throws Exception {
        when(recruiterService.dashboard("admin@example.com")).thenReturn(Map.of("metrics", Map.of()));

        mockMvc.perform(get("/api/recruiter/dashboard").with(user("admin@example.com").roles("ADMIN")))
                .andExpect(status().isOk());
    }

    @Test
    void authMeRequiresAuthenticationAndReturnsExistingUserIdentity() throws Exception {
        mockMvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
        when(userService.getAuthenticatedUser("candidate@example.com"))
                .thenReturn(new AuthUserDto("candidate-id", "Candidate", "candidate@example.com", "CANDIDATE"));

        mockMvc.perform(get("/api/auth/me").with(user("candidate@example.com").roles("CANDIDATE")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("candidate@example.com"))
                .andExpect(jsonPath("$.user.role").value("CANDIDATE"));
    }

    @Test
    void authenticatedLogoutUsesStatelessJwtResponse() throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(user("candidate@example.com").roles("CANDIDATE")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
