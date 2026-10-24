package com.skillquest.repository;

import com.skillquest.entity.CommunicationActivity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommunicationActivityRepository extends MongoRepository<CommunicationActivity, String> {
    List<CommunicationActivity> findBySubdivisionIdOrderByIdAsc(String subdivisionId);
}
