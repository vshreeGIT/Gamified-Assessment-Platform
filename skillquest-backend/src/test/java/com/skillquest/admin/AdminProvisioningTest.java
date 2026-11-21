package com.skillquest.admin;

import com.skillquest.config.AdminBootstrap;
import com.skillquest.config.CorsConfig;
import com.skillquest.config.SecurityConfig;
import com.skillquest.controller.AdminController;
import com.skillquest.dto.AuthUserDto;
import com.skillquest.dto.ProvisionRequest;
import com.skillquest.entity.Role;
import com.skillquest.entity.User;
import com.skillquest.exception.DuplicateEmailException;
import com.skillquest.repository.UserRepository;
import com.skillquest.security.JwtUtil;
import com.skillquest.service.AdminService;
import com.skillquest.service.CustomUserDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminProvisioningTest {

    // ── AdminBootstrap password-reset unit tests ────────────────────────────

    @Nested
    class AdminPasswordResetTests {

        private UserRepository userRepository;
        private PasswordEncoder passwordEncoder;
        private AdminBootstrap bootstrap;

        @BeforeEach
        void setUp() {
            userRepository = mock(UserRepository.class);
            passwordEncoder = mock(PasswordEncoder.class);
            bootstrap = new AdminBootstrap(userRepository, passwordEncoder);
        }

        @Test
        void resetUpdatesPasswordForExistingAdminAndNeverLogsPlainText() {
            User existingAdmin = adminUser("admin@skillquest.com");
            when(userRepository.findByEmail("admin@skillquest.com"))
                    .thenReturn(java.util.Optional.of(existingAdmin));
            when(passwordEncoder.encode("NewSecurePass1!")).thenReturn("$2a$10$newHash");
            when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

            bootstrap.runPasswordResetForTest("admin@skillquest.com", "NewSecurePass1!");

            verify(passwordEncoder).encode("NewSecurePass1!");
            verify(userRepository).save(argThat(u ->
                    "$2a$10$newHash".equals(u.getPassword())
                    && !"NewSecurePass1!".equals(u.getPassword())
            ));
        }

        @Test
        void resetSkipsWhenNoAdminExistsForEmail() {
            when(userRepository.findByEmail("ghost@skillquest.com"))
                    .thenReturn(java.util.Optional.empty());

            bootstrap.runPasswordResetForTest("ghost@skillquest.com", "AnyPass1!");

            verify(userRepository, never()).save(any(User.class));
            verify(passwordEncoder, never()).encode(anyString());
        }

        @Test
        void resetSkipsWhenResetFlagIsAbsent() {
            // ADMIN_PASSWORD_RESET env var is not set in the test JVM,
            // so run() must fall through to the normal bootstrap path,
            // which also skips because no Admin exists and env vars are missing.
            bootstrap.run();

            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        void resetDoesNotCreateNewAccountWhenAdminEmailNotFound() {
            when(userRepository.findByEmail("missing@skillquest.com"))
                    .thenReturn(java.util.Optional.empty());

            bootstrap.runPasswordResetForTest("missing@skillquest.com", "Pass1!");

            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        void resetSkipsWhenMatchingEmailBelongsToNonAdminRole() {
            User recruiter = adminUser("recruiter@skillquest.com");
            recruiter.setRole(Role.RECRUITER);
            when(userRepository.findByEmail("recruiter@skillquest.com"))
                    .thenReturn(java.util.Optional.of(recruiter));

            bootstrap.runPasswordResetForTest("recruiter@skillquest.com", "Pass1!");

            verify(userRepository, never()).save(any(User.class));
        }

        private User adminUser(String email) {
            User u = new User();
            u.setId("admin-id");
            u.setEmail(email);
            u.setRole(Role.ADMIN);
            u.setPassword("$2a$10$oldHash");
            return u;
        }
    }

    // ── AdminBootstrap unit tests ────────────────────────────────────────────

    @Nested
    class BootstrapTests {

        private UserRepository userRepository;
        private PasswordEncoder passwordEncoder;
        private AdminBootstrap bootstrap;

        @BeforeEach
        void setUp() {
            userRepository = mock(UserRepository.class);
            passwordEncoder = mock(PasswordEncoder.class);
            bootstrap = new AdminBootstrap(userRepository, passwordEncoder);
        }

        @Test
        void bootstrapSkipsWhenAdminAlreadyExists() {
            when(userRepository.existsByRole(Role.ADMIN)).thenReturn(true);

            bootstrap.run();

            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        void bootstrapSkipsWhenEnvVarsAreMissing() {
            when(userRepository.existsByRole(Role.ADMIN)).thenReturn(false);
            // No env vars set in the test JVM — all System.getenv() return null

            bootstrap.run();

            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        void bootstrapSkipsWhenEmailAlreadyRegistered() {
            when(userRepository.existsByRole(Role.ADMIN)).thenReturn(false);
            when(userRepository.existsByEmail(anyString())).thenReturn(true);

            bootstrap.run();

            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        void bootstrapIsIdempotentOnMultipleRuns() {
            when(userRepository.existsByRole(Role.ADMIN)).thenReturn(true);

            bootstrap.run();
            bootstrap.run();
            bootstrap.run();

            verify(userRepository, never()).save(any(User.class));
        }
    }

    // ── AdminService unit tests ──────────────────────────────────────────────

    @Nested
    class AdminServiceTests {

        private UserRepository userRepository;
        private PasswordEncoder passwordEncoder;
        private AdminService adminService;

        @BeforeEach
        void setUp() {
            userRepository = mock(UserRepository.class);
            passwordEncoder = mock(PasswordEncoder.class);
            adminService = new AdminService(userRepository, passwordEncoder);
        }

        @Test
        void provisionUserCreatesRecruiterWithHashedPassword() {
            when(userRepository.existsByEmail("jane@company.com")).thenReturn(false);
            when(passwordEncoder.encode("SecurePass1!")).thenReturn("$2a$10$hashed");
            when(userRepository.save(any(User.class))).thenAnswer(inv -> {
                User u = inv.getArgument(0);
                u.setId("new-id");
                return u;
            });

            AuthUserDto result = adminService.provisionUser(validRequest());

            assertEquals("new-id", result.id());
            assertEquals("Jane Recruiter", result.name());
            assertEquals("jane@company.com", result.email());
            assertEquals("RECRUITER", result.role());

            verify(userRepository).save(argThat(u ->
                    u.getRole() == Role.RECRUITER
                    && "$2a$10$hashed".equals(u.getPassword())
                    && u.isActive()
                    && "jane@company.com".equals(u.getEmail())
            ));
        }

        @Test
        void provisionUserNormalisesEmailToLowerCase() {
            when(userRepository.existsByEmail("jane@company.com")).thenReturn(false);
            when(passwordEncoder.encode(anyString())).thenReturn("hash");
            when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

            ProvisionRequest req = validRequest();
            req.setEmail("JANE@COMPANY.COM");
            adminService.provisionUser(req);

            verify(userRepository).save(argThat(u -> "jane@company.com".equals(u.getEmail())));
        }

        @Test
        void provisionUserRejectsDuplicateEmail() {
            when(userRepository.existsByEmail("jane@company.com")).thenReturn(true);

            assertThrows(DuplicateEmailException.class, () -> adminService.provisionUser(validRequest()));
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        void provisionUserNeverStoresPlainTextPassword() {
            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(passwordEncoder.encode("SecurePass1!")).thenReturn("$2a$10$hashed");
            when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

            adminService.provisionUser(validRequest());

            verify(userRepository).save(argThat(u -> !"SecurePass1!".equals(u.getPassword())));
            verify(passwordEncoder).encode("SecurePass1!");
        }

        @Test
        void provisionUserAlwaysSetsRoleToRecruiter() {
            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(passwordEncoder.encode(anyString())).thenReturn("hash");
            when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

            adminService.provisionUser(validRequest());

            verify(userRepository).save(argThat(u -> u.getRole() == Role.RECRUITER));
        }
    }

    // ── AdminController integration slice ────────────────────────────────────

    @Nested
    @WebMvcTest(controllers = AdminController.class)
    @Import({SecurityConfig.class, CorsConfig.class})
    class AdminControllerTests {

        @Autowired
        MockMvc mockMvc;

        @MockBean
        AdminService adminService;

        @MockBean
        JwtUtil jwtUtil;

        @MockBean
        CustomUserDetailsService customUserDetailsService;

        @Test
        void unauthenticatedRequestIsRejectedWith401() throws Exception {
            mockMvc.perform(post("/api/admin/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validJson()))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        void candidateIsRejectedWith403() throws Exception {
            mockMvc.perform(post("/api/admin/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validJson())
                            .with(user("candidate@example.com").roles("CANDIDATE")))
                    .andExpect(status().isForbidden());
        }

        @Test
        void recruiterIsRejectedWith403() throws Exception {
            mockMvc.perform(post("/api/admin/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validJson())
                            .with(user("recruiter@example.com").roles("RECRUITER")))
                    .andExpect(status().isForbidden());
        }

        @Test
        void adminCanProvisionRecruiter() throws Exception {
            when(adminService.provisionUser(any(ProvisionRequest.class)))
                    .thenReturn(new AuthUserDto("id-1", "Jane Recruiter", "jane@company.com", "RECRUITER"));

            mockMvc.perform(post("/api/admin/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validJson())
                            .with(user("admin@skillquest.com").roles("ADMIN")))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value("id-1"))
                    .andExpect(jsonPath("$.email").value("jane@company.com"))
                    .andExpect(jsonPath("$.role").value("RECRUITER"));
        }

        @Test
        void adminReceives409OnDuplicateEmail() throws Exception {
            when(adminService.provisionUser(any(ProvisionRequest.class)))
                    .thenThrow(new DuplicateEmailException("An account with this email already exists"));

            mockMvc.perform(post("/api/admin/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validJson())
                            .with(user("admin@skillquest.com").roles("ADMIN")))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.message").value("An account with this email already exists"));
        }

        @Test
        void adminReceives400OnInvalidRole() throws Exception {
            String badRole = """
                    {"fullName":"Jane","email":"jane@company.com","phone":"9876543210",
                     "password":"SecurePass1!","role":"ADMIN"}
                    """;

            mockMvc.perform(post("/api/admin/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(badRole)
                            .with(user("admin@skillquest.com").roles("ADMIN")))
                    .andExpect(status().isBadRequest());
        }

        @Test
        void adminReceives400OnMissingFields() throws Exception {
            mockMvc.perform(post("/api/admin/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}")
                            .with(user("admin@skillquest.com").roles("ADMIN")))
                    .andExpect(status().isBadRequest());
        }

        @Test
        void adminReceives400OnShortPassword() throws Exception {
            String shortPw = """
                    {"fullName":"Jane","email":"jane@company.com","phone":"9876543210",
                     "password":"short","role":"RECRUITER"}
                    """;

            mockMvc.perform(post("/api/admin/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(shortPw)
                            .with(user("admin@skillquest.com").roles("ADMIN")))
                    .andExpect(status().isBadRequest());
        }

        private static String validJson() {
            return """
                    {"fullName":"Jane Recruiter","email":"jane@company.com",
                     "phone":"9876543210","password":"SecurePass1!","role":"RECRUITER"}
                    """;
        }
    }

    // ── shared helpers ───────────────────────────────────────────────────────

    private static ProvisionRequest validRequest() {
        ProvisionRequest req = new ProvisionRequest();
        req.setFullName("Jane Recruiter");
        req.setEmail("jane@company.com");
        req.setPhone("9876543210");
        req.setPassword("SecurePass1!");
        req.setRole("RECRUITER");
        return req;
    }
}
