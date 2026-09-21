package com.peersolve.controller;

import com.peersolve.dto.MentorRequestDto;
import com.peersolve.dto.MentorResponseDto;
import com.peersolve.service.mentor.MentorAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller exposing the LLM‑backed mentor analysis endpoint.
 * The endpoint is JWT protected – the authenticated user id can be retrieved via
 * the {@code @AuthenticationPrincipal} annotation if needed for logging or rate‑limiting.
 */
@RestController
@RequestMapping("/api/mentor")
public class MentorController {

    private final MentorAnalysisService mentorService;

    public MentorController(MentorAnalysisService mentorService) {
        this.mentorService = mentorService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<MentorResponseDto> analyze(@RequestBody MentorRequestDto request,
                                                     @AuthenticationPrincipal Object principal) {
        // principal contains the authenticated user details (e.g., org.springframework.security.core.userdetails.User)
        // For now we ignore it beyond ensuring the request is authenticated.
        MentorResponseDto response = mentorService.analyze(request);
        return ResponseEntity.ok(response);
    }
}
