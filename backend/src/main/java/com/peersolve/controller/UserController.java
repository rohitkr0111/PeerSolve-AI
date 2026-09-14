package com.peersolve.controller;
import com.peersolve.dto.UserResponse;
import com.peersolve.service.AuthService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/users")
public class UserController { private final AuthService auth; public UserController(AuthService auth) { this.auth=auth; } @GetMapping("/me") public UserResponse me(Authentication authentication) { return auth.currentUser((String)authentication.getPrincipal()); } }
