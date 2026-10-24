package com.skillquest.repository;

import com.skillquest.entity.DataDetectiveAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface DataDetectiveAttemptRepository extends MongoRepository<DataDetectiveAttempt, String> {
    List<DataDetectiveAttempt> findByUserEmailOrderByCompletedAtDesc(String userEmail);
    Optional<DataDetectiveAttempt> findByUserEmailAndId(String userEmail, String id);
}
