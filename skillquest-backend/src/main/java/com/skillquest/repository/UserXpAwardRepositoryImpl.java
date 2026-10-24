package com.skillquest.repository;

import com.skillquest.entity.User;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

/** Atomic, idempotent XP update for Interview Battle rewards. */
public class UserXpAwardRepositoryImpl implements UserXpAwardRepository {
    private final MongoTemplate mongoTemplate;

    public UserXpAwardRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public boolean awardInterviewXpOnce(String email, String attemptKey, int xp) {
        Query onceOnly = Query.query(Criteria.where("email").is(email)
                .and("interviewBattleXpRewardKeys").ne(attemptKey));
        Update award = new Update().inc("xp", xp).addToSet("interviewBattleXpRewardKeys", attemptKey);
        User updated = mongoTemplate.findAndModify(onceOnly, award,
                FindAndModifyOptions.options().returnNew(true), User.class);
        if (updated == null) return false;

        // Update level only if the XP value is still the one returned above.
        Query sameBalance = Query.query(Criteria.where("id").is(updated.getId()).and("xp").is(updated.getXp()));
        mongoTemplate.updateFirst(sameBalance,
                new Update().set("level", updated.getXp() / 500 + 1), User.class);
        return true;
    }
}
