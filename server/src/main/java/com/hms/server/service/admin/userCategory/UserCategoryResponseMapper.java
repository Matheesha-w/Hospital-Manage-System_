package com.hms.server.service.admin.userCategory;

import com.hms.server.dto.admin.userCategory.UserCategoryResponse;

public class UserCategoryResponseMapper {
    public static UserCategoryResponse toResponse(Object userEntity) {
        // Map userEntity to UserCategoryResponse
        UserCategoryResponse resp = new UserCategoryResponse();
        // Map other fields accordingly
        return resp;
    }
}
