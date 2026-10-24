package com.skillquest.dto;

import lombok.*;
import java.time.Instant;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InterviewResultResponse {
    private String attemptId;
    private int score;
    private int maxScore;
    private int accuracy;
    private boolean passed;
    private int earnedXp;
    private Instant completedAt;
    private List<InterviewCategoryResultDto> categoryResults;
    private List<String> feedback;
    private String automatedScoringNote;
}
