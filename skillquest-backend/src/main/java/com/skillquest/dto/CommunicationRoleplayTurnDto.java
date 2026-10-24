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
public class CommunicationRoleplayTurnDto {
    private String message;
    private List<CommunicationRoleplayChoiceDto> choices;
    private boolean complete;
}
