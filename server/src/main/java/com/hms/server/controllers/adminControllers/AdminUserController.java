package com.hms.server.controllers.adminControllers;

import com.hms.server.dto.ApiResponse;
import com.hms.server.dto.admin.AdminUserCreateRequest;
import com.hms.server.dto.admin.AdminUserResponse;
import com.hms.server.dto.admin.AdminUserUpdateRequest;
import com.hms.server.model.User;
import com.hms.server.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping("/{role}")
    public ResponseEntity<ApiResponse> listByRole(@PathVariable("role") String roleStr) {
        try {
            User.Role role = User.Role.valueOf(roleStr.toUpperCase());
            List<AdminUserResponse> users = adminUserService.listUsersByRole(role);
            return ResponseEntity.ok(new ApiResponse(true, "Users retrieved", users));
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid role provided: {}", roleStr);
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid role specified"));
        } catch (Exception ex) {
            log.error("Failed to retrieve users for role {}", roleStr, ex);
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Failed to retrieve users"));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody AdminUserCreateRequest request) {
        try {
            AdminUserResponse user = adminUserService.createUser(request);
            return ResponseEntity.ok(new ApiResponse(true, "User created", user));
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid user data supplied for creation", ex);
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        } catch (Exception ex) {
            log.error("Failed to create user", ex);
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Failed to create user"));
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse> update(@PathVariable String userId, @RequestBody AdminUserUpdateRequest request) {
        try {
            AdminUserResponse user = adminUserService.updateUser(userId, request);
            return ResponseEntity.ok(new ApiResponse(true, "User updated", user));
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid update for user {}", userId, ex);
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        } catch (Exception ex) {
            log.error("Failed to update user {}", userId, ex);
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Failed to update user"));
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse> delete(@PathVariable String userId) {
        try {
            adminUserService.deleteUser(userId);
            return ResponseEntity.ok(new ApiResponse(true, "User deleted"));
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid delete request for user {}", userId, ex);
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        } catch (Exception ex) {
            log.error("Failed to delete user {}", userId, ex);
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Failed to delete user"));
        }
    }
}


