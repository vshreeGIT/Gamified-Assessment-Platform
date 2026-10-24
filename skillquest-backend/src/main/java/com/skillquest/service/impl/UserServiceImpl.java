package com.skillquest.service.impl;

import com.skillquest.util.ProfileStrengthCalculator;
import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.skillquest.dto.UpdateProfileRequest;
import com.skillquest.dto.UserProfileResponse;
import com.skillquest.dto.LoginRequest;
import com.skillquest.dto.LoginResponse;
import com.skillquest.dto.RegisterRequest;
import com.skillquest.entity.Role;
import com.skillquest.entity.User;
import com.skillquest.exception.DuplicateEmailException;
import com.skillquest.exception.InvalidCredentialsException;
import com.skillquest.exception.UserNotFoundException;
import com.skillquest.repository.UserRepository;
import com.skillquest.security.JwtUtil;
import com.skillquest.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already exists");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        // Encrypt password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setCollege(request.getCollege());
        user.setDepartment(request.getDepartment());

        if (request.getRole() != null && request.getRole().equalsIgnoreCase("RECRUITER")) {
            user.setRole(Role.RECRUITER);
        } else {
            user.setRole(Role.CANDIDATE);
        }

        user.setXp(0);
        user.setLevel(1);
        user.setStreak(0);

        user.setActive(true);

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        return "Registration Successful";
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                user.getFullName(),
                user.getRole().name()
        );
    }
    @Override
public UserProfileResponse getProfile(String email) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found"));

    return toResponse(user);
}

    @Override
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (request.getFullName() != null) user.setFullName(request.getFullName().trim());
        if (request.getPhone() != null) user.setPhone(request.getPhone().trim());
        if (request.getCollege() != null) user.setCollege(request.getCollege().trim());
        if (request.getDepartment() != null) user.setDepartment(request.getDepartment().trim());
        if (request.getSkills() != null) user.setSkills(request.getSkills());
        if (request.getPreferredRole() != null) user.setPreferredRole(request.getPreferredRole().trim());
        if (request.getPreferredLocation() != null) user.setPreferredLocation(request.getPreferredLocation().trim());
        if (request.getPreferredWorkType() != null) user.setPreferredWorkType(request.getPreferredWorkType().trim());

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return toResponse(user);
    }

    private UserProfileResponse toResponse(User user) {
        boolean hasDept    = user.getDepartment() != null && !user.getDepartment().isBlank();
        int strength = ProfileStrengthCalculator.calculate(user);

        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setCollege(user.getCollege());
        response.setDepartment(user.getDepartment());
        response.setProfileImage(user.getProfileImage());
        response.setRole(user.getRole());
        response.setXp(user.getXp());
        response.setLevel(user.getLevel());
        response.setStreak(user.getStreak());
        response.setActive(user.isActive());
        response.setSkills(user.getSkills());
        response.setPreferredRole(user.getPreferredRole());
        response.setPreferredLocation(user.getPreferredLocation());
        response.setPreferredWorkType(user.getPreferredWorkType());
        response.setHasDepartment(hasDept);
        response.setProfileStrength(strength);
        return response;
    }
}