package com.genosentinel.auth.controller;

import com.genosentinel.auth.service.AuthService;
import com.genosentinel.auth.service.GatewayService;
import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/gateway")
@Hidden
@CrossOrigin(origins = "*")
public class GatewayController {

    @Autowired
    private GatewayService gatewayService;

    @Autowired
    private AuthService authService;

    @RequestMapping(value = "/genomica/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<?> forwardToGenomica(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest request,
            @RequestBody(required = false) Object body) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        String path = extractPath(request.getRequestURI(), "/gateway/genomica");
        HttpHeaders headers = extractHeaders(request);
        HttpMethod method = HttpMethod.valueOf(request.getMethod());

        try {
            return gatewayService.forwardToGenomica(path, method, headers, body);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    @RequestMapping(value = "/clinica/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<?> forwardToClinica(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest request,
            @RequestBody(required = false) Object body) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        String path = extractPath(request.getRequestURI(), "/gateway/clinica");
        System.out.println("DEBUG - Request URI: " + request.getRequestURI());
        System.out.println("DEBUG - Extracted path: " + path);
        HttpHeaders headers = extractHeaders(request);
        HttpMethod method = HttpMethod.valueOf(request.getMethod());

        try {
            return gatewayService.forwardToClinica(path, method, headers, body);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    private boolean validateToken(String authHeader) {
        // DEBUG: Ver qué recibe
        System.out.println("========== DEBUG GATEWAY ==========");
        System.out.println("Authorization Header: " + authHeader);
        System.out.println("===================================");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("ERROR: Header inválido o missing");
            return false;
        }

        String token = authHeader.substring(7);
        System.out.println("Token extraído: " + token);

        boolean isValid = authService.validateToken(token);
        System.out.println("Token válido: " + isValid);
        System.out.println("===================================");

        return isValid;
    }

    private String extractPath(String requestURI, String prefix) {
        return requestURI.substring(prefix.length());
    }

    private HttpHeaders extractHeaders(HttpServletRequest request) {
        HttpHeaders headers = new HttpHeaders();
        request.getHeaderNames().asIterator().forEachRemaining(
                headerName -> headers.add(headerName, request.getHeader(headerName))
        );
        return headers;
    }
}