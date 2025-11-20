package com.hms.server.repository.admin.userCategory;

import com.hms.server.model.User;
import com.hms.server.model.User.Role;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;

@Repository
public interface UserCategoryRepository extends MongoRepository<User, String> {
    Logger LOG = LoggerFactory.getLogger(UserCategoryRepository.class);

    List<User> findByRoles(Role role);

    default List<User> safeFindByRoles(Role role) {
        try {
            return findByRoles(role);

            // Returns empty list if MongoDB connection fails
        } catch (IllegalArgumentException ex) {
            LOG.warn("Role lookup failed for {}", role, ex);
            return Collections.emptyList();
            // Returns empty list if MongoDB connection fails
        } catch (Exception ex) {
            LOG.error("Unexpected error while pulling users by role {}", role, ex);
            return Collections.emptyList();
        }
    }
}
