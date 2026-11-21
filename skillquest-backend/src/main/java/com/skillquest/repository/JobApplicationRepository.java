package com.skillquest.repository;

import com.skillquest.entity.JobApplication;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends MongoRepository<JobApplication, String> {
    Optional<JobApplication> findByJobIdAndCandidateEmail(String jobId, String candidateEmail);
    List<JobApplication> findAllByJobIdOrderByAppliedAtDesc(String jobId);
    List<JobApplication> findAllByCandidateEmailOrderByAppliedAtDesc(String candidateEmail);
    List<JobApplication> findAllByRecruiterEmailAndJobIdOrderByAppliedAtDesc(String recruiterEmail, String jobId);
    long countByJobId(String jobId);
}