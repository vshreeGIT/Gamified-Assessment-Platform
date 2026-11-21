package com.skillquest.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.skillquest.entity.User;

public interface UserRepository extends MongoRepository<User, String>, UserXpAwardRepository {

    boolean existsByEmail(String email);

    boolean existsByRole(com.skillquest.entity.Role role);

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailIgnoreCase(String email);

    List<User> findAllByRoleAndActiveTrue(com.skillquest.entity.Role role);

}
