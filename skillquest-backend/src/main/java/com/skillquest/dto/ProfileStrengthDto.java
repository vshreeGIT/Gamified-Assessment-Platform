package com.skillquest.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProfileStrengthDto {
    private int strength;           // 0-100
    private boolean hasName;
    private boolean hasEmail;
    private boolean hasPhone;
    private boolean hasCollege;
    private boolean hasDepartment;
    private boolean hasSkills;
    private int xp;
    private int level;
    /** Skills inferred from the candidate's department and XP — used for match scoring. */
    private List<String> inferredSkills;
    /** Human-readable explanation of how skills were derived. */
    private String skillBasis;
}
