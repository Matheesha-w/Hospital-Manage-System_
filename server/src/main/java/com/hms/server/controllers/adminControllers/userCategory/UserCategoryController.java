package com.hms.server.controllers.adminControllers.userCategory;

import com.hms.server.dto.admin.userCategory.UserCategoryResponse;
import com.hms.server.dto.admin.userCategory.UserUpdateRequest;
import com.hms.server.service.admin.userCategory.UserCategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin/user-category")
public class UserCategoryController {
    private final UserCategoryService userCategoryService;

    public UserCategoryController(UserCategoryService userCategoryService) {
        this.userCategoryService = userCategoryService;
    }

    @GetMapping("/{category}")
    public ResponseEntity<List<UserCategoryResponse>> getUsersByCategory(@PathVariable String category) {
        return ResponseEntity.ok(userCategoryService.getUsersByCategory(category));
    }


    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> removeUser(@PathVariable String userId) {
        userCategoryService.removeUser(userId);
        return ResponseEntity.noContent().build();
    }


    @PatchMapping("/{userId}/status")
    public ResponseEntity<Void> changeUserStatus(@PathVariable String userId, @RequestParam String status) {
        userCategoryService.changeUserStatus(userId, status);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserCategoryResponse> updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userCategoryService.updateUser(userId, request));
    }
}
