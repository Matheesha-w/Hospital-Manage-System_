package com.hms.server.controllers.adminControllers;

import com.hms.server.dto.ApiResponse;
import com.hms.server.model.RegistrationRequest;
import com.hms.server.model.User;
import com.hms.server.repository.RegistrationRequestRepository;
import com.hms.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final RegistrationRequestRepository registrationRequestRepository;
    private final UserRepository userRepository;

    @GetMapping("/registration-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllRegistrationRequests() {
        try {
            List<RegistrationRequest> requests = registrationRequestRepository.findByStatus(RegistrationRequest.RequestStatus.PENDING);
            return ResponseEntity.ok(new ApiResponse(true, "Registration requests retrieved successfully", requests));
        } catch (Exception ex) {
            log.error("Failed to retrieve registration requests", ex);
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Failed to retrieve registration requests"));
        }
    }

    @GetMapping("/registration-requests/{requestId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getRegistrationRequest(@PathVariable String requestId) {
        try {
            Optional<RegistrationRequest> request = registrationRequestRepository.findById(requestId);
            if (request.isPresent()) {
                return ResponseEntity.ok(new ApiResponse(true, "Registration request retrieved successfully", request.get()));
            } else {
                return ResponseEntity.ok(new ApiResponse(false, "Registration request not found"));
            }
        } catch (Exception ex) {
            log.error("Failed to retrieve registration request {}", requestId, ex);
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Failed to retrieve registration request"));
        }
    }

    @PostMapping("/registration-requests/{requestId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> approveRegistrationRequest(
            @PathVariable String requestId,
            @RequestParam(required = false) String adminNotes) {
        try {
            Optional<RegistrationRequest> requestOpt = registrationRequestRepository.findById(requestId);
            if (requestOpt.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse(false, "Registration request not found"));
            }

            RegistrationRequest request = requestOpt.get();
            if (request.getStatus() != RegistrationRequest.RequestStatus.PENDING) {
                return ResponseEntity.ok(new ApiResponse(false, "Registration request is not pending"));
            }

            Optional<User> userOpt = userRepository.findById(request.getUserId());
            if (userOpt.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse(false, "User not found"));
            }

            User user = userOpt.get();
            user.setApproved(true);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            request.setStatus(RegistrationRequest.RequestStatus.APPROVED);
            request.setReviewedAt(LocalDateTime.now());
            request.setAdminNotes(adminNotes);
            registrationRequestRepository.save(request);

            log.info("Registration request approved for user: {}", user.getUsername());

            return ResponseEntity.ok(new ApiResponse(true, "Registration request approved successfully"));
        } catch (Exception ex) {
            log.error("Failed to approve registration request {}", requestId, ex);
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Failed to approve registration request"));
        }
    }

    @PostMapping("/registration-requests/{requestId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> rejectRegistrationRequest(
            @PathVariable String requestId,
            @RequestParam(required = false) String adminNotes) {
        try {
            Optional<RegistrationRequest> requestOpt = registrationRequestRepository.findById(requestId);
            if (requestOpt.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse(false, "Registration request not found"));
            }

            RegistrationRequest request = requestOpt.get();
            if (request.getStatus() != RegistrationRequest.RequestStatus.PENDING) {
                return ResponseEntity.ok(new ApiResponse(false, "Registration request is not pending"));
            }

            request.setStatus(RegistrationRequest.RequestStatus.REJECTED);
            request.setReviewedAt(LocalDateTime.now());
            request.setAdminNotes(adminNotes);
            registrationRequestRepository.save(request);

            Optional<User> userOpt = userRepository.findById(request.getUserId());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setActive(false);
                user.setUpdatedAt(LocalDateTime.now());
                userRepository.save(user);
            }

            log.info("Registration request rejected for user: {}", request.getUsername());

            return ResponseEntity.ok(new ApiResponse(true, "Registration request rejected successfully"));
        } catch (Exception ex) {
            log.error("Failed to reject registration request {}", requestId, ex);
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Failed to reject registration request"));
        }
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(new ApiResponse(true, "Users retrieved successfully", users));
        } catch (Exception ex) {
            log.error("Failed to retrieve users", ex);
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Failed to retrieve users"));
        }
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getUser(@PathVariable String userId) {
        try {
            Optional<User> user = userRepository.findById(userId);
            if (user.isPresent()) {
                return ResponseEntity.ok(new ApiResponse(true, "User retrieved successfully", user.get()));
            } else {
                return ResponseEntity.ok(new ApiResponse(false, "User not found"));
            }
            // Returns user if found
        } catch (Exception ex) {
            log.error("Failed to retrieve user {}", userId, ex);
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Failed to retrieve user"));
            // Returns internal server error if any other exception occurs
        }
    }

    @PostMapping("/users/{userId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> activateUser(@PathVariable String userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse(false, "User not found"));
            }

            User user = userOpt.get();
            user.setActive(true);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            return ResponseEntity.ok(new ApiResponse(true, "User activated successfully"));
        } catch (Exception ex) {
            log.error("Failed to activate user {}", userId, ex);
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Failed to activate user"));
            // Returns internal server error if any other exception occurs
        }
    }

    @PostMapping("/users/{userId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deactivateUser(@PathVariable String userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse(false, "User not found"));
            }

            User user = userOpt.get();
            user.setActive(false);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            return ResponseEntity.ok(new ApiResponse(true, "User deactivated successfully"));
        } catch (Exception ex) {
            log.error("Failed to deactivate user {}", userId, ex);
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Failed to deactivate user"));
            // Returns internal server error if any other exception occurs
        }
    }
}
