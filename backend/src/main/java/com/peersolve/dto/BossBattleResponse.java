package com.peersolve.dto;

import java.util.List;
import com.peersolve.model.BossStage;

public record BossBattleResponse(
    String id,
    String worldId,
    String title,
    String subtitle,
    String bossName,
    String bossAvatar,
    String lore,
    String unlockSkillId,
    int xpReward,
    boolean defeated,
    int currentStageNumber, // 1 to 4
    int totalStages,
    List<BossStage> stages
) {}
