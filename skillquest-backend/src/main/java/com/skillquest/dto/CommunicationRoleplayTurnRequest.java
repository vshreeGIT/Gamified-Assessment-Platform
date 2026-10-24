package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunicationRoleplayTurnRequest {
    private String submissionKey;
    private String activityId;
    private String choiceId;
}
