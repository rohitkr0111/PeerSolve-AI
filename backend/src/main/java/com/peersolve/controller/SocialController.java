package com.peersolve.controller;

import com.peersolve.dto.MessageResponse;
import com.peersolve.service.SocialService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/social")
public class SocialController {
  private final SocialService social;

  public SocialController(SocialService social) {
    this.social = social;
  }

  @PostMapping("/users/{userId}/follow")
  public MessageResponse follow(@PathVariable String userId, Authentication auth) {
    social.follow((String) auth.getPrincipal(), userId);
    return new MessageResponse("User followed");
  }

  @DeleteMapping("/users/{userId}/follow")
  public MessageResponse unfollow(@PathVariable String userId, Authentication auth) {
    social.unfollow((String) auth.getPrincipal(), userId);
    return new MessageResponse("User unfollowed");
  }
}