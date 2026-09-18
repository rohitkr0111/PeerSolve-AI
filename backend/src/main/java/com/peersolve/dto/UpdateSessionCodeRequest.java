package com.peersolve.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateSessionCodeRequest(
    @NotNull @Size(max = 50000) String code
) {}
