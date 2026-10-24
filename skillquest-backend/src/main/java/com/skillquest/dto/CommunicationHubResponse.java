package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunicationHubResponse {
    private String subdivisionId;
    private String subdivisionName;
    private int durationMinutes;
    private String submissionKey;
    private Instant deadlineAt;
    private List<CommunicationActivityDto> activities;
}
