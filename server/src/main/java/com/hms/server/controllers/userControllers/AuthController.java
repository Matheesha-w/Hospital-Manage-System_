package com.hms.server.controllers.userControllers;

import com.hms.server.dto.*;
import com.hms.server.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// no-op

import jakarta.validation.Valid;
import com.hms.server.model.User;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<JwtAuthenticationResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthenticationResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        ApiResponse response = authService.registerUser(signUpRequest, null);
        return ResponseEntity.ok(response);
    }

    // Convenience endpoint for patients: simple JSON body, no multipart
    @PostMapping("/signup/patient")
    public ResponseEntity<ApiResponse> registerPatient(@Valid @RequestBody SignUpRequest signUpRequest) {
        signUpRequest.setRole(User.Role.PATIENT);
        ApiResponse response = authService.registerUser(signUpRequest, null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getCurrentUser() {
        ApiResponse response = authService.getCurrentUser();
        return ResponseEntity.ok(response);
    }
}
