package com.skillquest.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

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
    private int minimumExperienceYears;
    private List<String> requiredSkills;
    private List<String> preferredSkills;
    private Map<String, Integer> skillWeights;
    private String applicationUrl;

    // Computed match fields
    private int matchScore;           // 0-100
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> skillGaps;
    private List<SkillMatchDto> skillBreakdown;
    private String matchExplanation;
    private boolean applied;
    private String applicationStatus;
    private boolean canApply;
    private boolean saved;
}
