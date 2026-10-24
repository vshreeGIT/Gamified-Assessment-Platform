package com.skillquest.dto;

import lombok.Data;

import java.util.List;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String phone;
    private String college;
    private String department;
    private List<String> skills;
    private String preferredRole;
    private String preferredLocation;
    private String preferredWorkType;
}
