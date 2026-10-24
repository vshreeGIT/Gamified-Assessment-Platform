package com.skillquest.controller;

import com.skillquest.dto.*;
import com.skillquest.service.QuestProgressService;
import com.skillquest.service.TeamworkService;
import org.junit.jupiter.api.Test;
import java.security.Principal;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class QuestProgressControllerTest {
    @Test void directInterviewAccessReturnsForbiddenUntilBackendProgressUnlocksIt() {
        QuestProgressService progress = mock(QuestProgressService.class);
        QuestProgressItemDto locked = QuestProgressItemDto.builder().status("LOCKED").missingPrerequisites(java.util.List.of("XP: 0 / 750", "Completed quests: 0 / 5")).build();
        when(progress.getProgress("person@example.test")).thenReturn(QuestProgressResponse.builder().quests(Map.of("interview", locked)).build());
        QuestProgressController controller = new QuestProgressController(progress, mock(TeamworkService.class));
        Principal principal = () -> "person@example.test";
        var response = controller.interviewAccess(principal);
        assertEquals(403, response.getStatusCode().value());
        assertSame(locked, response.getBody());
    }
}
