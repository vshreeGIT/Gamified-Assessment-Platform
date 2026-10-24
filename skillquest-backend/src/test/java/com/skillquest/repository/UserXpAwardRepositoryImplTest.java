package com.skillquest.repository;

import com.skillquest.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class UserXpAwardRepositoryImplTest {
    @Test void xpIncrementAndAttemptMarkerAreAppliedAsOneConditionalUserDocumentUpdate() {
        MongoTemplate mongo = mock(MongoTemplate.class);
        User updated = new User(); updated.setId("user-id"); updated.setEmail("user@example.test"); updated.setXp(875);
        when(mongo.findAndModify(any(Query.class), any(Update.class), any(FindAndModifyOptions.class), eq(User.class))).thenReturn(updated);
        UserXpAwardRepositoryImpl repository = new UserXpAwardRepositoryImpl(mongo);
        assertTrue(repository.awardInterviewXpOnce("user@example.test", "attempt-1", 130));
        var query = org.mockito.ArgumentCaptor.forClass(Query.class);
        var update = org.mockito.ArgumentCaptor.forClass(Update.class);
        verify(mongo).findAndModify(query.capture(), update.capture(), any(FindAndModifyOptions.class), eq(User.class));
        assertTrue(query.getValue().getQueryObject().toJson().contains("$ne"));
        assertTrue(update.getValue().getUpdateObject().toJson().contains("$inc"));
        assertTrue(update.getValue().getUpdateObject().toJson().contains("$addToSet"));
        verify(mongo).updateFirst(any(Query.class), any(Update.class), eq(User.class));
    }

    @Test void alreadyAwardedKeyDoesNotChangeTheUserBalanceAgain() {
        MongoTemplate mongo = mock(MongoTemplate.class);
        when(mongo.findAndModify(any(Query.class), any(Update.class), any(FindAndModifyOptions.class), eq(User.class))).thenReturn(null);
        UserXpAwardRepositoryImpl repository = new UserXpAwardRepositoryImpl(mongo);
        assertFalse(repository.awardInterviewXpOnce("user@example.test", "attempt-1", 130));
        verify(mongo, never()).updateFirst(any(Query.class), any(Update.class), eq(User.class));
    }
}
