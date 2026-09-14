package com.peersolve.config;

import com.peersolve.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration @EnableWebSecurity
public class SecurityConfig {
  private final JwtAuthenticationFilter jwtFilter; private final String origin;
  public SecurityConfig(JwtAuthenticationFilter jwtFilter, @Value("${app.cors.allowed-origin}") String origin) { this.jwtFilter=jwtFilter; this.origin=origin; }
  @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
  @Bean SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception { return http.csrf(csrf->csrf.disable()).cors(cors->{}).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).authorizeHttpRequests(a->a.requestMatchers("/api/auth/**","/swagger-ui/**","/v3/api-docs/**").permitAll().requestMatchers(HttpMethod.OPTIONS,"/**").permitAll().requestMatchers("/api/users/**","/api/dashboard/**").authenticated().anyRequest().denyAll()).addFilterBefore(jwtFilter,UsernamePasswordAuthenticationFilter.class).build(); }
  @Bean CorsConfigurationSource corsConfigurationSource() { CorsConfiguration c=new CorsConfiguration(); c.setAllowedOrigins(java.util.List.of(origin)); c.setAllowedMethods(java.util.List.of("GET","POST","OPTIONS")); c.setAllowedHeaders(java.util.List.of("Authorization","Content-Type")); UrlBasedCorsConfigurationSource s=new UrlBasedCorsConfigurationSource(); s.registerCorsConfiguration("/**",c); return s; }
}
