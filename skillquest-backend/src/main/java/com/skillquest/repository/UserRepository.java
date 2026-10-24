package com.skillquest.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.skillquest.entity.User;

public interface UserRepository extends MongoRepository<User, String>, UserXpAwardRepository {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

}
