package com.genosentinel.auth.controller;

import com.genosentinel.auth.dto.LoginRequest;
import com.genosentinel.auth.dto.LoginResponse;
import com.genosentinel.auth.dto.ErrorResponse;
import com.genosentinel.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Authentication", description = "Endpoints para autenticacion de usuarios")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(summary = "Login de usuario", description = "Autentica un usuario y retorna un JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login exitoso"),
            @ApiResponse(responseCode = "401", description = "Credenciales invalidas")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            ErrorResponse error = new ErrorResponse(
                    HttpStatus.UNAUTHORIZED.value(),
                    e.getMessage(),
                    "/api/auth/login"
            );
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @Operation(summary = "Validar token JWT", description = "Valida si un token JWT es valido y no ha expirado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token valido"),
            @ApiResponse(responseCode = "401", description = "Token invalido o expirado")
    })
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Boolean isValid = authService.validateToken(token);

            if (isValid) {
                return ResponseEntity.ok().body("{\"valid\": true}");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("{\"valid\": false, \"message\": \"Invalid or expired token\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"valid\": false, \"message\": \"" + e.getMessage() + "\"}");
        }
    }
}