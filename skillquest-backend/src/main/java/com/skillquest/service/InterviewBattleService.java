package com.skillquest.service;

import com.skillquest.dto.InterviewAssessmentResponse;
import com.skillquest.dto.InterviewResultResponse;
import com.skillquest.dto.InterviewSubmitRequest;
import com.skillquest.dto.InterviewDraftRequest;
import java.util.Optional;

public interface InterviewBattleService {
    InterviewAssessmentResponse start(String email, String role);
    Optional<InterviewAssessmentResponse> getActiveSession(String email);
    InterviewAssessmentResponse saveDraft(String email, InterviewDraftRequest request);
    InterviewResultResponse submit(String email, InterviewSubmitRequest request);
    InterviewResultResponse getAttempt(String email, String attemptId);
}
