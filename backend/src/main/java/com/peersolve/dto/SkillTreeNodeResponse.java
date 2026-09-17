package com.peersolve.dto;

import java.util.List;

public record SkillTreeNodeResponse(
    String id,
    String name,
    String description,
    String status, // LOCKED, AVAILABLE, MASTERED
    int masteryScore, // 0 to 100
    List<String> prerequisites,
    String worldId,
    int missionsCompleted,
    int totalMissions,
    int tier,
    int order
) {}
