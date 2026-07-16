package com.skillquest.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @Value("${spring.data.mongodb.uri:NOT_FOUND}")
    private String mongoUri;

    @GetMapping("/api/health")
    public String health() {
        return "SkillQuest Backend Running 🚀";
    }

    @GetMapping("/api/config")
    public String config() {
        return mongoUri;
    }
}