# ENDPOINT TEST DATA

This document provides ready-to-use testing data for all API endpoints. Copy and paste the JSON payloads into the "Try it out" section of Swagger UI.

> **Note**: For all endpoints marked with 🔒 **Auth Required**, you must first login and paste the returned `token` into the **Authorize** lock icon at the top of Swagger UI in the format: `Bearer YOUR_TOKEN_HERE`.

---

## 🏥 Health
### 1. Health Check
- **Endpoint**: `GET /api/v1/health`
- **Auth**: None
- **Action**: Click **Execute**

---

## 🔐 Auth
### 2. User Registration
- **Endpoint**: `POST /api/v1/auth/register`
- **Payload**:
```json
{
  "email": "traveler@example.com",
  "password": "StrongPassword123!",
  "first_name": "Arsema",
  "last_name": "Zeweldi"
}
```

### 3. User Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Payload**:
```json
{
  "email": "traveler@example.com",
  "password": "StrongPassword123!"
}
```

---

## 📷 Media Upload (⚠️ Internal Testing)
### 4. Upload Image (Multipart)
- **Endpoint**: `POST /api/v1/upload/image` 🔒
- **Query Parameter**: `folder` = `packages` or `posts`
- **Action**: Upload a file (max 10MB)

### 5. Upload Video (Multipart)
- **Endpoint**: `POST /api/v1/upload/video` 🔒
- **Query Parameter**: `folder` = `posts`
- **Action**: Upload a file (max 100MB)

---

## 📦 Packages
### 6. Get Packages Feed
- **Endpoint**: `GET /api/v1/packages`
- **Query Parameters**:
| Parameter | Default/Example | Enum Options |
|-----------|-----------------|--------------|
| `status` | `public` | `public`, `private`, `archived`, `all` |
| `sort_by`| `rating_avg` | `rating_avg`, `price`, `verified`, `views` |
| `order` | `desc` | `asc`, `desc` |
| `page` | `1` | (Integer) |
| `page_size`| `20` | (Integer) |

### 7. Create Package
- **Endpoint**: `POST /api/v1/packages` 🔒
- **Payload**:
```json
{
  "itinerary_id": "00000000-0000-0000-0000-000000000700",
  "title": "Safari Adventure in Kenya",
  "summary": "An unforgettable 3-day guided safari through the Masai Mara.",
  "price": 299.99,
  "country": "Kenya",
  "location": "Nairobi",
  "currency": "USD",
  "image_url": "https://example.com/safari.jpg",
  "duration_days": 3,
  "category": "adventure",
  "group_size": "medium",
  "is_public": true
}
```

### 8. Get Package by ID
- **Endpoint**: `GET /api/v1/packages/{id}`
- **Path Parameter**: `id` = (UUID of an existing package)

### 9. Update Package
- **Endpoint**: `PATCH /api/v1/packages/{id}` 🔒
- **Payload**:
```json
{
  "title": "Updated Safari Adventure",
  "summary": "New and improved safari experience.",
  "description": "Full description of the package including logistics.",
  "price": 349.50,
  "country": "Kenya",
  "location": "Masai Mara",
  "currency": "USD",
  "image_url": "https://example.com/new-safari.jpg",
  "duration_days": 4,
  "category": "wildlife",
  "group_size": "small",
  "is_public": true
}
```

### 10. Archive Package
- **Endpoint**: `DELETE /api/v1/packages/{id}` 🔒
- **Action**: Click **Execute**

### 11. Publish Package
- **Endpoint**: `POST /api/v1/packages/{id}/publish` 🔒
- **Action**: Click **Execute**

### 12. Update Package Status
- **Endpoint**: `PATCH /api/v1/packages/{id}/status` 🔒
- **Payload**:
```json
{
  "status": "public"
}
```

---

## 💬 Community Reviews & Chat
### 13. Get Package Reviews
- **Endpoint**: `GET /api/v1/packages/{id}/reviews`
- **Path Parameter**: `id` = (UUID of package)

### 14. Submit Package Review
- **Endpoint**: `POST /api/v1/packages/{id}/reviews` 🔒
- **Payload**:
```json
{
  "rating": 5,
  "comment": "Absolutely loved the trip! Everything was well organized."
}
```

### 15. Get Chat History
- **Endpoint**: `GET /api/v1/packages/{id}/chat`
- **Path Parameter**: `id` = (UUID of package)

### 16. Post Chat Message
- **Endpoint**: `POST /api/v1/packages/{id}/chat` 🔒
- **Payload**:
```json
{
  "message": "Is transport from the airport included in the price?"
}
```

### 17. WebSocket Chat
- **Endpoint**: `GET /api/v1/packages/{id}/ws`
- **Action**: Use a WebSocket testing tool. Connect to `ws://localhost:8080/api/v1/packages/{id}/ws`.

---

## 👤 User Profile & Preferences
### 18. Get User Profile
- **Endpoint**: `GET /api/v1/user/profile` 🔒
- **Action**: Click **Execute**

### 19. Update User Profile
- **Endpoint**: `PATCH /api/v1/user/profile` 🔒
- **Payload**:
```json
{
  "first_name": "Arsema",
  "last_name": "Zeweldi",
  "country": "Ethiopia",
  "bio": "Dev and traveler based in Addis Ababa.",
  "profile_image_url": "https://res.cloudinary.com/example/profile.jpg"
}
```

### 20. Get User Preferences
- **Endpoint**: `GET /api/v1/user/preferences` 🔒
- **Action**: Click **Execute**

### 21. Update User Preferences
- **Endpoint**: `PUT /api/v1/user/preferences` 🔒
- **Payload**:
```json
{
  "preferred_season": "summer",
  "budget_range": "medium",
  "preferred_activities": ["hiking", "food", "museums"],
  "dietary_restrictions": ["none"],
  "preferred_climate": "tropical",
  "preferred_language": "english",
  "travel_vibe_interest": "adventure",
  "travel_vibes": ["relaxed", "exploratory"]
}
```

---

## 🗺️ AI Itinerary Planner
### 22. Generate AI Itinerary
- **Endpoint**: `POST /api/v1/planner/generate` 🔒
- **Payload**:
```json
{
  "destination": "Nairobi, Kenya",
  "duration_days": 3,
  "budget": 500,
  "budget_level": "medium",
  "vibe_tags": ["nature", "wildlife", "culture"],
  "group_size": 2,
  "climate_pref": "temperate",
  "multi_country": false,
  "notes": "Interested in visiting the Giraffe Centre."
}
```

---

## 🗓️ Itineraries
### 23. List User Itineraries
- **Endpoint**: `GET /api/v1/itineraries` 🔒
- **Action**: Click **Execute**

### 24. Create Itinerary (Manual)
- **Endpoint**: `POST /api/v1/itineraries` 🔒
- **Payload**:
```json
{
  "title": "Summer Trip to Kenya",
  "description": "Family vacation exploring Nairobi and beyond.",
  "days_count": 5,
  "nights_count": 4,
  "start_date": "2026-06-01",
  "end_date": "2026-06-05",
  "activities": [
    {
      "day_number": 1,
      "order_index": 1,
      "title": "Arrival at Jomo Kenyatta International Airport",
      "description": "Flight arrival and shuttle to hotel.",
      "time_label": "10:00 AM",
      "duration_label": "2 hours",
      "cost_label": "Free",
      "location": "Airport",
      "activity_type": "transport",
      "image_url": "https://example.com/airport.jpg",
      "ai_pick": false,
      "requirement": "Passport & Visa",
      "latitude": -1.332,
      "longitude": 36.927,
      "start_time": "10:00",
      "end_time": "12:00"
    }
  ]
}
```

### 25. Get Itinerary by ID
- **Endpoint**: `GET /api/v1/itineraries/{id}` 🔒
- **Path Parameter**: `id` = (UUID of itinerary)

### 26. Delete Itinerary
- **Endpoint**: `DELETE /api/v1/itineraries/{id}` 🔒
- **Action**: Click **Execute**

### 27. Add Itinerary Activity
- **Endpoint**: `POST /api/v1/itineraries/{id}/activities` 🔒
- **Payload**:
```json
{
  "day_number": 2,
  "order_index": 1,
  "title": "Visit David Sheldrick Wildlife Trust",
  "description": "Feeding orphaned baby elephants.",
  "time_label": "11:00 AM",
  "duration_label": "1 hour",
  "cost_label": "1500 KES",
  "location": "Nairobi",
  "activity_type": "wildlife",
  "image_url": "https://example.com/elephants.jpg",
  "ai_pick": true,
  "requirement": "Pre-booked ticket",
  "latitude": -1.376,
  "longitude": 36.773,
  "start_time": "11:00",
  "end_time": "12:00"
}
```

### 28. Update Itinerary Activity
- **Endpoint**: `PATCH /api/v1/itineraries/{id}/activities` 🔒
- **Payload**:
```json
{
  "activity_id": "00000000-0000-0000-0000-000000000000",
  "title": "Updated Activity Title",
  "description": "Updated activity description.",
  "day_number": 2,
  "order_index": 2,
  "time_label": "02:00 PM",
  "duration_label": "2 hours",
  "cost_label": "500 KES",
  "location": "Updated Location",
  "activity_type": "culture",
  "image_url": "https://example.com/img.jpg",
  "ai_pick": false,
  "requirement": "None",
  "latitude": 0.0,
  "longitude": 0.0,
  "start_time": "14:00",
  "end_time": "16:00"
}
```

### 29. Delete Itinerary Activity
- **Endpoint**: `DELETE /api/v1/itineraries/{id}/activities/{activityId}` 🔒
- **Path Parameter**: `id` = (UUID of itinerary)
- **Path Parameter**: `activityId` = (UUID of activity)

---

## 📜 Community Posts
### 30. List Community Posts
- **Endpoint**: `GET /api/v1/posts`
- **Query Parameters**:
| Parameter | Default/Example | Description |
|-----------|-----------------|-------------|
| `status` | `public` | `public`, `private`, `archived`, `all` |
| `user_id` | (UUID) | Filter by a specific traveler's ID |
| `q` | `safari` | Search in content, location, or package name |
| `sort_by`| `created_at` | `created_at`, `likes_count`, `comments_count` |
| `order` | `desc` | `asc`, `desc` |
| `page` | `1` | (Integer) |
| `page_size`| `10` | (Integer) |

### 31. Create Community Post
- **Endpoint**: `POST /api/v1/posts` 🔒
- **Flexible Options**: You can either upload a local file (`media` field) OR provide a direct `media_url` and `media_type`.
- **Payload (JSON)**:
```json
{
  "content": "Just finished my safari trip! It was amazing.",
  "media_url": "https://example.com/safari-photo.jpg",
  "media_type": "image",
  "location": "Masai Mara, Kenya",
  "package_name": "Safari Adventure"
}
```

### 32. List Post Comments
- **Endpoint**: `GET /api/v1/posts/{id}/comments`
- **Query Parameters**: `page=1`, `page_size=20`

### 33. Add Comment to Post
- **Endpoint**: `POST /api/v1/posts/{id}/comments` 🔒
- **Payload**:
```json
{
  "text": "Wow, looks like you had a great time!"
}
```

### 34. Get Single Community Post
- **Endpoint**: `GET /api/v1/posts/{id}`
- **Action**: Click **Execute** to see the post along with populated author data (`user_name`, `user_avatar`).

### 35. Toggle Like on Post
- **Endpoint**: `POST /api/v1/posts/{id}/like` 🔒
- **Action**: This will Like the post if you haven't liked it yet, or Unlike it if you already have. It automatically updates the `likes_count`.
