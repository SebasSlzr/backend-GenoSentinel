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
@SecurityRequirement(name = "bearer-jwt")
public class ProxyController {

    @Autowired
    private GatewayService gatewayService;

    @Autowired
    private AuthService authService;

    // ========== CLÍNICA - PACIENTES ==========

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

    @Operation(
            summary = "Actualizar paciente",
            description = "Actualiza los datos de un paciente específico",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @PatchMapping("/clinica/pacientes/{id}")
    public ResponseEntity<?> updatePaciente(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable String id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos a actualizar del paciente",
                    required = true,
                    content = @Content(schema = @Schema(example = "{\"firstName\":\"Maria Updated\",\"status\":\"Seguimiento\"}"))
            )
            @RequestBody Map<String, Object> body) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            return gatewayService.forwardToClinica("/pacientes/" + id, HttpMethod.PATCH, headers, body);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    @Operation(
            summary = "Desactivar paciente",
            description = "Cambia el estado de un paciente a inactivo",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @PatchMapping("/clinica/pacientes/{id}/deactivate")
    public ResponseEntity<?> deactivatePaciente(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable String id) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            // Envía un cuerpo vacío o con el estado específico según tu API
            Map<String, Object> body = Map.of("status", "Inactivo");
            return gatewayService.forwardToClinica("/pacientes/" + id + "/deactivate", HttpMethod.PATCH, headers, body);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    @Operation(
            summary = "Eliminar paciente",
            description = "Elimina permanentemente un paciente del sistema",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @DeleteMapping("/clinica/pacientes/{id}")
    public ResponseEntity<?> deletePaciente(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable String id) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            return gatewayService.forwardToClinica("/pacientes/" + id, HttpMethod.DELETE, headers, null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    // ========== CLÍNICA - TIPOS DE TUMOR ==========

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

    // ========== CLÍNICA - HISTORIAS CLÍNICAS ==========

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

    // ========== GENÓMICA - GENES ==========

    @Operation(
            summary = "Crear gen",
            description = "Registra un nuevo gen en el catálogo genómico",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @PostMapping("/genomica/genes")
    public ResponseEntity<?> createGene(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos del gen",
                    required = true,
                    content = @Content(schema = @Schema(example = "{\"symbol\":\"BRCA1\",\"fullName\":\"Breast Cancer Gene 1\",\"functionSummary\":\"Gen supresor de tumores involucrado en reparación del ADN\"}"))
            )
            @RequestBody Map<String, Object> body) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            return gatewayService.forwardToGenomica("/genes", HttpMethod.POST, headers, body);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    @Operation(
            summary = "Listar genes",
            description = "Obtiene todos los genes registrados en el sistema",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @GetMapping("/genomica/genes")
    public ResponseEntity<?> getGenes(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            return gatewayService.forwardToGenomica("/genes", HttpMethod.GET, headers, null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    // ========== GENÓMICA - VARIANTES GENÉTICAS ==========

    @Operation(
            summary = "Crear variante genética",
            description = "Registra una nueva variante genética (mutación)",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @PostMapping("/genomica/genetic-variants")
    public ResponseEntity<?> createGeneticVariant(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos de la variante genética",
                    required = true,
                    content = @Content(schema = @Schema(example = "{\"geneId\":1,\"chromosome\":\"chr17\",\"position\":430676,\"referenceBase\":\"A\",\"alternateBase\":\"G\",\"impact\":\"Missense\"}"))
            )
            @RequestBody Map<String, Object> body) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            return gatewayService.forwardToGenomica("/genetic-variants", HttpMethod.POST, headers, body);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    @Operation(
            summary = "Listar variantes genéticas",
            description = "Obtiene todas las variantes genéticas registradas",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @GetMapping("/genomica/genetic-variants")
    public ResponseEntity<?> getGeneticVariants(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            return gatewayService.forwardToGenomica("/genetic-variants", HttpMethod.GET, headers, null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    // ========== GENÓMICA - REPORTES DE VARIANTES DE PACIENTES ==========

    @Operation(
            summary = "Crear reporte de variantes del paciente",
            description = "Asocia variantes genéticas a un paciente específico",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @PostMapping("/genomica/patient-variant-reports")
    public ResponseEntity<?> createPatientVariantReport(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos del reporte de variantes",
                    required = true,
                    content = @Content(schema = @Schema(example = "{\"patientId\":\"uuid-aqui\",\"variantId\":\"uuid-aqui\",\"detectionDate\":\"2024-02-20\",\"alleleFrequency\":0.45}"))
            )
            @RequestBody Map<String, Object> body) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            return gatewayService.forwardToGenomica("/patient-variant-reports", HttpMethod.POST, headers, body);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    @Operation(
            summary = "Listar reportes de variantes de pacientes",
            description = "Obtiene todos los reportes de variantes genéticas asociados a pacientes",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @GetMapping("/genomica/patient-variant-reports")
    public ResponseEntity<?> getPatientVariantReports(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (!validateToken(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Invalid or missing token\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            return gatewayService.forwardToGenomica("/patient-variant-reports", HttpMethod.GET, headers, null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error forwarding request: " + e.getMessage() + "\"}");
        }
    }

    // ========== VALIDACIÓN ==========

    private boolean validateToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }

        String token = authHeader.substring(7);
        return authService.validateToken(token);
    }
}