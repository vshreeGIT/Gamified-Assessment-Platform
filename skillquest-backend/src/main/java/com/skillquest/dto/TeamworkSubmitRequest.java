package com.skillquest.dto;

import lombok.Data;

import java.util.Map;

@Data
public class TeamworkSubmitRequest {
    private String submissionKey;
    private Map<String, String> answers;
}
