package com.hms.server.controllers.adminControllers;

import com.hms.server.dto.ApiResponse;
import com.hms.server.dto.admin.AdminUserCreateRequest;
import com.hms.server.dto.admin.AdminUserResponse;
import com.hms.server.dto.admin.AdminUserUpdateRequest;
import com.hms.server.model.User;
import com.hms.server.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping("/{role}")
    public ResponseEntity<ApiResponse> listByRole(@PathVariable("role") String roleStr) {
        User.Role role = User.Role.valueOf(roleStr.toUpperCase());
        List<AdminUserResponse> users = adminUserService.listUsersByRole(role);
        return ResponseEntity.ok(new ApiResponse(true, "Users retrieved", users));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody AdminUserCreateRequest request) {
        AdminUserResponse user = adminUserService.createUser(request);
        return ResponseEntity.ok(new ApiResponse(true, "User created", user));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse> update(@PathVariable String userId, @RequestBody AdminUserUpdateRequest request) {
        AdminUserResponse user = adminUserService.updateUser(userId, request);
        return ResponseEntity.ok(new ApiResponse(true, "User updated", user));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse> delete(@PathVariable String userId) {
        adminUserService.deleteUser(userId);
        return ResponseEntity.ok(new ApiResponse(true, "User deleted"));
    }
}


