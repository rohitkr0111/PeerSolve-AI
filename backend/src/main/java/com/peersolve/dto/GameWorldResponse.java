package com.peersolve.dto;

import java.util.List;

public record GameWorldResponse(
    String id,
    String name,
    String subtitle,
    String description,
    String theme,
    int order,
    int requiredLevel,
    boolean unlocked,
    int completedMissionsCount,
    int totalMissionsCount,
    int progressPercent,
    boolean bossDefeated,
    String bossBattleId,
    List<MissionSummaryResponse> missions,
    String badgeIcon
) {}
