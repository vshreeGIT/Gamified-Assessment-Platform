package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunicationResultResponse {
    private int score;
    private int maxScore;
    private int totalQuestions;
    private int accuracy;
    private boolean passed;
    private int earnedXp;
    private int timeTakenSeconds;
    private String badge;
    private String message;
}
