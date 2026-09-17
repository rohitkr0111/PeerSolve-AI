package com.peersolve.dto;

import java.util.List;
import com.peersolve.model.Difficulty;
import com.peersolve.model.ProblemExample;
import com.peersolve.model.TestCase;

public record MissionDetailResponse(
    String id,
    String worldId,
    String skillId,
    String title,
    String story,
    String objective,
    String challengeType,
    Difficulty difficulty,
    String starterCode,
    String expectedTimeComplexity,
    String expectedSpaceComplexity,
    List<ProblemExample> examples,
    List<String> constraints,
    List<TestCase> sampleTestCases,
    int totalHintsAvailable,
    int xpReward,
    boolean completed,
    int order
) {}
