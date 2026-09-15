package com.peersolve.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthenticationFilter
        extends org.springframework.web.filter.OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        System.out.println("AUTH HEADER: " + header);

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            System.out.println("TOKEN PRESENT: " + !token.isBlank());

            if (jwtService.isValid(token)) {

                String id = jwtService.extractUserId(token);

                System.out.println("JWT VALID, USER ID: " + id);

                var auth = new UsernamePasswordAuthenticationToken(
                        id,
                        null,
                        java.util.List.of()
                );

                auth.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext()
                        .setAuthentication(auth);

                System.out.println(
                        "AUTHENTICATED: " +
                        SecurityContextHolder.getContext()
                                .getAuthentication()
                );

            } else {
                System.out.println("JWT INVALID");
            }

        } else {
            System.out.println("NO BEARER TOKEN");
        }

        chain.doFilter(request, response);
    }
}