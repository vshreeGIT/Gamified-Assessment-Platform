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
@Document(collection = "communication_questions")
public class CommunicationQuestion {
    @Id
    private String id;
    private String category;
    private String scenario;
    private String prompt;
    private List<CommunicationOption> options;
}
