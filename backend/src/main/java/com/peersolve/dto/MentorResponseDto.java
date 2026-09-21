package com.peersolve.dto;

import java.util.List;

/**
 * DTO representing the response payload from the mentor analysis endpoint.
 */
public class MentorResponseDto {
    private String diagnosisCode; // e.g., MISCONCEPTION_DETECTED, INDEX_OUT_OF_BOUNDS, etc.
    private String message; // human‑readable explanation
    private List<String> evidence; // list of code fragments or error messages supporting the diagnosis
    private String suggestedAction; // next step for the learner
    private Integer nextHintTier; // optional hint tier suggestion
    private Double confidence; // 0.0‑1.0 confidence supplied by the LLM (null for rule‑based)
    private Boolean fallbackUsed; // true if LLM failed and rule‑based fallback was applied
    private String modelVersion; // identifier of the LLM model used (null for rule‑based)

    // Getters and setters
    public String getDiagnosisCode() { return diagnosisCode; }
    public void setDiagnosisCode(String diagnosisCode) { this.diagnosisCode = diagnosisCode; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<String> getEvidence() { return evidence; }
    public void setEvidence(List<String> evidence) { this.evidence = evidence; }

    public String getSuggestedAction() { return suggestedAction; }
    public void setSuggestedAction(String suggestedAction) { this.suggestedAction = suggestedAction; }

    public Integer getNextHintTier() { return nextHintTier; }
    public void setNextHintTier(Integer nextHintTier) { this.nextHintTier = nextHintTier; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public Boolean getFallbackUsed() { return fallbackUsed; }
    public void setFallbackUsed(Boolean fallbackUsed) { this.fallbackUsed = fallbackUsed; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }
}
