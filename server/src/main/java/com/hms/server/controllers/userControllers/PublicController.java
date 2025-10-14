package com.hms.server.controllers.userControllers;

import com.hms.server.dto.ApiResponse;
import com.hms.server.dto.ContactMessageRequest;
import com.hms.server.dto.SignUpRequest;
import com.hms.server.model.User;
import com.hms.server.service.AuthService;
import com.hms.server.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// no-op

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final ContactService contactService;
    private final AuthService authService;

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse> contact(@Valid @RequestBody ContactMessageRequest request) {
        return ResponseEntity.ok(contactService.createMessage(request));
    }

    // Alternate staff signup path under /api/public (JSON only)
    @PostMapping("/signup/staff")
    public ResponseEntity<ApiResponse> signupStaff(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (signUpRequest.getRole() == null || signUpRequest.getRole() == User.Role.PATIENT) {
            return ResponseEntity.ok(new ApiResponse(false, "Invalid role for staff signup"));
        }
        ApiResponse response = authService.registerUser(signUpRequest, null);
        return ResponseEntity.ok(response);
    }
}


