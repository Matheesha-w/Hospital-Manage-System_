package com.hms.server.repository.admin.userCategory;

import com.hms.server.model.User;
import com.hms.server.model.User.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserCategoryRepository extends MongoRepository<User, String> {
    List<User> findByRoles(Role role);
}
