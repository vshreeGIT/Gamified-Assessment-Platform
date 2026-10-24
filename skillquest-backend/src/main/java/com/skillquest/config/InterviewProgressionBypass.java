package com.skillquest.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Testing-only switch. Its default is fail-closed; enable only with the local Spring profile. */
@Component
public class InterviewProgressionBypass {
    private final boolean enabled;

    public InterviewProgressionBypass(
            @Value("${interview.bypass-progression-for-testing:false}") boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isEnabled() {
        return enabled;
    }
}
