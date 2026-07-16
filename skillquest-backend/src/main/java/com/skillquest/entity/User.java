package com.skillquest.entity;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    // Personal Details
    private String fullName;
    private String email;
    private String phone;

    // Authentication
    private String password;
    private Role role;

    // Profile
    private String college;
    private String department;
    private String profileImage;

    // Gamification
    private int xp;
    private int level;
    private int streak;

    // Status
    private boolean active;

    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}