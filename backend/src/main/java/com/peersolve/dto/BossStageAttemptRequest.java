package com.peersolve.dto;

public record BossStageAttemptRequest(
    Integer selectedOptionIndex, // for DIAGNOSE stage
    String code, // for FIX and OPTIMIZE stages
    String explanation // for EXPLAIN stage
) {}
