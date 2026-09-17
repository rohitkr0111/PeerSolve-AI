package com.peersolve.dto;

import java.util.List;

public record BossStageAttemptResponse(
    boolean passed,
    int stageNumber,
    boolean bossDefeated,
    int bossHealthPercent, // 100 -> 75 -> 50 -> 25 -> 0
    String bossDialogue,
    String mentorFeedback,
    int xpEarned,
    int totalXp,
    String unlockedSkillId,
    List<String> newlyUnlockedAchievements,
    List<TestCaseResult> testCaseResults
) {}
