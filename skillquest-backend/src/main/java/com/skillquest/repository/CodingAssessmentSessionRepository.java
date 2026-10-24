package com.skillquest.repository;

import com.skillquest.entity.CodingAssessmentSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface CodingAssessmentSessionRepository extends MongoRepository<CodingAssessmentSession, String> {
    Optional<CodingAssessmentSession> findByUserEmailAndSessionKey(String userEmail, String sessionKey);
}
