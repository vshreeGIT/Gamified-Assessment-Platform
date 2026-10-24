package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentAttemptDto {

    private String id;
    private String questType;
    private String difficulty;
    private int score;
    private int total;
    private int accuracy;
    private int earnedXp;
    private boolean passed;
    private String badge;
    private LocalDateTime completedAt;
}
