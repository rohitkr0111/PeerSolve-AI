package com.peersolve.dto;
import com.peersolve.model.User;
public record UserResponse(String id, String name, String email) { public static UserResponse from(User u) { return new UserResponse(u.getId(), u.getName(), u.getEmail()); } }
