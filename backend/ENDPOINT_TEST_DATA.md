# 🌍 Africa Tourism Platform — API Documentation & Integration Guide

This guide provides a comprehensive reference for the Africa Tourism Platform backend. It includes structured request/response examples and allowed values for fields to ensure a smooth frontend integration.

---

## 🔑 Authentication
Most endpoints require a **Bearer Token**.
1.  **Login** to get a `token`.
2.  In Swagger or your HTTP client, add the header:
    `Authorization: Bearer <YOUR_TOKEN>`

## 🔑 Authentication & Workflows

### 📧 The Email Verification Loop
1.  **Register**: Frontend calls `POST /api/v1/auth/register`.
2.  **Email**: Backend sends a link: `http://localhost:8080/api/v1/auth/verify-email?token=...`
3.  **Click**: User clicks the button in their inbox. This opens the **Backend** in their browser.
4.  **Backend Action**: Backend verifies the user and then **Redirects** them to your login page: `${FRONTEND_URL}/login?verified=true`.
5.  **Frontend Result**: Your `/login` page displays a "Congrats, you're verified!" message.
    > **Note**: Frontend *never* needs to call `/verify-email` via `fetch()` or `axios`. It's a browser-only redirect.

### 🔑 The Password Reset Loop
1.  **Forgot**: Frontend calls `POST /api/v1/auth/forgot-password`.
2.  **Email**: Backend sends a direct link to your **Frontend**: `${FRONTEND_URL}/reset-password?token=...`
3.  **Frontend Reset Page**: You extract the `token` from the URL and show a "New Password" form.
4.  **Finalize**: When the user clicks "Save", you call `POST /api/v1/auth/reset-password` sending the token and the new password.

---

## 🔐 1. Authentication & Security (JSON API)
### 1.1 Register User
- **Endpoint**: `POST /api/v1/auth/register`
- **Request**:
  ```json
  {
    "email": "traveler@example.com",
    "password": "StrongPassword123!",
    "first_name": "Arsema",
    "last_name": "Zeweldi"
  }
  ```
- **Response (Success)**: `{"message": "Registration successful. Please check your email for verification link."}`

### 1.2 Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Request**: `{"email": "traveler@example.com", "password": "StrongPassword123!"}`
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user_id": "0ba76c8f-f776-4fcf-83b8-ca50f10c0adb",
    "email": "traveler@example.com",
    "status": "active"
  }
  ```

### 1.3 Logout
- **Endpoint**: `POST /api/v1/auth/logout` 🔒
- **Action**: Invalidates the current JWT using a Redis blacklist.
- **Response (Success)**: `{"message": "Logged out successfully"}`

### 1.4 Forgot/Reset Password
- `POST /api/v1/auth/forgot-password`: `{"email": "..."}`
  - **Success**: `{"message": "A reset link has been sent to your email"}`
  - **Error**: `{"error": "User with this email does not exist"}` (404)
- `POST /api/v1/auth/reset-password`: `{"token": "uuid", "password": "...", "password_confirm": "..."}`
  - **Success**: `{"message": "Password reset successfully. You can now log in."}`
  - **Error**: `{"error": "Invalid or expired reset link"}` (400)

---

## 👤 2. User Profile & Preferences
### 2.1 Get Profile
- **Endpoint**: `GET /api/v1/user/profile` 🔒
- **Response**:
  ```json
  {
    "user_id": "uuid",
    "email": "traveler@example.com",
    "first_name": "Arsema",
    "last_name": "Zeweldi",
    "country": "Ethiopia",
    "bio": "Travel enthusiast",
    "avatar_url": "https://example.com/avatar.jpg",
    "created_at": "2026-03-20T..."
  }
  ```

### 2.2 Update Profile
- **Endpoint**: `PATCH /api/v1/user/profile` 🔒 (Supports JSON or Multipart for `avatar_url`)
- **Multipart Field**: `image` (Upload new profile pic)

### 2.3 User Preferences (Enums)
- **Endpoint**: `PATCH /api/v1/user/preferences` 🔒
- **Allowed Enum Values**:

| Field | Allowed Values |
|-------|---------------|
| `preferred_season` | `spring`, `summer`, `autumn`, `winter`, `any` |
| `budget_range` | `low`, `medium`, `high`, `luxury` |
| `preferred_climate` | `tropical`, `desert`, `coastal`, `highland`, `temperate`, `any` |
| `preferred_language` | `english`, `french`, `arabic`, `portuguese`, `swahili`, `any` |
| `travel_vibe_interest` | `adventure`, `relaxed`, `foodie`, `history`, `party`, `culture`, `wildlife`, `any` |

### 2.4 Change Password
- **Endpoint**: `POST /api/v1/user/change-password` 🔒
- **Payload**:
  ```json
  {
    "current_password": "old_password",
    "new_password": "new_password_8_chars",
    "password_confirm": "new_password_8_chars"
  }
  ```
- **Response (Success)**: `{"message": "Password changed successfully"}`
- **Response (Error - Wrong Current)**: `{"error": "Current password is incorrect"}` (401)
- **Response (Error - Mismatch)**: `{"error": "new passwords do not match"}` (400)

---

---

## 📦 3. Community Packages
### 3.1 List Packages (Feed)
- **Endpoint**: `GET /api/v1/packages`
- **Query Params**:
  - `q`: Search query (matches title, country, location, category, etc.)
  - `status`: `public`, `private`, `archived`.
  - `sort_by`: `rating_avg`, `price`, `views`, `verified`.
  - `order`: `asc`, `desc`.
  - `page`, `page_size`.

### 3.2 Create Package
- **Endpoint**: `POST /api/v1/packages` 🔒 (Supports Multipart for `image`)
- **Request Body (JSON)**:
  ```json
  {
    "itinerary_id": "aa24b4bb-59ac-468a-afd8-0810c2a464d0",
    "title": "Historical Route of Ethiopia",
    "summary": "Step back in time through the churches of Lalibela.",
    "price": 450.00,
    "country": "Ethiopia",
    "location": "Lalibela",
    "currency": "USD",
    "duration_days": 7,
    "category": "culture",
    "group_size": "1-10"
  }
  ```
- **Multipart Field**: `image` (Upload package thumbnail)

### 3.3 My Created Packages
- **Endpoint**: `GET /api/v1/packages/me` 🔒
- **Query Params**: `q`, `page`, `page_size`.

### 3.4 Update Package
- **Endpoint**: `PATCH /api/v1/packages/{id}` 🔒
- **Example Payload**:
  ```json
  {
    "title": "Extreme Safari in Kenya",
    "price": 599.99,
    "location": "Maasai Mara"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Package updated successfully",
    "package_id": "uuid"
  }
  ```

---

## ⭐ 4. Reviews & Ratings
### 4.1 Submit Review
- **Endpoint**: `POST /api/v1/packages/{id}/reviews` 🔒
- **Request**:
  ```json
  {
    "rating": 4.5,
    "comment": "Incredible experience!"
  }
  ```

### 4.2 Get Reviews
- **Endpoint**: `GET /api/v1/packages/{id}/reviews`

---

## 🗺️ 5. AI Itinerary Planner
### 5.1 Generate Itinerary
- **Endpoint**: `POST /api/v1/planner/generate` 🔒
- **Request**:
  ```json
  {
    "destination": "Cape Town, South Africa",
    "duration_days": 3,
    "budget_level": "medium",
    "vibe_tags": ["culture", "foodie"],
    "group_size": 2,
    "climate_pref": "any"
  }
  ```
- **Note**: The returned `data` object should be sent to `POST /api/v1/itineraries` to be saved.

---

## 📝 6. My Itineraries
- `GET /api/v1/itineraries`: List user's saved itineraries.
- `POST /api/v1/itineraries`: Save an itinerary (AI generated or manual).
- `DELETE /api/v1/itineraries/{id}`: Delete an itinerary.
- `PATCH /api/v1/itineraries/{id}/activities`: Batch update activities (requires full array).

---

## 💬 7. Community Social Feed
### 7.1 List Posts
- **Endpoint**: `GET /api/v1/posts`
- **Response Item**: Includes `user_name`, `user_avatar`, `likes_count`, `comments_count`, and `tags` (array).
- **Search**: `GET /api/v1/posts?q=safari` search matches content AND tags.

### 7.2 Create Post
- **Endpoint**: `POST /api/v1/posts` 🔒 (MULTIPART ONLY)
- **Fields**: `content` (text), `location` (text), `media` (file), `tags` (array of strings).
- **Multipart Note**: To send tags in a multipart request, use multiple `tags` keys or a JSON-encoded string if your client supports it. Most common: `tags=nature&tags=adventure`.

### 7.3 Like/Unlike Post
- **Endpoint**: `POST /api/v1/posts/{id}/like` 🔒
- **Response**: `{"message": "Post liked", "liked": true}`

### 7.4 Delete Comment
- **Endpoint**: `DELETE /api/v1/posts/comments/{commentId}` 🔒
- **Response**: `{"message": "Comment deleted successfully"}`
- **Note**: Only the author of the comment can perform this action.

---

## 🚀 8. Direct Media Upload (Helpers)
*Use these only if you aren't using the resource-specific multipart endpoints above.*
- `POST /api/v1/upload/image?folder=posts` 🔒
- `POST /api/v1/upload/video?folder=posts` 🔒
