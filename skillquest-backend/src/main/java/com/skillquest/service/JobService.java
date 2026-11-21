package com.skillquest.service;

import com.skillquest.dto.JobMatchDto;
import com.skillquest.dto.ProfileStrengthDto;
import com.skillquest.dto.JobApplicationDto;
import com.skillquest.dto.JobApplicationStatusRequest;
import com.skillquest.dto.JobManagementDto;
import com.skillquest.dto.JobRequest;

import java.util.List;
import java.util.Set;

public interface JobService {

    List<JobMatchDto> getJobMatches(String userEmail);

    ProfileStrengthDto getProfileStrength(String userEmail);

    void saveJob(String userEmail, String jobId);

    void unsaveJob(String userEmail, String jobId);

    Set<String> getSavedJobIds(String userEmail);

    JobMatchDto getJobById(String userEmail, String jobId);

    List<JobManagementDto> getRecruiterJobs(String recruiterEmail);

    JobManagementDto createJob(String recruiterEmail, JobRequest request);

    JobManagementDto updateJob(String recruiterEmail, String jobId, JobRequest request);

    JobManagementDto getRecruiterJob(String recruiterEmail, String jobId);

    JobManagementDto setJobStatus(String recruiterEmail, String jobId, String status);

    JobApplicationDto applyToJob(String candidateEmail, String jobId);

    List<JobApplicationDto> getCandidateApplications(String candidateEmail);

    List<JobApplicationDto> getRecruiterApplications(String recruiterEmail, String jobId);

    JobApplicationDto updateApplicationStatus(String recruiterEmail, String jobId, String applicationId,
                                               JobApplicationStatusRequest request);
}
