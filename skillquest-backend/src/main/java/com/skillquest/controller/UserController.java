package com.skillquest.controller;

import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.skillquest.dto.UpdateProfileRequest;
import com.skillquest.dto.UserProfileResponse;
import com.skillquest.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> profile(Principal principal) {
        return ResponseEntity.ok(userService.getProfile(principal.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            Principal principal,
            @RequestBody UpdateProfileRequest request) {
        // Identity is always derived from the authenticated JWT — never from the request body.
        return ResponseEntity.ok(userService.updateProfile(principal.getName(), request));
    }
}