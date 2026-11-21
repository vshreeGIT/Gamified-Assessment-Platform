package com.skillquest.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Results for recruiter-created assessments are isolated from the candidate quest
 * attempt collections. A later candidate assignment flow can write these records.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "recruiter_assessment_submissions")
public class RecruiterAssessmentSubmission {
    @Id
    private String id;
    private String recruiterEmail;
    private String assessmentId;
    private String candidateEmail;
    private Integer score;
    private Integer passedTests;
    private Integer totalTests;
    private Integer durationSeconds;
    private Long startedAtEpochMillis;
    private String status;
    private LocalDateTime completedAt;
    private Integer attemptNumber;
    @Indexed(unique = true, sparse = true)
    private String submissionKey;
    @Builder.Default
    private Map<String, Object> answers = new LinkedHashMap<>();
}
