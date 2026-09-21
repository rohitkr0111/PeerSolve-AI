package com.peersolve.service.mentor;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.peersolve.dto.MentorRequestDto;
import com.peersolve.dto.MentorResponseDto;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

public class LlmMentorAnalysisService implements MentorAnalysisService {

    private final String baseUrl;
    private final String model;
    private final String apiKey;
    private final int timeoutMs;
    private final RuleBasedMentorAnalysisService fallbackService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public LlmMentorAnalysisService(String baseUrl, String model, String apiKey, int timeoutMs) {
        this.baseUrl = baseUrl;
        this.model = model;
        this.apiKey = apiKey;
        this.timeoutMs = timeoutMs;
        this.fallbackService = new RuleBasedMentorAnalysisService(null);
    }

    @Override
    public MentorResponseDto analyze(MentorRequestDto request) {
        if (apiKey == null || apiKey.isBlank()) {
            return fallbackService.analyze(request);
        }

        try {
            List<Map<String, String>> messages = buildMessages(request);

            Map<String, Object> payload = Map.of(
                "model", model,
                "messages", messages,
                "temperature", 0.3,
                "max_tokens", 1024
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            RestTemplate restTemplate = new RestTemplate();
            org.springframework.http.client.SimpleClientHttpRequestFactory factory =
                    new org.springframework.http.client.SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(timeoutMs);
            factory.setReadTimeout(timeoutMs);
            restTemplate.setRequestFactory(factory);

            ResponseEntity<String> httpResponse = restTemplate.postForEntity(baseUrl, entity, String.class);

            if (httpResponse.getStatusCode().is2xxSuccessful() && httpResponse.getBody() != null) {
                JsonNode root = objectMapper.readTree(httpResponse.getBody());
                JsonNode choices = root.path("choices");
                if (!choices.isArray() || choices.isEmpty()) {
                    throw new IllegalStateException("No choices in LLM response");
                }
                String content = choices.get(0).path("message").path("content").asText();

                // The LLM responds with plain text for chat mode
                MentorResponseDto response = new MentorResponseDto();
                response.setDiagnosisCode("AI_RESPONSE");
                response.setMessage(content.trim());
                response.setEvidence(Collections.emptyList());
                response.setSuggestedAction(null);
                response.setNextHintTier(null);
                response.setConfidence(null);
                response.setFallbackUsed(false);
                response.setModelVersion(model);
                return response;
            }

            throw new IllegalStateException("Non-2xx response from LLM: " + httpResponse.getStatusCode());
        } catch (org.springframework.web.client.HttpClientErrorException | org.springframework.web.client.HttpServerErrorException httpEx) {
            System.err.println("[LlmMentorAnalysisService] LLM HTTP error " + httpEx.getStatusCode() + ": " + httpEx.getResponseBodyAsString());
            MentorResponseDto fallback = fallbackService.analyze(request);
            fallback.setFallbackUsed(true);
            fallback.setModelVersion(null);
            return fallback;
        } catch (Exception ex) {
            System.err.println("[LlmMentorAnalysisService] LLM call failed: " + ex.getClass().getSimpleName() + " — " + ex.getMessage());
            MentorResponseDto fallback = fallbackService.analyze(request);
            fallback.setFallbackUsed(true);
            fallback.setModelVersion(null);
            return fallback;
        }
    }

    private List<Map<String, String>> buildMessages(MentorRequestDto req) {
        List<Map<String, String>> messages = new ArrayList<>();

        // System prompt with code context baked in
        StringBuilder systemMsg = new StringBuilder(SYSTEM_PROMPT);
        systemMsg.append("\n\n--- CURRENT CONTEXT ---\n");
        if (req.getProblemId() != null) systemMsg.append("Problem ID: ").append(req.getProblemId()).append("\n");
        systemMsg.append("\nLearner's Java code:\n```java\n").append(truncate(req.getCode(), 3000)).append("\n```\n");
        if (req.getExecutionStatus() != null) systemMsg.append("\nExecution status: ").append(req.getExecutionStatus()).append("\n");
        if (req.getExecutionMessage() != null && !req.getExecutionMessage().isBlank()) {
            systemMsg.append("Execution output:\n").append(truncate(req.getExecutionMessage(), 1000)).append("\n");
        }
        if (req.getFailingTest() != null && !req.getFailingTest().isBlank()) {
            systemMsg.append("Failing test: ").append(req.getFailingTest()).append("\n");
        }

        messages.add(Map.of("role", "system", "content", systemMsg.toString()));

        // Add conversation history (previous turns)
        if (req.getConversationHistory() != null) {
            for (MentorRequestDto.ChatMessage msg : req.getConversationHistory()) {
                if (msg.getRole() != null && msg.getContent() != null) {
                    messages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
                }
            }
        }

        // Add current user question
        String question = req.getQuestion();
        if (question == null || question.isBlank()) {
            question = "Analyze my code and explain what's wrong. What should I do next?";
        }
        messages.add(Map.of("role", "user", "content", question));

        return messages;
    }

    private String truncate(String s, int max) {
        if (s == null) return "";
        return s.length() <= max ? s : s.substring(0, max) + "…[truncated]";
    }

    private static final String SYSTEM_PROMPT = """
        You are ADA-7, an expert Java programming mentor on PeerSolve, an adaptive coding-learning platform.
        You are having a conversation with a learner about their Java code.

        Rules:
        - Be conversational, helpful, and encouraging.
        - NEVER reveal a complete solution. Guide, don't solve.
        - Explain concepts clearly with examples when helpful.
        - If the learner asks a follow-up, answer it in context of their code.
        - Keep responses concise (2-4 paragraphs max).
        - Use markdown formatting for code snippets and emphasis.
        - If the code is correct (ACCEPTED), congratulate and suggest improvements.
        - If you are uncertain, say so honestly.
        """;
}
