package com.skillquest.repository;

import com.skillquest.entity.RecruiterSettings;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RecruiterSettingsRepository extends MongoRepository<RecruiterSettings, String> {
}
