package com.skillquest.repository;

import com.skillquest.entity.ReasoningAssessmentSession;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReasoningAssessmentSessionRepository
        extends MongoRepository<ReasoningAssessmentSession, String> {
}
