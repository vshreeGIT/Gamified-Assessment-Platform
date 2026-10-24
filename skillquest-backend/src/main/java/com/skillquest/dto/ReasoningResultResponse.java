package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReasoningResultResponse {

    private int score;
    private int totalQuestions;
    private int accuracy;
    private boolean passed;
    private int earnedXp;
    private String badge;
    private int timeTakenSeconds;
    private int correctAnswers;
    private int wrongAnswers;
    private String message;
}
