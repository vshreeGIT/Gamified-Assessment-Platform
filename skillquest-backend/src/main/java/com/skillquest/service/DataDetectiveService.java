package com.skillquest.service;

import com.skillquest.dto.DataDetectiveProgressDto;
import com.skillquest.dto.DataDetectiveResultDto;
import com.skillquest.dto.DataDetectiveSubmitRequest;
import com.skillquest.dto.DataInvestigationDto;

import java.util.List;

public interface DataDetectiveService {
    List<DataInvestigationDto> listInvestigations(String userEmail);
    DataInvestigationDto getInvestigation(String investigationId, String userEmail);
    DataInvestigationDto start(String investigationId, String userEmail);
    DataInvestigationDto getSession(String investigationId, String userEmail, String submissionKey);
    DataDetectiveResultDto submit(String investigationId, String userEmail, DataDetectiveSubmitRequest request);
    DataDetectiveResultDto getAttempt(String attemptId, String userEmail);
    DataDetectiveProgressDto getProgress(String userEmail);
}
