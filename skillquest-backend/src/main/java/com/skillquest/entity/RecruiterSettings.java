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
@Document(collection = "recruiter_settings")
public class RecruiterSettings {
    @Id
    private String recruiterEmail;
    private boolean notificationsEnabled;
    private LocalDateTime updatedAt;
}
