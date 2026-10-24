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
public class TeamworkQuizResponse {
    private String submissionKey;
    private Instant startedAt;
    private List<TeamworkQuestionDto> questions;
}
