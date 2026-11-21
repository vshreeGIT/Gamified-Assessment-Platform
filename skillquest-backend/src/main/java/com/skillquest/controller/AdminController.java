package com.skillquest.controller;

import com.skillquest.dto.AuthUserDto;
import com.skillquest.dto.ProvisionRequest;
import com.skillquest.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * POST /api/admin/users
     * Creates a new RECRUITER account. Requires ADMIN role.
     * Returns 201 Created with the new account's public identity.
     */
    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuthUserDto> provisionUser(@Valid @RequestBody ProvisionRequest request) {
        AuthUserDto created = adminService.provisionUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
