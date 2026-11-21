package com.skillquest.config;

import com.skillquest.entity.Role;
import com.skillquest.entity.User;
import com.skillquest.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Locale;

/**
 * Runs once at startup. Two distinct modes, selected by environment variables:
 *
 * ── Normal bootstrap (default) ──────────────────────────────────────────────
 * Creates the first Admin account when no Admin exists in the database.
 * Fully idempotent — safe to restart any number of times.
 *
 *   ADMIN_NAME     – full name of the initial admin
 *   ADMIN_EMAIL    – email address used to log in
 *   ADMIN_PHONE    – contact phone number
 *   ADMIN_PASSWORD – plain-text password (BCrypt-hashed immediately; never stored or logged)
 *
 * ── Password reset (opt-in, disabled by default) ────────────────────────────
 * Updates the password of an existing Admin account. Activated only when
 * ADMIN_PASSWORD_RESET=true is explicitly set alongside ADMIN_EMAIL and
 * ADMIN_PASSWORD. Remove or unset ADMIN_PASSWORD_RESET after the reset.
 *
 *   ADMIN_PASSWORD_RESET=true
 *   ADMIN_EMAIL    – email of the Admin whose password will be changed
 *   ADMIN_PASSWORD – new plain-text password (BCrypt-hashed immediately; never stored or logged)
 */
@Component
public class AdminBootstrap implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminBootstrap(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if ("true".equalsIgnoreCase(System.getenv("ADMIN_PASSWORD_RESET"))) {
            runPasswordReset();
            return;
        }
        runBootstrap();
    }

    // ── password reset ───────────────────────────────────────────────────────

    /**
     * Test hook: exercises the reset logic with caller-supplied values instead
     * of reading environment variables. Visible to tests outside this package;
     * production code always goes through run().
     */
    public void runPasswordResetForTest(String email, String password) {
        applyPasswordReset(email, password);
    }

    private void runPasswordReset() {
        String email    = System.getenv("ADMIN_EMAIL");
        String password = System.getenv("ADMIN_PASSWORD");

        if (isBlank(email) || isBlank(password)) {
            log.warn("AdminBootstrap: ADMIN_PASSWORD_RESET is true but ADMIN_EMAIL or "
                    + "ADMIN_PASSWORD is not set. Reset skipped.");
            return;
        }

        applyPasswordReset(email, password);
    }

    private void applyPasswordReset(String email, String password) {
        String normalisedEmail = email.trim().toLowerCase(Locale.ROOT);

        User admin = userRepository.findByEmail(normalisedEmail)
                .filter(u -> u.getRole() == Role.ADMIN)
                .orElse(null);

        if (admin == null) {
            log.warn("AdminBootstrap: No Admin account found for '{}'. Reset skipped.",
                    normalisedEmail);
            return;
        }

        admin.setPassword(passwordEncoder.encode(password));
        admin.setUpdatedAt(LocalDateTime.now());
        userRepository.save(admin);

        // Log only the email — never the password or its hash.
        log.info("AdminBootstrap: Password reset completed for '{}'.", normalisedEmail);
    }

    // ── first-time bootstrap ─────────────────────────────────────────────────

    private void runBootstrap() {
        if (userRepository.existsByRole(Role.ADMIN)) {
            log.info("AdminBootstrap: Admin account already exists — skipping bootstrap.");
            return;
        }

        String name     = System.getenv("ADMIN_NAME");
        String email    = System.getenv("ADMIN_EMAIL");
        String phone    = System.getenv("ADMIN_PHONE");
        String password = System.getenv("ADMIN_PASSWORD");

        if (isBlank(name) || isBlank(email) || isBlank(phone) || isBlank(password)) {
            log.warn("AdminBootstrap: No Admin account found and bootstrap environment variables "
                    + "(ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD) are not fully set. "
                    + "Set all four variables and restart to create the first Admin account.");
            return;
        }

        if (userRepository.existsByEmail(email.trim().toLowerCase(Locale.ROOT))) {
            log.warn("AdminBootstrap: ADMIN_EMAIL is already registered as a different role. "
                    + "Bootstrap skipped to avoid overwriting an existing account.");
            return;
        }

        User admin = new User();
        admin.setFullName(name.trim());
        admin.setEmail(email.trim().toLowerCase(Locale.ROOT));
        admin.setPhone(phone.trim());
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole(Role.ADMIN);
        admin.setActive(true);
        admin.setXp(0);
        admin.setLevel(1);
        admin.setStreak(0);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());

        userRepository.save(admin);

        // Log only the email — never the password or its hash.
        log.info("AdminBootstrap: First Admin account created for '{}'.", admin.getEmail());
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
