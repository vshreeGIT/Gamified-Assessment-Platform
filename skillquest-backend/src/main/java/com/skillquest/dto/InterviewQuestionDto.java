package com.skillquest.dto;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InterviewQuestionDto {
    private String id;
    private String category;
    private String type;
    private String prompt;
    private List<InterviewChoiceDto> choices;
}
