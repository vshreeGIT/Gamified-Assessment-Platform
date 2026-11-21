package com.skillquest.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "recruiter_assessment_assignments")
@CompoundIndex(name = "recruiter_assessment_candidate_unique", def = "{'assessmentId': 1, 'candidateEmail': 1}", unique = true)
public class RecruiterAssessmentAssignment {
    @Id
    private String id;
    private String recruiterEmail;
    private String assessmentId;
    private String candidateEmail;
    private String status;
    private String decision;
    private String notes;
    private LocalDateTime assignedAt;
    private LocalDateTime completedAt;
}
