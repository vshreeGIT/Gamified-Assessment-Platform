package com.skillquest.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "data_detective_sessions")
public class DataDetectiveSession {
    @Id
    private String id;
    private String userEmail;
    private String investigationId;
    private String submissionKey;
    private String status;
    private Instant startedAt;
    private Instant deadlineAt;
}
