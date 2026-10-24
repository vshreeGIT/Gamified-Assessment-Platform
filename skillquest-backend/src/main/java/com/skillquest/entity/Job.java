package com.skillquest.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "jobs")
public class Job {

    @Id
    private String id;

    private String title;
    private String company;
    private String companyLogo;   // emoji
    private String logoColor;     // css class: blue | purple | cyan | pink | orange
    private String description;
    private String location;
    private String workMode;      // Remote | Hybrid | On-site
    private String employmentType; // Internship | Full Time | Part Time
    private String salary;
    private String experienceLevel; // Fresher | 0-1 years | 1-3 years
    private List<String> requiredSkills;
    private List<String> preferredSkills;
    private String applicationUrl;  // null = sample listing
}
