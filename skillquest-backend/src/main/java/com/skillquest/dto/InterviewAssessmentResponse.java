package com.skillquest.dto;

import lombok.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InterviewAssessmentResponse {
    private String sessionKey;
    private String role;
    private String status;
    private Instant startedAt;
    private Instant deadlineAt;
    private int durationMinutes;
    private List<InterviewQuestionDto> questions;
    private Map<String, String> draftAnswers;
}
