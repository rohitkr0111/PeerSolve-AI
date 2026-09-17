package com.peersolve.dto;

public record LeaderboardEntryResponse(
    int rank,
    String userId,
    String username,
    int level,
    int xp,
    int missionsCompleted,
    int bossesDefeated,
    int streakDays,
    boolean isCurrentPlayer
) {}
