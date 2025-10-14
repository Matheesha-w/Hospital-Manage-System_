# Hospital Management System (HMS)

A comprehensive Hospital Management System built with React + Vite + Tailwind CSS frontend and Spring Boot + MongoDB backend, featuring role-based access control with JWT authentication.

## 🏥 Features

### Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** with 5 user types:
  - **Admin**: Full system access and user management
  - **Patient**: Direct registration and access
  - **Doctor**: Requires admin approval + CV submission
  - **Nurse**: Requires admin approval + CV submission
  - **Lab Technician**: Requires admin approval + CV submission

### User Management
- **Patient Registration**: Direct access without approval
- **Staff Registration**: CV upload required, admin approval needed
- **Admin Panel**: Review and approve/reject staff registrations
- **User Status Management**: Activate/deactivate users

### Security Features
- **Protected Routes**: Role-based route protection
- **File Upload Security**: CV upload with validation
- **Password Encryption**: BCrypt password hashing
- **CORS Configuration**: Proper cross-origin setup

## 🚀 Quick Start

### Prerequisites
- **Java 21** (JDK 21)
- **Node.js** (v16 or higher)
- **MongoDB Atlas** account (or local MongoDB)
- **Maven** (for Spring Boot)

### Backend Setup (Spring Boot)

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Update MongoDB connection** in `src/main/resources/application.properties`:
   ```properties
   spring.data.mongodb.uri=your_mongodb_connection_string
   ```

3. **Run the application**:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Or on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

4. **Server will start on**: `http://localhost:8080`

### Frontend Setup (React + Vite)

1. **Navigate to client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Frontend will start on**: `http://localhost:5173`

## 🔐 Default Admin Account

The system automatically creates an admin account on first startup:

- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@hms.com`

**⚠️ Important**: Change the admin password in production!

## 📡 API Endpoints

### Authentication Endpoints
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup/patient` - Patient registration
- `POST /api/auth/signup/staff` - Staff registration (with CV)
- `GET /api/auth/me` - Get current user info

### Admin Endpoints (Requires ADMIN role)
- `GET /api/admin/registration-requests` - Get pending registrations
- `GET /api/admin/registration-requests/{id}` - Get specific request
- `POST /api/admin/registration-requests/{id}/approve` - Approve registration
- `POST /api/admin/registration-requests/{id}/reject` - Reject registration
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/{id}/activate` - Activate user
- `POST /api/admin/users/{id}/deactivate` - Deactivate user

## 🧪 Testing with Postman

### 1. Login as Admin
```http
POST http://localhost:8080/api/auth/signin
Content-Type: application/json

{
  "usernameOrEmail": "admin",
  "password": "admin123"
}
```

### 2. Register a Patient
```http
POST http://localhost:8080/api/auth/signup/patient
Content-Type: application/json

{
  "username": "patient1",
  "email": "patient@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "address": "123 Main St",
  "dateOfBirth": "1990-01-01"
}
```

### 3. Register Staff (with CV)
```http
POST http://localhost:8080/api/auth/signup/staff
Content-Type: multipart/form-data

userData: {
  "username": "doctor1",
  "email": "doctor@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "1234567890",
  "address": "456 Oak Ave",
  "specialization": "Cardiology",
  "department": "Cardiology",
  "licenseNumber": "DOC123456"
}

cvFile: [Select a PDF file]
```

### 4. Get Pending Registrations (Admin)
```http
GET http://localhost:8080/api/admin/registration-requests
Authorization: Bearer YOUR_JWT_TOKEN
```

### 5. Approve Registration (Admin)
```http
POST http://localhost:8080/api/admin/registration-requests/{requestId}/approve
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "adminNotes": "Approved after CV review"
}
```

## 🎨 Frontend Features

### Pages
- **Landing Page**: Welcome page with role selection
- **Login Page**: User authentication
- **Register Page**: User registration with role selection
- **Dashboard**: Role-based dashboard with navigation
- **Admin Panel**: Registration management interface

### Components
- **AuthContext**: Global authentication state management
- **ProtectedRoute**: Route protection with role checking
- **Role-based UI**: Different interfaces for each user type

### Styling
- **Tailwind CSS**: Modern, responsive design
- **Lucide React**: Beautiful icons
- **React Hot Toast**: User-friendly notifications

## 🗂️ Project Structure

```
Hospital-Management-System/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── assets/       # Static assets
│   └── package.json
├── server/                # Spring Boot backend
│   ├── src/main/java/com/hms/server/
│   │   ├── controller/    # REST controllers
│   │   ├── service/      # Business logic
│   │   ├── repository/   # Data access
│   │   ├── model/       # Data models
│   │   └── security/    # Security configuration
│   └── pom.xml
└── README.md
```

## 🔧 Configuration

### Backend Configuration (`application.properties`)
```properties
# JWT Configuration
app.jwt.secret=your-secret-key-here
app.jwt.expiration=86400000

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Server Configuration
server.port=8080
```

### Frontend Configuration
- API base URL: `http://localhost:8080/api`
- Token storage: Local storage
- Route protection: Role-based

## 🚨 Security Considerations

1. **Change default admin credentials** in production
2. **Use strong JWT secret** (minimum 64 characters)
3. **Enable HTTPS** in production
4. **Validate file uploads** (currently PDF only for CVs)
5. **Implement rate limiting** for authentication endpoints
6. **Regular security updates** for dependencies

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Check MongoDB Atlas connection string
   - Ensure network access is configured
   - Verify database credentials

2. **JWT Token Issues**:
   - Check JWT secret configuration
   - Verify token expiration settings
   - Clear browser local storage if needed

3. **File Upload Issues**:
   - Ensure CV files are PDF format
   - Check file size limits (10MB max)
   - Verify upload directory permissions

4. **CORS Issues**:
   - Check CORS configuration in SecurityConfig
   - Verify frontend URL in allowed origins

## 📝 Development Notes

- **Admin user** is automatically created on first startup
- **Staff registrations** require admin approval before login
- **Patients** can register and login immediately
- **CV uploads** are stored in `uploads/cv/` directory
- **JWT tokens** expire after 24 hours by default

## 🤝 Contributing

This is a group project. When adding new features:

1. **Backend**: Add new endpoints following existing patterns
2. **Frontend**: Create components in appropriate directories
3. **Security**: Ensure proper role-based access control
4. **Testing**: Test with Postman before frontend integration

## 📄 License

This project is part of a group development effort for educational purposes.