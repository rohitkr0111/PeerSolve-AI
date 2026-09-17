package com.peersolve.dto;

import java.util.List;
import java.util.Map;
import com.peersolve.service.AiMentorService.MentorFeedback;

public record MissionAttemptResponse(
    boolean passed,
    String status,
    int testCasesPassed,
    int totalTestCases,
    long executionTime,
    long memory,
    String output,
    List<TestCaseResult> testCaseResults,
    int xpEarned,
    int totalXp,
    int currentLevel,
    boolean leveledUp,
    Map<String, Integer> skillMastery,
    String conceptExplanation,
    MentorFeedback aiMentorFeedback,
    List<String> newlyUnlockedAchievements,
    String nextMissionId
) {}
