package com.skillquest.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reasoning_questions")
public class ReasoningQuestion {

    @Id
    private String id;

    private String difficulty; // BEGINNER, INTERMEDIATE, ADVANCED

    private String question;

    private String statement;

    private List<String> options;

    private String correctAnswer;

    private String topic;

    private String explanation;
}
