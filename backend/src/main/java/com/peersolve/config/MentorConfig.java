package com.peersolve.config;

import com.peersolve.service.mentor.LlmMentorAnalysisService;
import com.peersolve.service.mentor.MentorAnalysisService;
import com.peersolve.service.mentor.RuleBasedMentorAnalysisService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Wires the correct {@link MentorAnalysisService} implementation based on
 * the resolved value of {@code ai.mentor.provider}.
 */
@Configuration
public class MentorConfig {

    @Bean
    public MentorAnalysisService mentorAnalysisService(
            @Value("${ai.mentor.provider:disabled}") String provider,
            @Value("${ai.mentor.baseUrl:https://api.groq.com/openai/v1/chat/completions}") String baseUrl,
            @Value("${ai.mentor.model:llama-3.1-70b-versatile}") String model,
            @Value("${ai.mentor.apiKey:}") String apiKey,
            @Value("${ai.mentor.timeoutMs:15000}") int timeoutMs) {

        System.out.println("[MentorConfig] ai.mentor.provider = \"" + provider + "\"");
        System.out.println("[MentorConfig] ai.mentor.apiKey   = " + (apiKey.isBlank() ? "(empty)" : "(set, length=" + apiKey.length() + ")"));

        if (!"disabled".equalsIgnoreCase(provider) && !provider.isBlank() && !apiKey.isBlank()) {
            System.out.println("[MentorConfig] ✓ Activating LLM mentor service (provider=" + provider + ", model=" + model + ")");
            return new LlmMentorAnalysisService(baseUrl, model, apiKey, timeoutMs);
        }

        System.out.println("[MentorConfig] ✗ LLM disabled or no API key — using rule-based fallback");
        return new RuleBasedMentorAnalysisService(null);
    }
}
