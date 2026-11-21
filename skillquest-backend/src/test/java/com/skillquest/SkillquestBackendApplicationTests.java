package com.skillquest;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Full-context smoke test. Requires a live MongoDB connection with valid
 * credentials (set MONGODB_URI env var). Disabled in CI where no live DB
 * is available; all other tests use mocks and run without a database.
 */
@SpringBootTest
@Disabled("Requires live MongoDB Atlas connection — run manually with MONGODB_URI set")
class SkillquestBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
