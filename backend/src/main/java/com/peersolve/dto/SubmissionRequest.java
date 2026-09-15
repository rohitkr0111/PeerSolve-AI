package com.peersolve.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
public record SubmissionRequest(@NotBlank String problemId,@NotBlank @Pattern(regexp="(?i)^java$",message="Only Java is supported") String language,@NotBlank @Size(max=50000,message="Code must be 50,000 characters or fewer") String code) {}
