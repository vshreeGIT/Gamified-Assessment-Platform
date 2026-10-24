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
@Document(collection = "communication_activities")
public class CommunicationActivity {
    @Id
    private String id;
    private String subdivisionId;
    private String type;
    private String title;
    private String objective;
    private String scenario;
    private String instructions;
    private String audience;
    private String prompt;
    private List<CommunicationRubricCriterion> rubric;
    private String firstTurnId;
    private List<CommunicationRoleplayTurn> turns;
}
