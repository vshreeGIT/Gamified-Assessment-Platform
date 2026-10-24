package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BadgeDto {

    private String id;
    private String name;
    private String icon;
    private String description;
    private boolean earned;
    private String xpText;
    private LocalDateTime earnedAt;
}
