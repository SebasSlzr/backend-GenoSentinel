package com.genosentinel.auth.controller;

import com.genosentinel.auth.service.AuthService;
import com.genosentinel.auth.service.GatewayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/proxy")
@Tag(name = "Proxy Endpoints", description = "Endpoints documentados para acceder a microservicios a través del Gateway")
public class ProxyController {

    @Autowired
    private GatewayService gatewayService;

    @Autowired
    private AuthService authService;

    // CLINICA - TUMOR TYPES

    @Operation(
            summary = "Crear tipo de tumor",
            description = "Crea un nuevo tipo de tumor en el microservicio de Clínica",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Tipo de tumor creado exitosamente"),
            @ApiResponse(responseCode = "401", description = "Token inválido o expirado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping("/clinica/tumor-types")
    public ResponseEntity<?> createTumorType(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos del tipo de tumor",
                    required = true,
                    content = @Content(schema = @Schema(example = "{\"name\":\"Cancer de Mama\",\"systemAffected\":\"Glandulas mamarias\"}"))
            )
            @RequestBody Map<String, Object> body) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            return gatewayService.forwardToClinica("/tumor-types", HttpMethod.POST, headers, body);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    @Operation(
            summary = "Listar tipos de tumor",
            description = "Obtiene todos los tipos de tumor registrados",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @GetMapping("/clinica/tumor-types")
    public ResponseEntity<?> getTumorTypes(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            return gatewayService.forwardToClinica("/tumor-types", HttpMethod.GET, headers, null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    //CLINICA - PACIENTES

    @Operation(
            summary = "Crear paciente",
            description = "Registra un nuevo paciente en el sistema",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @PostMapping("/clinica/pacientes")
    public ResponseEntity<?> createPaciente(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos del paciente",
                    required = true,
                    content = @Content(schema = @Schema(example = "{\"firstName\":\"Maria\",\"lastName\":\"Garcia\",\"birthDate\":\"1985-06-15\",\"gender\":\"Femenino\",\"status\":\"Activo\"}"))
            )
            @RequestBody Map<String, Object> body) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            return gatewayService.forwardToClinica("/pacientes", HttpMethod.POST, headers, body);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    @Operation(
            summary = "Listar pacientes",
            description = "Obtiene todos los pacientes registrados",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @GetMapping("/clinica/pacientes")
    public ResponseEntity<?> getPacientes(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            return gatewayService.forwardToClinica("/pacientes", HttpMethod.GET, headers, null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    // CLINICA - CLINICAL RECORDS

    @Operation(
            summary = "Crear historia clínica",
            description = "Registra una nueva historia clínica para un paciente",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @PostMapping("/clinica/clinical-records")
    public ResponseEntity<?> createClinicalRecord(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos de la historia clínica",
                    required = true,
                    content = @Content(schema = @Schema(example = "{\"patientId\":\"uuid-aqui\",\"tumorTypeId\":1,\"diagnosisDate\":\"2024-01-15\",\"stage\":\"IIA\",\"treatmentProtocol\":\"Quimioterapia\"}"))
            )
            @RequestBody Map<String, Object> body) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            return gatewayService.forwardToClinica("/clinical-records", HttpMethod.POST, headers, body);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    @Operation(
            summary = "Listar historias clínicas",
            description = "Obtiene todas las historias clínicas registradas",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @GetMapping("/clinica/clinical-records")
    public ResponseEntity<?> getClinicalRecords(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            return gatewayService.forwardToClinica("/clinical-records", HttpMethod.GET, headers, null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    //VALIDACION

    private boolean validateToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }

        String token = authHeader.substring(7);
        return authService.validateToken(token);
    }
}