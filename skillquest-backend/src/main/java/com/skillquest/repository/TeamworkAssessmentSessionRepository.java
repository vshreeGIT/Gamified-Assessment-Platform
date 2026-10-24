package com.skillquest.repository;

import com.skillquest.entity.TeamworkAssessmentSession;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TeamworkAssessmentSessionRepository extends MongoRepository<TeamworkAssessmentSession, String> {
}
