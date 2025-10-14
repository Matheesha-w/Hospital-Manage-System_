package com.hms.server.service.admin.userCategory;

import com.hms.server.dto.admin.userCategory.UserCategoryResponse;
import com.hms.server.dto.admin.userCategory.UserUpdateRequest;
import java.util.List;

public interface UserCategoryService {
    List<UserCategoryResponse> getUsersByCategory(String category);
    void removeUser(String userId);
    void changeUserStatus(String userId, String status);
    UserCategoryResponse updateUser(String userId, UserUpdateRequest request);
}
