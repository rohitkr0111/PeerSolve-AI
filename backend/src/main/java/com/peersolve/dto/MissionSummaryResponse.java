package com.peersolve.dto;

import java.util.List;

public record MissionSummaryResponse(
    String id,
    String worldId,
    String skillId,
    String title,
    String objective,
    String difficulty,
    int xpReward,
    int order,
    boolean completed,
    boolean unlocked
) {}
