package com.peersolve.controller;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
@RestControllerAdvice public class ApiExceptionHandler {
 @ExceptionHandler(MethodArgumentNotValidException.class) @ResponseStatus(HttpStatus.BAD_REQUEST) Map<String,String> invalid(MethodArgumentNotValidException e) { return Map.of("message",e.getBindingResult().getFieldErrors().getFirst().getDefaultMessage()); }
 @ExceptionHandler(ResponseStatusException.class) ResponseEntity<Map<String,String>> response(ResponseStatusException e) { return ResponseEntity.status(e.getStatusCode()).body(Map.of("message",e.getReason())); }
}
