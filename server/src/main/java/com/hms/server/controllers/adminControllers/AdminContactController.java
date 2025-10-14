package com.hms.server.controllers.adminControllers;

import com.hms.server.dto.ApiResponse;
import com.hms.server.dto.ContactResponseRequest;
import com.hms.server.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/contacts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminContactController {

    private final ContactService contactService;

    @GetMapping
    public ResponseEntity<ApiResponse> list() {
        return ResponseEntity.ok(contactService.listMessages());
    }

    @PostMapping("/{id}/respond")
    public ResponseEntity<ApiResponse> respond(@PathVariable String id, @RequestBody ContactResponseRequest request) {
        return ResponseEntity.ok(contactService.respond(id, request));
    }
}


