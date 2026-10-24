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
public class TeamworkQuestionDto {
    private String id;
    private String title;
    private String scenario;
    private String prompt;
    private List<TeamworkChoiceDto> choices;
}
