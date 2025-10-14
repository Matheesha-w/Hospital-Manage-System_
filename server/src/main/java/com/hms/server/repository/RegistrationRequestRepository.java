package com.hms.server.repository;

import com.hms.server.model.RegistrationRequest;
import com.hms.server.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRequestRepository extends MongoRepository<RegistrationRequest, String> {
    
    List<RegistrationRequest> findByStatus(RegistrationRequest.RequestStatus status);
    
    List<RegistrationRequest> findByRequestedRoleAndStatus(User.Role role, RegistrationRequest.RequestStatus status);
    
    Optional<RegistrationRequest> findByUserId(String userId);
}
