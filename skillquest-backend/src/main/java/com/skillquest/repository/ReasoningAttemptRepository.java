package com.skillquest.repository;

import com.skillquest.entity.ReasoningAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReasoningAttemptRepository extends MongoRepository<ReasoningAttempt, String> {

    List<ReasoningAttempt> findByUserEmailOrderByCompletedAtDesc(String userEmail);

    long countByUserEmail(String userEmail);

    Optional<ReasoningAttempt> findByUserEmailAndSubmissionKey(String userEmail, String submissionKey);
}
