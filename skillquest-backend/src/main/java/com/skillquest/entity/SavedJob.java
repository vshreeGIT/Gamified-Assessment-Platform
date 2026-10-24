package com.skillquest.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "saved_jobs")
@CompoundIndex(name = "user_job_unique", def = "{'userEmail': 1, 'jobId': 1}", unique = true)
public class SavedJob {

    @Id
    private String id;

    private String userEmail;
    private String jobId;
    private LocalDateTime savedAt;
}
