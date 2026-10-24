package com.skillquest.repository;

import com.skillquest.entity.CommunicationAssessmentSession;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommunicationAssessmentSessionRepository
        extends MongoRepository<CommunicationAssessmentSession, String> {
}
