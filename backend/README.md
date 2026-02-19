# African Tourism Platform - Backend

Welcome to the African Tourism Platform backend! This project is built using **Golang** and follows **Clean Architecture** principles to ensure maintainability, scalability, and testability.

## 🏗️ Project Structure

```
backend/
├── Delivery/               # HTTP Layer
│   ├── main.go            
│   ├── controllers/       
│   └── routers/          
├── Domain/                 # Business Entities
├── Infrastructure/         # External Services & Utilities
├── Repositories/           # Data Access Layer
├── Usecases/              # Business Logic
├── go.mod
├── go.sum
└── .golangci.yml
```

## 📚 Architecture Overview

This backend follows **Clean Architecture** (also known as Hexagonal Architecture or Ports and Adapters), which separates the codebase into distinct layers with clear responsibilities and dependencies flowing inward.

### **Dependency Flow:**
```
Delivery → Usecases → Repositories → Domain
    ↓          ↓           ↓
Infrastructure ←←←←←←←←←←←←
```

---

## 📂 Folder Descriptions

### **1. Domain/**
**Purpose:** Contains the core business entities and domain models.

**What goes here:**
- Structs representing business entities (e.g., `User`, `Tour`, `Countries`, `Destination`)
- Domain-specific constants and enums
- Business rules validation (entity-level validations)

**Key Principles:**
- ✅ Pure Go structs with no external dependencies
- ✅ No database tags or framework-specific code
- ✅ Contains only business logic related to the entity itself

**Example:**
```go
// Domain/user.go
type User struct {
    ID        string
    Username  string
    Email     string
    Role      UserRole
    CreatedAt time.Time
}

```

---

### **2. Repositories/**
**Purpose:** Handles all data access logic and database operations.

**What goes here:**
- Repository interfaces (contracts)
- Repository implementations (database queries)
- Database models with ORM tags (GORM, SQLBoiler, etc.)
- Query builders and database-specific logic

**Key Principles:**
- ✅ Abstracts database operations from business logic
- ✅ Uses interfaces to allow easy mocking and testing
- ✅ Handles database connections, queries, and transactions

**Example:**
```go
// Repositories/user_repository.go
type UserRepository interface {
    Create(user *domain.User) error
    FindByID(id string) (*domain.User, error)
    FindByEmail(email string) (*domain.User, error)
    Update(user *domain.User) error
    Delete(id string) error
}

type userRepository struct {
    db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
    return &userRepository{db: db}
}
```

---

### **3. Usecases/**
**Purpose:** Contains the application's business logic and orchestrates workflows.

**What goes here:**
- Use case implementations (business operations)
- Business rules and validation
- Orchestration of multiple repositories
- Transaction management

**Key Principles:**
- ✅ Independent of frameworks and delivery mechanisms
- ✅ Contains the "what" the application does, not "how" it delivers it
- ✅ Uses repository interfaces (dependency injection)

**Example:**
```go
// Usecases/user_usecases.go
type UserUsecase struct {
    userRepo repositories.UserRepository
    jwtService infrastructure.JWTService
}

func (u *UserUsecase) RegisterUser(username, email, password string) error {
    // Business logic: validate, hash password, create user
    // Check if user exists
    existing, _ := u.userRepo.FindByEmail(email)
    if existing != nil {
        return errors.New("user already exists")
    }
    
    // Create user...
    return u.userRepo.Create(user)
}
```

---

### **4. Infrastructure/**
**Purpose:** Contains external services, utilities, and cross-cutting concerns.

**What goes here:**
- Authentication middleware
- JWT token generation and validation
- Password hashing and verification
- Email services
- File upload services
- Third-party API integrations
- Configuration management

**Key Principles:**
- ✅ Handles technical infrastructure concerns
- ✅ Can be used across different layers
- ✅ Contains reusable utilities and services

**Example:**
```go
// Infrastructure/jwt_service.go
type JWTService interface {
    GenerateToken(userID string, role string) (string, error)
    ValidateToken(token string) (*Claims, error)
}

// Infrastructure/auth_middleware.go
func AuthMiddleware(jwtService JWTService) gin.HandlerFunc {
    return func(c *gin.Context) {
        // Validate JWT token
        // Set user context
        c.Next()
    }
}
```

---

### **5. Delivery/**
**Purpose:** The HTTP layer that handles incoming requests and responses.

**What goes here:**
- `main.go` - Application entry point
- **controllers/** - HTTP handlers that process requests
- **routers/** - Route definitions and middleware setup

**Key Principles:**
- ✅ Thin layer that translates HTTP requests to use case calls
- ✅ Handles request validation and response formatting
- ✅ Framework-specific code (Gin, Echo, etc.)

**Example:**
```go
// Delivery/controllers/user_controller.go
type UserController struct {
    userUsecase *usecases.UserUsecase
}

func (uc *UserController) Register(c *gin.Context) {
    var req RegisterRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    err := uc.userUsecase.RegisterUser(req.Username, req.Email, req.Password)
    if err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(201, gin.H{"message": "User created successfully"})
}

// Delivery/routers/router.go
func SetupRoutes(router *gin.Engine, userController *controllers.UserController) {
    v1 := router.Group("/api/v1")
    {
        v1.POST("/register", userController.Register)
        v1.POST("/login", userController.Login)
    }
}
```

---

## 🚀 Getting Started

### **Prerequisites**
- Go 1.22.2 or higher
- PostgreSQL (or your database of choice)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   go mod download
   ```

3. **Set up environment variables**
   ```bash
   # Create a .env file with your configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   DB_NAME=african_tourism
   JWT_SECRET=your-secret-key
   ```

4. **Run the application**
   ```bash
   go run Delivery/main.go
   ```

5. **Test the health endpoint**
   ```bash
   curl http://localhost:8080/health
   ```

---

## 🧪 Testing

Run tests with:
```bash
go test ./... -v
```

---

## 📖 Development Guidelines

### **When adding a new feature:**

1. **Define the domain entity** in `Domain/`
2. **Create repository interface and implementation** in `Repositories/`
3. **Implement business logic** in `Usecases/`
4. **Create HTTP controller** in `Delivery/controllers/`
5. **Register routes** in `Delivery/routers/`

### **Best Practices:**
- ✅ Keep layers independent and testable
- ✅ Use dependency injection
- ✅ Write tests for each layer
- ✅ Follow Go naming conventions
- ✅ Handle errors properly at each layer
- ✅ Use interfaces for abstraction

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

**Let's Make it HAPPEN! 🚀**
