package com.skillquest.repository;

import com.skillquest.entity.TeamworkAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TeamworkAttemptRepository extends MongoRepository<TeamworkAttempt, String> {
    List<TeamworkAttempt> findByUserEmailOrderByCompletedAtDesc(String userEmail);
    Optional<TeamworkAttempt> findByUserEmailAndSubmissionKey(String userEmail, String submissionKey);
}
