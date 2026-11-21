package com.skillquest.dto;

import java.util.List;

public record RecruiterAssessmentQuestionDto(
        String id,
        String type,
        String prompt,
        List<String> options,
        List<String> correctAnswers,
        int marks) {
}