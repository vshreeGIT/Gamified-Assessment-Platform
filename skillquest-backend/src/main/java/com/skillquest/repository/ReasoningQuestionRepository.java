package com.skillquest.repository;

import com.skillquest.entity.ReasoningQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReasoningQuestionRepository extends MongoRepository<ReasoningQuestion, String> {

    List<ReasoningQuestion> findByDifficulty(String difficulty);

    long countByDifficulty(String difficulty);
}
