package com.skillquest.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "interview_assessment_sessions")
public class InterviewAssessmentSession {
    @Id private String id;
    private String userEmail;
    private String sessionKey;
    private String status;
    private Instant startedAt;
    private Instant deadlineAt;
    private List<InterviewQuestion> questions;
    @Builder.Default private Map<String, String> draftAnswers = new HashMap<>();
}
