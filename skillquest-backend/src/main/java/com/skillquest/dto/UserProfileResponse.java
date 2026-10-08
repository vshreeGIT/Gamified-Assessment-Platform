package com.skillquest.dto;

import com.skillquest.entity.Role;
import lombok.Data;

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
}