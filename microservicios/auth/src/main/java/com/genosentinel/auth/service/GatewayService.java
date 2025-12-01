package com.genosentinel.auth.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.Duration;

@Service
public class GatewayService {

    @Value("${service.genomica.url}")
    private String genomicaUrl;

    @Value("${service.clinica.url}")
    private String clinicaUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GatewayService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public ResponseEntity<String> forwardToGenomica(String path, HttpMethod method, HttpHeaders headers, Object body) {
        String url = genomicaUrl + path;

        // Asegurar que Content-Type sea application/json
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Convertir body a JSON String si es necesario
        String jsonBody = convertBodyToJson(body);

        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        System.out.println("DEBUG - Forwarding to: " + url);
        System.out.println("DEBUG - Method: " + method);
        System.out.println("DEBUG - Body: " + jsonBody);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, method, entity, String.class);
            System.out.println("DEBUG - Response Status: " + response.getStatusCode());
            return response;
        } catch (Exception e) {
            System.err.println("ERROR - Exception during forward: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public ResponseEntity<String> forwardToClinica(String path, HttpMethod method, HttpHeaders headers, Object body) {
        String url = clinicaUrl + path;

        headers.setContentType(MediaType.APPLICATION_JSON);
        String jsonBody = convertBodyToJson(body);
        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        System.out.println("DEBUG - Forwarding to: " + url);
        System.out.println("DEBUG - Method: " + method);
        System.out.println("DEBUG - Body: " + jsonBody);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, method, entity, String.class);
            System.out.println("DEBUG - Response Status: " + response.getStatusCode());
            return response;
        } catch (Exception e) {
            System.err.println("ERROR - Exception during forward: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private String convertBodyToJson(Object body) {
        if (body == null) {
            return null;
        }

        if (body instanceof String) {
            return (String) body;
        }

        try {
            return objectMapper.writeValueAsString(body);
        } catch (Exception e) {
            System.err.println("Error converting body to JSON: " + e.getMessage());
            return body.toString();
        }
    }
}