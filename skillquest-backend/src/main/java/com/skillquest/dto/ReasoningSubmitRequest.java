package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReasoningSubmitRequest {

    private String difficulty;
    private Map<String, String> answers;
    private int timeTakenSeconds;
    private String submissionKey;
}
