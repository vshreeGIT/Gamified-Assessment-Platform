package com.skillquest.entity;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InterviewQuestion {
    private String id;
    private String category;
    private String type;
    private String prompt;
    private List<InterviewChoice> choices;
    private String correctChoiceId;
    private String rationale;
    private List<String> relevanceTerms;
    private List<String> actionTerms;
}
