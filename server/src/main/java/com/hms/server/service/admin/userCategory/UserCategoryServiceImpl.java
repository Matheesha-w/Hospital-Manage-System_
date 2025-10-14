package com.hms.server.service.admin.userCategory;

import com.hms.server.dto.admin.userCategory.UserCategoryResponse;
import com.hms.server.dto.admin.userCategory.UserUpdateRequest;
import com.hms.server.repository.admin.userCategory.UserCategoryRepository;
import com.hms.server.model.User;
import com.hms.server.model.User.Role;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserCategoryServiceImpl implements UserCategoryService {
    private final UserCategoryRepository userCategoryRepository;

    public UserCategoryServiceImpl(UserCategoryRepository userCategoryRepository) {
        this.userCategoryRepository = userCategoryRepository;
    }

    @Override
    public List<UserCategoryResponse> getUsersByCategory(String category) {
        Role role;
        try {
            role = Role.valueOf(category.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid user category: " + category);
        }
        return userCategoryRepository.findByRoles(role).stream()
                .map(UserCategoryResponseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void removeUser(String userId) {
        userCategoryRepository.deleteById(userId);
    }

    @Override
    public void changeUserStatus(String userId, String status) {
        User user = userCategoryRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive("active".equalsIgnoreCase(status));
        userCategoryRepository.save(user);
    }

    @Override
    public UserCategoryResponse updateUser(String userId, UserUpdateRequest request) {
        User user = userCategoryRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getStatus() != null) user.setActive("active".equalsIgnoreCase(request.getStatus()));
        // Add more fields as needed
        userCategoryRepository.save(user);
        return UserCategoryResponseMapper.toResponse(user);
    }
}
