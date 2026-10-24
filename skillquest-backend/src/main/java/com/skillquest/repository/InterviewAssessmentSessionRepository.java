package com.skillquest.repository;

import com.skillquest.entity.InterviewAssessmentSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface InterviewAssessmentSessionRepository extends MongoRepository<InterviewAssessmentSession, String> {
    Optional<InterviewAssessmentSession> findByUserEmailAndSessionKey(String userEmail, String sessionKey);
}
