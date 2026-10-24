package com.skillquest.entity;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    // Career preferences
    private List<String> skills;
    private String preferredRole;
    private String preferredLocation;
    private String preferredWorkType;

    // Gamification
    private int xp;
    private int level;
    private int streak;
    private Set<String> interviewBattleXpRewardKeys = new HashSet<>();

    // Status
    private boolean active;

    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
