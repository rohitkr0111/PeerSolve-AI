package com.peersolve.dto;

import jakarta.validation.constraints.NotBlank;

public record MissionAttemptRequest(
    @NotBlank String code,
    int hintsUsed
) {}
