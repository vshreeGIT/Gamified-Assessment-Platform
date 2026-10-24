package com.skillquest.service;

import com.skillquest.dto.ReasoningQuizResponse;
import com.skillquest.dto.ReasoningResultResponse;
import com.skillquest.dto.ReasoningSubmitRequest;

public interface ReasoningService {

    ReasoningQuizResponse getQuiz(String difficulty, String userEmail, String submissionKey);

    ReasoningQuizResponse startQuiz(String difficulty, String userEmail);

    ReasoningResultResponse submitQuiz(String userEmail, ReasoningSubmitRequest request);
}
