package com.peersolve.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateSessionRequest(
    @NotBlank String problemId,
    @Size(max = 50000) String initialCode
) {}
