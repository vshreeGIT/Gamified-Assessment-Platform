package com.skillquest.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "interview_attempts")
public class InterviewAttempt {
    @Id private String id;
    private String userEmail;
    private String sessionKey;
    private int score;
    private int maxScore;
    private int accuracy;
    private boolean passed;
    private int earnedXp;
    private Map<String, String> answers;
    private List<InterviewCategoryResult> categoryResults;
    private List<String> feedback;
    private Instant completedAt;
}
