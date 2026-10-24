package com.skillquest.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reasoning_assessment_sessions")
public class ReasoningAssessmentSession {

    @Id
    private String id;

    private String userEmail;
    private String difficulty;
    private String submissionKey;
    private String status;
    private Instant startedAt;
    private Instant deadlineAt;
    private List<ReasoningQuestion> questions;
}
