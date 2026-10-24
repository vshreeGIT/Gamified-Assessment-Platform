package com.skillquest.repository;

public interface UserXpAwardRepository {
    boolean awardInterviewXpOnce(String email, String attemptKey, int xp);
}
