package com.skillquest.service;

import com.skillquest.dto.AuthUserDto;
import com.skillquest.dto.ProvisionRequest;
import com.skillquest.entity.Role;
import com.skillquest.entity.User;
import com.skillquest.exception.DuplicateEmailException;
import com.skillquest.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Creates a new RECRUITER account on behalf of an authenticated Admin.
     * Passwords are BCrypt-hashed; plain-text is never stored or logged.
     */
    public AuthUserDto provisionUser(ProvisionRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException("An account with this email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.RECRUITER);
        user.setActive(true);
        user.setXp(0);
        user.setLevel(1);
        user.setStreak(0);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        return new AuthUserDto(saved.getId(), saved.getFullName(), saved.getEmail(), saved.getRole().name());
    }
}
