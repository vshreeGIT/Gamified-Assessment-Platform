package com.skillquest.repository;

import com.skillquest.entity.RecruiterAssessmentSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RecruiterAssessmentSubmissionRepository extends MongoRepository<RecruiterAssessmentSubmission, String> {
    List<RecruiterAssessmentSubmission> findAllByRecruiterEmailOrderByCompletedAtDesc(String recruiterEmail);
    List<RecruiterAssessmentSubmission> findAllByRecruiterEmailAndAssessmentId(String recruiterEmail, String assessmentId);
    List<RecruiterAssessmentSubmission> findAllByRecruiterEmailAndCandidateEmailOrderByCompletedAtDesc(String recruiterEmail, String candidateEmail);
    List<RecruiterAssessmentSubmission> findAllByAssessmentIdAndCandidateEmail(String assessmentId, String candidateEmail);
    List<RecruiterAssessmentSubmission> findAllByCandidateEmailOrderByCompletedAtDesc(String candidateEmail);
        Optional<RecruiterAssessmentSubmission> findBySubmissionKeyAndAssessmentIdAndCandidateEmail(
            String submissionKey, String assessmentId, String candidateEmail);
    long countByAssessmentIdAndCandidateEmail(String assessmentId, String candidateEmail);
    long countByRecruiterEmailAndStatus(String recruiterEmail, String status);
    void deleteAllByRecruiterEmailAndAssessmentId(String recruiterEmail, String assessmentId);
}
