package com.skillquest.repository;

import com.skillquest.entity.CommunicationAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CommunicationAttemptRepository extends MongoRepository<CommunicationAttempt, String> {
    Optional<CommunicationAttempt> findByUserEmailAndSubmissionKey(String userEmail, String submissionKey);

    List<CommunicationAttempt> findByUserEmailOrderByCompletedAtDesc(String userEmail);
}
