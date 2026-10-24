package com.skillquest.repository;

import com.skillquest.entity.CommunicationQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommunicationQuestionRepository extends MongoRepository<CommunicationQuestion, String> {
}
