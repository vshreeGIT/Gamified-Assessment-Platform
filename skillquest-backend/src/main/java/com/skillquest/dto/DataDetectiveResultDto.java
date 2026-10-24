package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataDetectiveResultDto {
    private String attemptId;
    private String investigationId;
    private String investigationName;
    private int score;
    private int maxScore;
    private int accuracy;
    private boolean passed;
    private int earnedXp;
    private List<String> feedback;
    private LocalDateTime completedAt;
}
