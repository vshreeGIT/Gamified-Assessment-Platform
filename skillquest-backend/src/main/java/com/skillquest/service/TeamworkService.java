package com.skillquest.service;

import com.skillquest.dto.TeamworkQuizResponse;
import com.skillquest.dto.TeamworkResultDto;
import com.skillquest.dto.TeamworkSubmitRequest;
import com.skillquest.dto.TeamworkResultDto;

public interface TeamworkService {
    TeamworkQuizResponse start(String email);
    TeamworkQuizResponse resume(String email, String submissionKey);
    TeamworkResultDto submit(String email, TeamworkSubmitRequest request);
    TeamworkResultDto getAttempt(String email, String attemptId);
}
