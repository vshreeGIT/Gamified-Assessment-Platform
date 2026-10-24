package com.skillquest.repository;

import com.skillquest.entity.SavedJob;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends MongoRepository<SavedJob, String> {

    List<SavedJob> findByUserEmail(String userEmail);

    Optional<SavedJob> findByUserEmailAndJobId(String userEmail, String jobId);

    boolean existsByUserEmailAndJobId(String userEmail, String jobId);

    void deleteByUserEmailAndJobId(String userEmail, String jobId);
}
