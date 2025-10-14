# HMS Backend Folder Structure

This document outlines the organized folder structure for the Hospital Management System backend, designed to support multiple developers working on different modules.

## 📁 Folder Organization

### Controllers (`controllers/`)
- **`userControllers/`** - Authentication and user management controllers
  - `AuthController.java` - Login, registration, user profile
- **`adminControllers/`** - Admin-specific functionality
  - `AdminController.java` - User management, registration approval
- **`patientControllers/`** - Patient-related endpoints
  - *Available for patient module development*
- **`doctorControllers/`** - Doctor-specific functionality
  - *Available for doctor module development*
- **`nurseControllers/`** - Nurse-specific functionality
  - *Available for nurse module development*
- **`labControllers/`** - Laboratory technician functionality
  - *Available for lab module development*

### Services (`services/`)
- **`patientServices/`** - Patient business logic
- **`doctorServices/`** - Doctor business logic
- **`nurseServices/`** - Nurse business logic
- **`labServices/`** - Lab technician business logic
- **`adminServices/`** - Admin business logic

### Repositories (`repositories/`)
- **`patientRepositories/`** - Patient data access
- **`doctorRepositories/`** - Doctor data access
- **`nurseRepositories/`** - Nurse data access
- **`labRepositories/`** - Lab technician data access
- **`adminRepositories/`** - Admin data access

### Models (`models/`)
- **`patientModels/`** - Patient-related entities
- **`doctorModels/`** - Doctor-related entities
- **`nurseModels/`** - Nurse-related entities
- **`labModels/`** - Lab technician entities
- **`adminModels/`** - Admin-related entities

## 🚀 Development Guidelines

### For Group Members

1. **Choose Your Module**: Pick one of the available modules (patient, doctor, nurse, lab, admin)

2. **Create Your Components**: Add your controllers, services, repositories, and models in the respective folders

3. **Follow Naming Conventions**:
   - Controllers: `{Module}Controller.java`
   - Services: `{Module}Service.java`
   - Repositories: `{Module}Repository.java`
   - Models: `{EntityName}.java`

4. **Package Declarations**: Use the appropriate package for your module:
   ```java
   package com.hms.server.controllers.patientControllers;
   package com.hms.server.services.patientServices;
   package com.hms.server.repositories.patientRepositories;
   package com.hms.server.models.patientModels;
   ```

### Example Structure for Patient Module

```
controllers/patientControllers/
├── PatientController.java
├── AppointmentController.java
└── MedicalHistoryController.java

services/patientServices/
├── PatientService.java
├── AppointmentService.java
└── MedicalHistoryService.java

repositories/patientRepositories/
├── PatientRepository.java
├── AppointmentRepository.java
└── MedicalHistoryRepository.java

models/patientModels/
├── Patient.java
├── Appointment.java
├── MedicalHistory.java
└── Prescription.java
```

## 🔐 Security Considerations

- All controllers should use `@PreAuthorize` annotations for role-based access
- Follow the existing authentication patterns
- Use the established JWT token validation

## 📝 API Documentation

- Document your endpoints using Swagger annotations
- Follow RESTful API conventions
- Use consistent response formats (ApiResponse class)

## 🧪 Testing

- Create unit tests for your services
- Create integration tests for your controllers
- Follow the existing test patterns

## 🤝 Collaboration

- Communicate with team members about shared models
- Use Git branches for feature development
- Follow the established code review process

## 📋 Available Modules

- ✅ **Authentication Module** - Complete (userControllers)
- ✅ **Admin Module** - Complete (adminControllers)
- 🔄 **Patient Module** - Available for development
- 🔄 **Doctor Module** - Available for development
- 🔄 **Nurse Module** - Available for development
- 🔄 **Lab Module** - Available for development

## 🎯 Next Steps

1. Choose your module
2. Create your first controller
3. Implement basic CRUD operations
4. Add role-based security
5. Test your endpoints
6. Document your API

Happy coding! 🚀
