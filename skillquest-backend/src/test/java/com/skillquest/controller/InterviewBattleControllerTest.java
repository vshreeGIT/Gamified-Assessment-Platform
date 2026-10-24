package com.skillquest.controller;

import com.skillquest.dto.InterviewAssessmentResponse;
import com.skillquest.dto.InterviewResultResponse;
import com.skillquest.service.InterviewBattleService;
import org.junit.jupiter.api.Test;
import java.security.Principal;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class InterviewBattleControllerTest {
    @Test void assessmentEndpointsAlwaysUseAuthenticatedPrincipalIdentity() {
        InterviewBattleService service = mock(InterviewBattleService.class);
        InterviewBattleController controller = new InterviewBattleController(service);
        Principal candidate = () -> "owner@example.test";
        InterviewAssessmentResponse active = InterviewAssessmentResponse.builder().sessionKey("s").role("Python Developer").build();
        InterviewResultResponse result = InterviewResultResponse.builder().attemptId("a").build();
        when(service.start("owner@example.test", "Python Developer")).thenReturn(active);
        when(service.getActiveSession("owner@example.test")).thenReturn(Optional.of(active));
        when(service.getAttempt("owner@example.test", "a")).thenReturn(result);
        assertSame(active, controller.start("Python Developer", candidate).getBody());
        assertSame(active, controller.activeSession(candidate).getBody());
        assertSame(result, controller.attempt("a", candidate).getBody());
        verify(service).start("owner@example.test", "Python Developer");
        verify(service).getActiveSession("owner@example.test");
        verify(service).getAttempt("owner@example.test", "a");
    }
}
