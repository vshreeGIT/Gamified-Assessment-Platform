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
public class CommunicationQuizResponse {
    private int questionCount;
    private int durationMinutes;
    private int baseXP;
    private String submissionKey;
    private Instant deadlineAt;
    private List<CommunicationQuestionDto> questions;
}
