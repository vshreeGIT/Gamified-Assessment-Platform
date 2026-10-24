package com.skillquest.repository;

import com.skillquest.entity.InterviewAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface InterviewAttemptRepository extends MongoRepository<InterviewAttempt, String> {
    Optional<InterviewAttempt> findByUserEmailAndSessionKey(String userEmail, String sessionKey);
    List<InterviewAttempt> findByUserEmailOrderByCompletedAtDesc(String userEmail);
}
