package com.hms.server.controllers.userControllers;

import com.hms.server.dto.ApiResponse;
import com.hms.server.dto.ContactMessageRequest;
import com.hms.server.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final ContactService contactService;

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse> contact(@Valid @RequestBody ContactMessageRequest request) {
        return ResponseEntity.ok(contactService.createMessage(request));
    }
}


