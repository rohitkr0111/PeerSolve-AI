package com.peersolve.dto;

public record AchievementResponse(
    String id,
    String code,
    String title,
    String description,
    String icon,
    String rarity,
    int xpReward,
    boolean unlocked
) {}
