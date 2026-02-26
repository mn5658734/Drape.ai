# Drape.ai API Documentation

**Base URL:** `http://localhost:3000/api`  
**Version:** 1.0.0

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Users](#2-users)
3. [Wardrobe](#3-wardrobe)
4. [Outfits](#4-outfits)
5. [Occasions](#5-occasions)
6. [Donate](#6-donate)
7. [Shopping Recommendations](#7-shopping-recommendations)
8. [Weather](#8-weather)

---

## 1. Authentication

### Send OTP

```http
POST /api/auth/send-otp
```

**Request Body:**
```json
{
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 300
}
```

---

### Verify OTP

```http
POST /api/auth/verify-otp
```

**Request Body:**
```json
{
  "phone": "+919876543210",
  "otp": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "token": "mock-jwt-user-1",
  "user": {
    "id": "user-1",
    "phone": "+919876543210",
    "isProfileComplete": true
  }
}
```

---

### Refresh Token

```http
POST /api/auth/refresh
```

**Response:**
```json
{
  "success": true,
  "token": "mock-jwt-refreshed"
}
```

---

## 2. Users

### Get User Profile

```http
GET /api/users/:id
```

**Response:**
```json
{
  "id": "user-1",
  "phone": "+919876543210",
  "name": "Milan",
  "gender": "male",
  "ageRange": "25-34",
  "preferredStyle": ["casual", "formal"],
  "skinTone": "medium",
  "facePhotos": [],
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India"
  },
  "isProfileComplete": true
}
```

---

### Update User Profile

```http
PUT /api/users/:id
```

**Request Body:**
```json
{
  "name": "Milan",
  "gender": "male",
  "ageRange": "25-34",
  "preferredStyle": ["casual", "formal"],
  "skinTone": "medium",
  "facePhotos": ["url1", "url2"],
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India"
  }
}
```

---

### Upload Face Photos

```http
POST /api/users/:id/face-photos
```

**Request Body:**
```json
{
  "photos": ["base64_or_url_1", "base64_or_url_2"]
}
```

---

### Get Favorite Outfits

```http
GET /api/users/:id/favorite-outfits
```

---

## 3. Wardrobe

### Get Wardrobe Items

```http
GET /api/wardrobe/:userId
```

**Response:**
```json
{
  "items": [
    {
      "id": "item-1",
      "userId": "user-1",
      "category": "shirt",
      "tags": ["office_wear", "formal"],
      "color": "blue",
      "imageUrl": "https://...",
      "isDonated": false
    }
  ]
}
```

---

### Upload Photo (multipart)

```http
POST /api/wardrobe/:userId/upload
Content-Type: multipart/form-data
```

**Form fields:**
- `photo` (file, required) – Image file (JPG, PNG, etc., max 10MB)
- `category` (string, optional) – e.g. t-shirt, shirt, pants
- `tags` (string, optional) – Comma-separated tags
- `color` (string, optional)

**Response:** Same as Add Wardrobe Item. Photo is uploaded to Google Drive when configured.

---

### Add Wardrobe Item

```http
POST /api/wardrobe/:userId
```

**Request Body:**
```json
{
  "imageUrl": "https://...",
  "category": "shirt",
  "tags": ["office_wear", "formal"],
  "color": "blue",
  "source": {
    "platform": "myntra",
    "productUrl": "https://...",
    "productId": "123"
  }
}
```

**Categories:** `shirt`, `t-shirt`, `pants`, `jeans`, `kurta`, `saree`, `blazer`, `jacket`, `vest`, `skirt`, `shorts`, `swimwear`, `shoes`, `sneakers`, `heels`, `accessories`, `innerwear`, `dress`, `top`, `sweater`, `coat`

**Tags:** `favourite`, `anniversary`, `office_wear`, `party_wear`, `travel_wear`, `summer`, `winter`, `ethnic`, `casual`, `formal`, `monsoon`

---

### Update Wardrobe Item

```http
PUT /api/wardrobe/:userId/items/:itemId
```

---

### Delete Wardrobe Item

```http
DELETE /api/wardrobe/:userId/items/:itemId
```

---

### Bulk Upload

```http
POST /api/wardrobe/:userId/bulk-upload
```

**Request Body:**
```json
{
  "images": [
    { "url": "https://...", "category": "shirt", "tags": [], "color": "blue" }
  ]
}
```

---

## 4. Outfits

### Get Outfit Suggestions

```http
GET /api/outfits/:userId/suggestions?occasion=office&limit=10
```

**Query Params:** `occasion`, `limit`

**Response:**
```json
{
  "outfits": [
    {
      "id": "outfit-1",
      "itemIds": ["item-1", "item-2", "item-6"],
      "occasion": "office",
      "aiExplanation": "This blue shirt enhances your warm undertone...",
      "status": "suggested"
    }
  ]
}
```

---

### Request AI Suggestions

```http
POST /api/outfits/:userId/suggest
```

**Request Body:**
```json
{
  "occasion": "office",
  "weather": { "temperature": 24, "humidity": 65 },
  "location": "Mumbai"
}
```

---

### Rush Mode (I'm Getting Late!)

```http
POST /api/outfits/:userId/rush-mode
```

**Response:**
```json
{
  "outfit": {
    "id": "outfit-1",
    "itemIds": ["item-1", "item-2", "item-6"],
    "aiExplanation": "AI picked your most liked items. Quick, professional, ready to go!"
  }
}
```

---

### Outfit Action (Like/Skip/Save)

```http
POST /api/outfits/:userId/:outfitId/action
```

**Request Body:**
```json
{
  "action": "like",
  "tags": ["Office", "Date night"],
  "collectionId": "col-1"
}
```

**Actions:** `like`, `skip`, `save`  
**Optional:** `tags` (array) – add tags when saving; `collectionId` – save to a specific collection

---

### Get Collections

```http
GET /api/outfits/:userId/collections
```

**Response:**
```json
{
  "collections": [
    { "id": "col-1", "userId": "user-1", "name": "Office Favorites", "icon": "briefcase" }
  ]
}
```

---

### Create Collection

```http
POST /api/outfits/:userId/collections
```

**Request Body:**
```json
{
  "name": "Weekend Looks",
  "icon": "sun"
}
```

---

### Get Favorites

```http
GET /api/outfits/:userId/favorites
```

---

## 5. Occasions

### List Occasions

```http
GET /api/occasions
```

**Response:**
```json
{
  "occasions": [
    { "key": "office", "label": "Office", "icon": "briefcase", "sortOrder": 1 },
    { "key": "party", "label": "Party", "icon": "party", "sortOrder": 2 }
  ]
}
```

---

## 6. Donate

### Get NGO Partners

```http
GET /api/donate/partners?city=Mumbai
```

**Response:**
```json
{
  "partners": [
    { "id": "ngo-1", "name": "Goonj", "city": "Mumbai" }
  ]
}
```

---

### Schedule Pickup

```http
POST /api/donate/schedule
```

**Request Body:**
```json
{
  "userId": "user-1",
  "itemIds": ["item-1", "item-2"],
  "partnerId": "ngo-1",
  "scheduledPickupAt": "2025-02-28T10:00:00Z"
}
```

---

### Confirm Pickup

```http
POST /api/donate/:donationId/confirm-pickup
```

**Request Body:**
```json
{
  "otp": "1234"
}
```

---

## 7. Shopping Recommendations

### Get Product Recommendations

```http
GET /api/shopping/recommendations?outfitId=&occasion=
```

**Query Params:** `outfitId`, `occasion`

**Response:**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Blue Formal Shirt",
      "brand": "Peter England",
      "price": "₹999",
      "originalPrice": "₹1,499",
      "platform": "Myntra",
      "url": "https://www.myntra.com",
      "image": "https://...",
      "rating": 4.5
    }
  ],
  "occasion": "office",
  "message": "Similar products from our partners"
}
```

---

## 8. Weather

### Get Weather

```http
GET /api/weather?city=Mumbai
GET /api/weather?lat=19.0760&lon=72.8777
```

**Response:**
```json
{
  "temperature": 24,
  "humidity": 65,
  "condition": "Partly cloudy",
  "city": "Mumbai",
  "recommendation": "Light layers recommended. AC might be cold indoors."
}
```

---

## Error Responses

| Code | Description |
|-----|-------------|
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

**Error Format:**
```json
{
  "error": "Error message"
}
```

---

## Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "drape-ai-api",
  "timestamp": "2025-02-27T12:00:00.000Z"
}
```
