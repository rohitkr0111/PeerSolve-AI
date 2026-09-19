package com.peersolve.service;

import java.time.Instant;
import java.util.ArrayList;
import com.peersolve.dto.*;
import com.peersolve.model.User;
import com.peersolve.repository.UserRepository;
import com.peersolve.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
  private final UserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
  public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) { this.users=users; this.encoder=encoder; this.jwt=jwt; }
  public void register(RegisterRequest request) { String email=normalize(request.email()); if(users.existsByEmail(email)) throw new ResponseStatusException(HttpStatus.CONFLICT,"Email is already registered"); User user=new User(); user.setName(request.name().trim()); user.setEmail(email); user.setPassword(encoder.encode(request.password())); user.setCreatedAt(Instant.now()); user.setFollowingIds(new ArrayList<>()); users.save(user); }
  public LoginResponse login(LoginRequest request) { User user=users.findByEmail(normalize(request.email())).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password")); if(!encoder.matches(request.password(),user.getPassword())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password"); return new LoginResponse(jwt.generateToken(user.getId(),user.getEmail()),UserResponse.from(user)); }
  public UserResponse currentUser(String id) { return UserResponse.from(users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"User no longer exists"))); }
  private String normalize(String email) { return email.trim().toLowerCase(); }
}
