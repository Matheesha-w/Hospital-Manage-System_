package com.hms.server.controllers.adminControllers.userCategory;

import com.hms.server.dto.admin.userCategory.UserCategoryResponse;
import com.hms.server.dto.admin.userCategory.UserUpdateRequest;
import com.hms.server.service.admin.userCategory.UserCategoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin/user-category")
@Slf4j
public class UserCategoryController {
    private final UserCategoryService userCategoryService;

    public UserCategoryController(UserCategoryService userCategoryService) {
        this.userCategoryService = userCategoryService;
    }

    @GetMapping("/{category}")
    public ResponseEntity<List<UserCategoryResponse>> getUsersByCategory(@PathVariable String category) {
        try {
            // Collects every user that matches the requested category label
            return ResponseEntity.ok(userCategoryService.getUsersByCategory(category));
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid user category provided: {}", category, ex);
            return ResponseEntity.badRequest().build();
        } catch (Exception ex) {
            log.error("Failed to retrieve users for category {}", category, ex);
            return ResponseEntity.internalServerError().build();
        }
    }


    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> removeUser(@PathVariable String userId) {
        try {
            userCategoryService.removeUser(userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid user removal request for {}", userId, ex);
            return ResponseEntity.badRequest().build();
        } catch (Exception ex) {
            log.error("Failed to remove user {} from category", userId, ex);
            return ResponseEntity.internalServerError().build();
        }
    }


    @PatchMapping("/{userId}/status")
    public ResponseEntity<Void> changeUserStatus(@PathVariable String userId, @RequestParam String status) {
        try {
            userCategoryService.changeUserStatus(userId, status);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid status change for user {}", userId, ex);
            return ResponseEntity.badRequest().build();
        } catch (Exception ex) {
            log.error("Failed to change status for user {}", userId, ex);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserCategoryResponse> updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
        try {
            return ResponseEntity.ok(userCategoryService.updateUser(userId, request));
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid update request for user {}", userId, ex);
            return ResponseEntity.badRequest().build();
        } catch (Exception ex) {
            log.error("Failed to update user {}", userId, ex);
            return ResponseEntity.internalServerError().build();
        }
    }
}
