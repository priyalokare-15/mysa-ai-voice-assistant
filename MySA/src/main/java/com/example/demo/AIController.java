package com.example.demo;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AIController {

    private final GeminiService geminiService;

    public AIController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/ask")
    public Map<String, String> askAI(
            @RequestBody Map<String, String> request) throws Exception {

        String userText = request.get("userText");
        String responseLanguage = request.get("responseLanguage");

        String answer = geminiService.getResponse(
                userText, responseLanguage);

        return Map.of("answer", answer);
    }
}