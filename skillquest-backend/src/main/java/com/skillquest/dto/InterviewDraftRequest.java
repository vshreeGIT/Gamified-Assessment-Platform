package com.skillquest.dto;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import lombok.*;
import java.util.HashMap;
import java.util.Map;

@Data @NoArgsConstructor @AllArgsConstructor
public class InterviewDraftRequest {
    private String sessionKey;
    private Map<String, String> answers = new HashMap<>();
    @JsonAnySetter
    public void rejectUnexpectedField(String ignoredName, Object ignoredValue) {
        throw new IllegalArgumentException("Unexpected draft field.");
    }
}
