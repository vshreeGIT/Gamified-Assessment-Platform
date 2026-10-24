package com.skillquest.entity;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InterviewCategoryResult {
    private String category;
    private int score;
    private int maxScore;
    private int accuracy;
    private List<String> strengths;
    private List<String> areasToImprove;
}
