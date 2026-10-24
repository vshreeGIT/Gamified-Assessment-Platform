package com.skillquest.repository;

import com.skillquest.entity.CodingAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface CodingAttemptRepository extends MongoRepository<CodingAttempt, String> {
    List<CodingAttempt> findByUserEmailOrderByCompletedAtDesc(String userEmail);
    Optional<CodingAttempt> findByUserEmailAndSessionKey(String userEmail, String sessionKey);
}
