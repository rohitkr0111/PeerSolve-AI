package com.peersolve.service.mentor;

import com.peersolve.dto.MentorRequestDto;
import com.peersolve.dto.MentorResponseDto;

/**
 * Service that analyses a code submission and returns a mentor feedback.
 * Implementations may be rule‑based, LLM‑based or a composition of both.
 */
public interface MentorAnalysisService {
    /**
     * Analyse the given request and produce a response.
     *
     * @param request the data required for analysis
     * @return a {@link MentorResponseDto} containing the mentor feedback
     */
    MentorResponseDto analyze(MentorRequestDto request);
}
