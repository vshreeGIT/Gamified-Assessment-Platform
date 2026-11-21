package com.skillquest.repository;

import com.skillquest.entity.RecruiterAssessmentAssignment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RecruiterAssessmentAssignmentRepository extends MongoRepository<RecruiterAssessmentAssignment, String> {
    List<RecruiterAssessmentAssignment> findAllByRecruiterEmailOrderByAssignedAtDesc(String recruiterEmail);
    List<RecruiterAssessmentAssignment> findAllByRecruiterEmailAndAssessmentId(String recruiterEmail, String assessmentId);
    List<RecruiterAssessmentAssignment> findAllByCandidateEmail(String candidateEmail);
    Optional<RecruiterAssessmentAssignment> findByIdAndRecruiterEmail(String id, String recruiterEmail);
    Optional<RecruiterAssessmentAssignment> findByAssessmentIdAndCandidateEmail(String assessmentId, String candidateEmail);
    Optional<RecruiterAssessmentAssignment> findByRecruiterEmailAndAssessmentIdAndCandidateEmail(String recruiterEmail, String assessmentId, String candidateEmail);
    long countByRecruiterEmail(String recruiterEmail);
    long countByRecruiterEmailAndStatus(String recruiterEmail, String status);
    void deleteAllByAssessmentIdAndRecruiterEmail(String assessmentId, String recruiterEmail);
}
