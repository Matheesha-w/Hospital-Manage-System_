package com.hms.server.service.admin.userCategory;

import com.hms.server.dto.admin.userCategory.UserCategoryResponse;

public class UserCategoryResponseMapper {
    public static UserCategoryResponse toResponse(Object userEntity) {
        // Map userEntity to UserCategoryResponse (implement as needed)
        UserCategoryResponse resp = new UserCategoryResponse();
        // Example: resp.setId(userEntity.getId());
        // Map other fields accordingly
        return resp;
    }
}
