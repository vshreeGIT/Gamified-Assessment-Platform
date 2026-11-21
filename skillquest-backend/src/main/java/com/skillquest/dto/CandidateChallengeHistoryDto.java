package com.skillquest.dto;

import java.time.Instant;

public record CandidateChallengeHistoryDto(
        String module,
        Integer score,
        Boolean passed,
        Instant completedAt,
        boolean evaluated) {
}