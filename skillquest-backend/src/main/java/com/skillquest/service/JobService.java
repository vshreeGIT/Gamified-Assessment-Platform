package com.skillquest.service;

import com.skillquest.dto.JobMatchDto;
import com.skillquest.dto.ProfileStrengthDto;

import java.util.List;
import java.util.Set;

public interface JobService {

    List<JobMatchDto> getJobMatches(String userEmail);

    ProfileStrengthDto getProfileStrength(String userEmail);

    void saveJob(String userEmail, String jobId);

    void unsaveJob(String userEmail, String jobId);

    Set<String> getSavedJobIds(String userEmail);

    JobMatchDto getJobById(String userEmail, String jobId);
}
