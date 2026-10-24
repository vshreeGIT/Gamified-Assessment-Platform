package com.skillquest.repository;

import com.skillquest.entity.DataDetectiveSession;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DataDetectiveSessionRepository extends MongoRepository<DataDetectiveSession, String> {
}
