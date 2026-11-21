package com.skillquest.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record JobManagementDto(
        String id,
        String title,
        String company,
        String companyLogo,
        String logoColor,
        String description,
        String location,
        String workMode,
        String employmentType,
        String salary,
        String experienceLevel,
        int minimumExperienceYears,
        List<String> requiredSkills,
        List<String> preferredSkills,
        Map<String, Integer> skillWeights,
        String status,
        LocalDateTime createdAt,
        long applicationCount) {
}