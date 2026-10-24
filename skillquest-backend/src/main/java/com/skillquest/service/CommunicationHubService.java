package com.skillquest.service;

import com.skillquest.dto.CommunicationHubProgressDto;
import com.skillquest.dto.CommunicationHubResultDto;
import com.skillquest.dto.CommunicationHubResponse;
import com.skillquest.dto.CommunicationHubSubmitRequest;
import com.skillquest.dto.CommunicationActivityDto;
import com.skillquest.dto.CommunicationRoleplayTurnDto;
import com.skillquest.dto.CommunicationRoleplayTurnRequest;

public interface CommunicationHubService {
    java.util.List<CommunicationActivityDto> getActivities(String subdivisionId);
    CommunicationHubResponse start(String email, String subdivisionId);
    CommunicationHubResponse getSession(String email, String subdivisionId, String submissionKey);
    CommunicationRoleplayTurnDto submitRoleplayTurn(String email, String subdivisionId, CommunicationRoleplayTurnRequest request);
    CommunicationHubResultDto submit(String email, String subdivisionId, CommunicationHubSubmitRequest request);
    CommunicationHubResultDto getAttempt(String email, String subdivisionId, String attemptId);
    CommunicationHubProgressDto getProgress(String email);
}
