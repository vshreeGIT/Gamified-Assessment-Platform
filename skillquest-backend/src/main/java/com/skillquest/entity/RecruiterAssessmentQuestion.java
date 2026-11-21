package com.skillquest.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruiterAssessmentQuestion {
    private String id;
    private String type;
    private String prompt;
    @Builder.Default
    private List<String> options = new ArrayList<>();
    @Builder.Default
    private List<String> correctAnswers = new ArrayList<>();
    private int marks;
}