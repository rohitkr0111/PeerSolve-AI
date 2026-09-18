package com.peersolve.controller;

import com.peersolve.dto.CollaborationSessionResponse;
import com.peersolve.dto.CreateSessionRequest;
import com.peersolve.dto.UpdateSessionCodeRequest;
import com.peersolve.service.CollaborationService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/collaboration/sessions")
public class CollaborationController {
  private final CollaborationService collaborationService;

  public CollaborationController(CollaborationService collaborationService) {
    this.collaborationService = collaborationService;
  }

  @PostMapping
  public CollaborationSessionResponse create(
      Authentication authentication,
      @Valid @RequestBody CreateSessionRequest request
  ) {
    String userId = (String) authentication.getPrincipal();
    return collaborationService.createSession(userId, request);
  }

  @GetMapping("/{sessionId}")
  public CollaborationSessionResponse get(@PathVariable String sessionId) {
    return collaborationService.getSession(sessionId);
  }

  @PostMapping("/{sessionId}/join")
  public CollaborationSessionResponse join(
      @PathVariable String sessionId,
      Authentication authentication
  ) {
    String userId = (String) authentication.getPrincipal();
    return collaborationService.joinSession(sessionId, userId);
  }

  @PostMapping("/{sessionId}/leave")
  public CollaborationSessionResponse leave(
      @PathVariable String sessionId,
      Authentication authentication
  ) {
    String userId = (String) authentication.getPrincipal();
    return collaborationService.leaveSession(sessionId, userId);
  }

  @PutMapping("/{sessionId}/code")
  public CollaborationSessionResponse updateCode(
      @PathVariable String sessionId,
      @Valid @RequestBody UpdateSessionCodeRequest request
  ) {
    return collaborationService.updateCode(sessionId, request.code());
  }
}
