package com.skillquest.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Map;

import com.skillquest.dto.RegisterRequest;
import com.skillquest.service.UserService;
import com.skillquest.dto.LoginRequest;
import com.skillquest.dto.LoginResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(userService.register(request));

    }
    @PostMapping("/login")
public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

    return ResponseEntity.ok(userService.login(request));

}

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(Principal principal) {
        return ResponseEntity.ok(Map.of("user", userService.getAuthenticatedUser(principal.getName())));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Boolean>> logout() {
        // JWTs are stateless; the client completes logout by discarding its token.
        return ResponseEntity.ok(Map.of("success", true));
    }

}
