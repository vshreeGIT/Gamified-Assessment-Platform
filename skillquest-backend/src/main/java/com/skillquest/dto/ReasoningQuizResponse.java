package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReasoningQuizResponse {

    private String difficulty;
    private int questionCount;
    private int durationMinutes;
    private int baseXP;
    private List<ReasoningQuestionDto> questions;
    private String submissionKey;
    private Instant deadlineAt;
}
