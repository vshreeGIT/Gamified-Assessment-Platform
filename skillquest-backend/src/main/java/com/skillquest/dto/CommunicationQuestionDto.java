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
public class CommunicationQuestionDto {
    private String id;
    private String category;
    private String scenario;
    private String prompt;
    private List<CommunicationOptionDto> options;
}
