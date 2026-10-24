package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamworkResultDto {
    private String attemptId;
    private int score;
    private int totalQuestions;
    private int accuracy;
    private boolean passed;
    private String message;
}
