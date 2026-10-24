package com.skillquest.util;

import com.skillquest.entity.User;

/**
 * Single source of truth for the profile-strength score.
 *
 * Weights (total 100):
 *   Full name   15 pts
 *   Email       15 pts
 *   Phone       15 pts
 *   College     15 pts
 *   Department  15 pts
 *   Skills (≥1) 25 pts
 */
public final class ProfileStrengthCalculator {

    private ProfileStrengthCalculator() {}

    public static int calculate(User user) {
        int score = 0;
        if (user.getFullName()   != null && !user.getFullName().isBlank())   score += 15;
        if (user.getEmail()      != null && !user.getEmail().isBlank())      score += 15;
        if (user.getPhone()      != null && !user.getPhone().isBlank())      score += 15;
        if (user.getCollege()    != null && !user.getCollege().isBlank())    score += 15;
        if (user.getDepartment() != null && !user.getDepartment().isBlank()) score += 15;
        if (user.getSkills()     != null && !user.getSkills().isEmpty())     score += 25;
        return score;
    }
}
