package com.skillquest.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "job_applications")
public class JobApplication {
    @Id
    private String id;
    private String jobId;
    private String recruiterEmail;
    private String candidateId;
    private String candidateEmail;
    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}