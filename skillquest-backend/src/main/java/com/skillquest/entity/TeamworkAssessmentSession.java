package com.skillquest.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "teamwork_assessment_sessions")
public class TeamworkAssessmentSession {
    @Id private String id;
    private String userEmail;
    private String submissionKey;
    private String status;
    private Instant startedAt;
}
