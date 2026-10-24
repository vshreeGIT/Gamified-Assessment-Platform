package com.skillquest.service;

import com.skillquest.dto.CodingSessionDto;
import com.skillquest.dto.CodingSubmitRequest;
import com.skillquest.dto.CodingSubmitResponse;

public interface CodingAssessmentService {
    CodingSessionDto start(String email, String language, String concept, String difficulty);
    CodingSubmitResponse submit(String email, String language, String concept, String difficulty, CodingSubmitRequest request);
}
