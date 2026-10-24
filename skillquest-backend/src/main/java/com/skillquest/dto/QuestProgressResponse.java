package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestProgressResponse {
    private Map<String, QuestProgressItemDto> quests;
    private int totalXp;
    private int requiredXp;
    private int completedRequiredQuests;
    private int requiredQuestCount;
    private boolean interviewProgressionBypassed;
}
