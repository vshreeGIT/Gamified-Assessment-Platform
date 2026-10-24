package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunicationHubResultDto {
    private String attemptId;
    private String subdivisionId;
    private String subdivisionName;
    private int score;
    private int maxScore;
    private int accuracy;
    private boolean passed;
    private int earnedXp;
    private int activitiesCompleted;
    private List<String> strengths;
    private List<String> areasToImprove;
    private String message;
}
