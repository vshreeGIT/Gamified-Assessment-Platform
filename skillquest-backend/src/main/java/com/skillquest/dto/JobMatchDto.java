package com.skillquest.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class JobMatchDto {

    private String id;
    private String title;
    private String company;
    private String companyLogo;
    private String logoColor;
    private String description;
    private String location;
    private String workMode;
    private String employmentType;
    private String salary;
    private String experienceLevel;
    private List<String> requiredSkills;
    private List<String> preferredSkills;
    private String applicationUrl;

    // Computed match fields
    private int matchScore;           // 0-100
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private boolean saved;
}
