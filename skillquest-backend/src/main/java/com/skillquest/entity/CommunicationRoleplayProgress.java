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
public class CommunicationRoleplayProgress {
    private String currentTurnId;
    @Builder.Default
    private List<String> choiceIds = new ArrayList<>();
}
