package com.skillquest.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "teamwork_attempts")
public class TeamworkAttempt {
    @Id private String id;
    private String userEmail;
    private String submissionKey;
    private int score;
    private int totalQuestions;
    private int accuracy;
    private boolean passed;
    private Map<String, String> answers;
    private LocalDateTime completedAt;
}
