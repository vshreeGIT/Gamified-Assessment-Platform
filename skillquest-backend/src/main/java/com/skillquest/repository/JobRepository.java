package com.skillquest.repository;

import com.skillquest.entity.Job;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface JobRepository extends MongoRepository<Job, String> {
	List<Job> findAllByRecruiterEmailOrderByCreatedAtDesc(String recruiterEmail);
}
