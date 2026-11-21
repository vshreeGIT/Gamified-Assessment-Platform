package com.skillquest.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "recruiter_assessments")
public class RecruiterAssessment {
    @Id
    private String id;
    private String recruiterEmail;
    private String title;
    private String description;
    private String type;
    private String technology;
    private String instructions;
    private int durationMinutes;
    private LocalDateTime startDate;
    private LocalDateTime deadline;
    private int passingScore;
    private int allowedAttempts;
    private String status;
    @Builder.Default
    private List<String> questionIds = new ArrayList<>();
    @Builder.Default
    private List<RecruiterAssessmentQuestion> questions = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
