package com.skillquest.service;

import com.skillquest.dto.CommunicationQuizResponse;
import com.skillquest.dto.CommunicationResultResponse;
import com.skillquest.dto.CommunicationSubmitRequest;

public interface CommunicationService {
    CommunicationQuizResponse startAssessment(String userEmail);

    CommunicationQuizResponse getAssessment(String userEmail, String submissionKey);

    CommunicationResultResponse submitAssessment(String userEmail, CommunicationSubmitRequest request);
}
