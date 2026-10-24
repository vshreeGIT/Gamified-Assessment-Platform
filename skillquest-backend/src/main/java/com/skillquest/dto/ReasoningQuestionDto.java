package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReasoningQuestionDto {

    private String id;
    private String question;
    private String statement;
    private List<String> options;
    private String topic;
}
