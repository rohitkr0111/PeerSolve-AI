package com.peersolve.dto;

import java.util.Map;
import java.util.Set;

public record PlayerProfileResponse(
    String id,
    String userId,
    String username,
    int xp,
    int level,
    int streakDays,
    String activeWorldId,
    Set<String> unlockedSkills,
    Set<String> completedMissions,
    Set<String> defeatedBosses,
    Map<String, Integer> skillMastery,
    Set<String> unlockedAchievements,
    int totalHintsUsed,
    int totalAttempts,
    int xpForCurrentLevel,
    int xpForNextLevel
) {}
