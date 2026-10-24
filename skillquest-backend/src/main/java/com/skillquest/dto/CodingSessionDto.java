package com.skillquest.dto;

import lombok.*;
import java.time.Instant;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CodingSessionDto {
    private String sessionKey;
    private Instant startedAt;
    private Instant deadlineAt;
}
