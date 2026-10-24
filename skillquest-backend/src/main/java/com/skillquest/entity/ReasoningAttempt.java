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
@Document(collection = "reasoning_attempts")
public class ReasoningAttempt {

    @Id
    private String id;

    private String userEmail;

    private String difficulty;

    private int score;

    private int totalQuestions;

    private int accuracy;

    private boolean passed;

    private int earnedXp;

    private String badge;

    private int timeTakenSeconds;

    private Map<String, String> answers;

    private String submissionKey;

    private LocalDateTime completedAt;
}
