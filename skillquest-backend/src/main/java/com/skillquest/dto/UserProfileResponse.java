package com.skillquest.dto;

import com.skillquest.entity.Role;
import lombok.Data;

import java.util.List;

@Data
public class UserProfileResponse {

    private String id;
    private String fullName;
    private String email;
    private String phone;

    private String college;
    private String department;
    private String profileImage;

    private Role role;

    private int xp;
    private int level;
    private int streak;

    private boolean active;

    // Career preferences
    private List<String> skills;
    private String preferredRole;
    private String preferredLocation;
    private String preferredWorkType;

    // Derived
    private boolean hasDepartment;
    private int profileStrength;
}