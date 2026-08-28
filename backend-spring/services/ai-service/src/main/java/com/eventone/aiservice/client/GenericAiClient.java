package com.eventone.aiservice.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.time.Duration;

@Component
public class GenericAiClient {

    private final WebClient webClient;
    
    @Value("${ai.provider:openai}")
    private String aiProvider;
    
    @Value("${ai.model:gpt-3.5-turbo}")
    private String aiModel;
    
    @Value("${ai.api-key:}")
    private String aiApiKey;

    public GenericAiClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateCompletion(String systemPrompt, String userPrompt) {
        if (aiApiKey == null || aiApiKey.isEmpty() || "mock".equalsIgnoreCase(aiProvider)) {
            throw new RuntimeException("AI provider not configured or set to mock. Falling back.");
        }

        String endpoint = "openai".equalsIgnoreCase(aiProvider) ? "https://api.openai.com/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", aiModel);
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
        ));
        requestBody.put("temperature", 0.3);
        requestBody.put("max_tokens", 500);

        try {
            Map response = webClient.post()
                    .uri(endpoint)
                    .header("Authorization", "Bearer " + aiApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
            throw new RuntimeException("Unexpected response from AI provider");
        } catch (Exception e) {
            throw new RuntimeException("AI API call failed: " + e.getMessage(), e);
        }
    }
}
