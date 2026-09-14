package com.peersolve.controller;
import com.peersolve.dto.*;
import com.peersolve.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth")
public class AuthController { private final AuthService auth; public AuthController(AuthService auth) { this.auth=auth; }
  @Operation(summary="Register a user") @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED) public MessageResponse register(@Valid @RequestBody RegisterRequest request) { auth.register(request); return new MessageResponse("Registration successful"); }
  @Operation(summary="Log in and receive a JWT") @PostMapping("/login") public LoginResponse login(@Valid @RequestBody LoginRequest request) { return auth.login(request); }
}
