package com.genosentinel.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GatewayService {

    @Value("${service.genomica.url}")
    private String genomicaUrl;

    @Value("${service.clinica.url}")
    private String clinicaUrl;

    private final RestTemplate restTemplate;

    public GatewayService() {
        this.restTemplate = new RestTemplate();
    }

    public ResponseEntity<String> forwardToGenomica(String path, HttpMethod method, HttpHeaders headers, Object body) {
        String url = genomicaUrl + path;
        HttpEntity<Object> entity = new HttpEntity<>(body, headers);

        return restTemplate.exchange(url, method, entity, String.class);
    }

    public ResponseEntity<String> forwardToClinica(String path, HttpMethod method, HttpHeaders headers, Object body) {
        String url = clinicaUrl + path;
        HttpEntity<Object> entity = new HttpEntity<>(body, headers);

        return restTemplate.exchange(url, method, entity, String.class);
    }
}