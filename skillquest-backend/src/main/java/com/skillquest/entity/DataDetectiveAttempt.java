package com.skillquest.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "data_detective_attempts")
public class DataDetectiveAttempt {
    @Id
    private String id;
    private String userEmail;
    private String investigationId;
    private int score;
    private int maxScore;
    private int accuracy;
    private boolean passed;
    private int earnedXp;
    private Map<String, String> answers;
    private List<String> feedback;
    private LocalDateTime completedAt;
}
