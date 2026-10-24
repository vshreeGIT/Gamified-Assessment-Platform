package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataInvestigationDto {
    private String id;
    private String title;
    private String description;
    private List<String> columns;
    private List<Map<String, Object>> rows;
    private List<DataTaskDto> tasks;
    private int durationMinutes;
    private int maxXp;
    private String submissionKey;
    private Instant deadlineAt;
}
