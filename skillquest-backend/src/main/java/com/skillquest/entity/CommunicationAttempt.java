package com.skillquest.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "communication_attempts")
public class CommunicationAttempt {
    @Id
    private String id;
    private String userEmail;
    private int score;
    private int maxScore;
    private int accuracy;
    private boolean passed;
    private int earnedXp;
    private int timeTakenSeconds;
    private Map<String, String> answers;
    private String submissionKey;
    private LocalDateTime completedAt;
    private String subdivisionId;
    private Map<String, String> responses;
    private Map<String, List<String>> roleplayChoices;
    private List<String> strengths;
    private List<String> areasToImprove;
    private int activitiesCompleted;
}
