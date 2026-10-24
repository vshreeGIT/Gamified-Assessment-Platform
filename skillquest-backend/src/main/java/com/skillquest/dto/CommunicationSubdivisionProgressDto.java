package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunicationSubdivisionProgressDto {
    private String subdivisionId;
    private String subdivisionName;
    private int progress;
    private boolean attempted;
    private boolean passed;
    private int attemptCount;
    private int bestAccuracy;
    private int earnedXp;
    private String latestAttemptId;
    private String bestAttemptId;
}
