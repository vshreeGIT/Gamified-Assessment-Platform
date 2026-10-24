package com.skillquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardItemDto {

    private int rank;
    private String name;
    private String avatar;
    private int xp;
    private String level;
    private boolean currentUser;
}
