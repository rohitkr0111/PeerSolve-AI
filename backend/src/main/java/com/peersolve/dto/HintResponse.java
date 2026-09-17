package com.peersolve.dto;

public record HintResponse(
    int tier,
    String hint,
    int hintsRemaining,
    int xpPenaltyPercent
) {}
