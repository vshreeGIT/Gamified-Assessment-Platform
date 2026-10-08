package com.skillquest.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
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

        user.setRole(Role.CANDIDATE);

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

    return response;
}
}