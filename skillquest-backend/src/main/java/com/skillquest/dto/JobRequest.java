package com.skillquest.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Data
public class JobRequest {
    @NotBlank @Size(max = 160)
    private String title;
    @NotBlank @Size(max = 160)
    private String company;
    @Size(max = 12)
    private String companyLogo;
    @Size(max = 30)
    private String logoColor;
    @NotBlank @Size(max = 10000)
    private String description;
    @NotBlank @Size(max = 160)
    private String location;
    @NotBlank @Size(max = 40)
    private String workMode;
    @NotBlank @Size(max = 40)
    private String employmentType;
    @Size(max = 80)
    private String salary;
    @Size(max = 100)
    private String experienceLevel;
    @Min(0) @Max(50)
    private int minimumExperienceYears;
    @Size(max = 40)
    private List<@NotBlank @Size(max = 80) String> requiredSkills = new ArrayList<>();
    @Size(max = 40)
    private List<@NotBlank @Size(max = 80) String> preferredSkills = new ArrayList<>();
    @Size(max = 40)
    private Map<@NotBlank @Size(max = 80) String, @Min(1) @Max(1000) Integer> skillWeights = new LinkedHashMap<>();
}