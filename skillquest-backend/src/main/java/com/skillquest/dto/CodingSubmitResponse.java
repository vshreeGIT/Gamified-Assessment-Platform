package com.skillquest.dto;

import lombok.*;
import java.time.Instant;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CodingSubmitResponse {
    private String attemptId;
    private Instant completedAt;
    private String message;
}
