package com.skillquest.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "coding_assessment_sessions")
public class CodingAssessmentSession {
    @Id private String id;
    private String userEmail;
    private String sessionKey;
    private String language;
    private String concept;
    private String difficulty;
    private Instant startedAt;
    private Instant deadlineAt;
    private String status;
}
