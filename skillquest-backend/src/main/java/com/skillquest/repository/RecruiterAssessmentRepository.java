package com.skillquest.repository;

import com.skillquest.entity.RecruiterAssessment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RecruiterAssessmentRepository extends MongoRepository<RecruiterAssessment, String> {
    List<RecruiterAssessment> findAllByRecruiterEmailOrderByCreatedAtDesc(String recruiterEmail);
    Optional<RecruiterAssessment> findByIdAndRecruiterEmail(String id, String recruiterEmail);
    long countByRecruiterEmail(String recruiterEmail);
    long countByRecruiterEmailAndStatus(String recruiterEmail, String status);
}
