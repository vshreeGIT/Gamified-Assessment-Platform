package com.skillquest.service;

import com.skillquest.dto.QuestProgressResponse;

public interface QuestProgressService {
    QuestProgressResponse getProgress(String email);
    void requireInterviewUnlocked(String email);
}
