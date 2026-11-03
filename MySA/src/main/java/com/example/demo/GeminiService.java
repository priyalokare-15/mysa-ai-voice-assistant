
package com.example.demo;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public GeminiService() {
    }

    public String getResponse(
            String userText,
            String responseLanguage) throws Exception {

        String prompt = "Answer the following question in "
                + responseLanguage
                + ". Give a simple and helpful answer. "
                + "The user's question is: "
                + userText;

        Map<String, Object> requestBody = Map.of(
                "contents",
                List.of(
                        Map.of(
                                "parts",
                                List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        String url =
                "https://generativelanguage.googleapis.com/v1beta/"
                + "models/gemini-3.5-flash-lite:generateContent"
                + "?key=" + apiKey;

        String response = restClient.post()
                .uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(String.class);

        JsonNode json = objectMapper.readTree(response);

        return json.path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText();
    }
}
