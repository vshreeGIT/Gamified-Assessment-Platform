package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataDetectiveProgressDto {
    private int progress;
    private int completedInvestigations;
    private int attemptCount;
    private int totalXpEarned;
    private Map<String, Integer> investigationProgress;
    private List<DataDetectiveResultDto> latestResults;
}
