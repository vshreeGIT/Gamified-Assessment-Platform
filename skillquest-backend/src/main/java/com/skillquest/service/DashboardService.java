package com.skillquest.service;

import com.skillquest.dto.CandidateDashboardResponse;
import com.skillquest.dto.LeaderboardItemDto;

import java.util.List;

public interface DashboardService {

    CandidateDashboardResponse getCandidateDashboard(String email);

    List<LeaderboardItemDto> getLeaderboard(String currentUserEmail);
}
