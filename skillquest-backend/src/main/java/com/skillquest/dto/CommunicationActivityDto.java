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
public class CommunicationActivityDto {
    private String id;
    private String type;
    private String title;
    private String objective;
    private String scenario;
    private String instructions;
    private String audience;
    private String prompt;
    private List<String> rubricCriteria;
    private CommunicationRoleplayTurnDto currentTurn;
    private List<CommunicationRoleplayMessageDto> conversationHistory;
    private boolean roleplayComplete;
}
