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
public class CommunicationHubProgressDto {
    private int completedSubdivisions;
    private int totalSubdivisions;
    private int progress;
    private int attemptCount;
    private int totalXpEarned;
    private boolean communicationPro;
    private List<CommunicationSubdivisionProgressDto> subdivisions;
}
