package com.peersolve.service;

import com.peersolve.model.User;
import com.peersolve.repository.PlayerProfileRepository;
import com.peersolve.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SocialService {
  private final UserRepository users;
  private final PlayerProfileRepository profiles;

  public SocialService(UserRepository users, PlayerProfileRepository profiles) {
    this.users = users;
    this.profiles = profiles;
  }

  public void follow(String followerId, String targetId) {
    if (followerId.equals(targetId)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot follow yourself");
    }
    User follower = getUser(followerId);
    ensureFollowTargetExists(targetId);
    if (!follower.getFollowingIds().contains(targetId)) {
      follower.getFollowingIds().add(targetId);
      users.save(follower);
    }
  }

  public void unfollow(String followerId, String targetId) {
    User follower = getUser(followerId);
    if (follower.getFollowingIds().remove(targetId)) {
      users.save(follower);
    }
  }

  public boolean isFollowing(String followerId, String targetId) {
    return users.findById(followerId)
        .map(user -> user.getFollowingIds().contains(targetId))
        .orElse(false);
  }

  private User getUser(String id) {
    return users.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
  }

  private void ensureFollowTargetExists(String id) {
    if (!users.existsById(id) && profiles.findByUserId(id).isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }
  }
}