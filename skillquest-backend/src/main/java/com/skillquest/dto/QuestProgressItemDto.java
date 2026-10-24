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
public class QuestProgressItemDto {
    private String status;
    private List<String> missingPrerequisites;
    private int attemptCount;
    private Integer latestAccuracy;
    private boolean passed;
}
