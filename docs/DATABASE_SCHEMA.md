# Drape.ai Database Schema

**Primary:** MongoDB (with Mongoose ODM)  
**Sync:** [Google Sheets](https://docs.google.com/spreadsheets/d/1fHk9AdcVi_Chdg2hM6IrjYObMKy1oI9clWczJXqCdOg) – Users, WardrobeItems, Outfits, Donations, Collections

---

## Entity Relationship Overview

```
User ──┬── WardrobeItem (1:N)
       ├── Outfit (1:N)
       ├── Donation (1:N)
       └── Profile
```

---

## 1. User

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | auto | Primary key |
| phone | String | ✓ | Unique, OTP auth |
| email | String | | Optional |
| name | String | | |
| gender | String | | male, female, other, prefer_not_to_say |
| ageRange | String | | 18-24, 25-34, 35-44, 45-54, 55+ |
| preferredStyle | [String] | | casual, formal, ethnic, sporty, minimalist, etc. |
| skinTone | String | | fair, medium, olive, tan, brown, dark |
| facePhotos | [String] | | URLs for complexion analysis |
| location | Object | | city, state, country, coordinates |
| isProfileComplete | Boolean | | default: false |
| createdAt | Date | | |
| updatedAt | Date | | |

---

## 2. WardrobeItem

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | auto | Primary key |
| userId | ObjectId | ✓ | Ref: User |
| imageUrl | String | ✓ | S3/Cloud URL |
| thumbnailUrl | String | | |
| category | String | ✓ | shirt, t-shirt, pants, jeans, kurta, saree, blazer, jacket, vest, skirt, shorts, swimwear, shoes, sneakers, heels, accessories, innerwear, dress, top, sweater, coat |
| tags | [String] | | favourite, office_wear, party_wear, travel_wear, summer, winter, ethnic, casual, formal |
| color | String | | |
| pattern | String | | |
| source | Object | | platform, productUrl, productId (Myntra, Flipkart, etc.) |
| isDonated | Boolean | | default: false |
| donatedAt | Date | | |
| createdAt | Date | | |
| updatedAt | Date | | |

**Indexes:** `userId`, `userId + category`, `userId + isDonated`

---

## 3. Outfit

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | auto | Primary key |
| userId | ObjectId | ✓ | Ref: User |
| itemIds | [ObjectId] | ✓ | Ref: WardrobeItem |
| occasion | String | | office, party, dating, etc. |
| weatherContext | Object | | temperature, humidity, condition |
| locationContext | String | | |
| aiExplanation | String | | Why this outfit works |
| status | String | | suggested, liked, skipped, saved |
| compositeImageUrl | String | | AI-generated preview |
| createdAt | Date | | |

**Indexes:** `userId`, `userId + status`, `userId + occasion`

---

## 4. Donation

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | auto | Primary key |
| userId | ObjectId | ✓ | Ref: User |
| itemIds | [ObjectId] | ✓ | Ref: WardrobeItem |
| partnerId | String | | NGO/Partner ID |
| partnerName | String | | |
| status | String | | scheduled, pickup_pending, pickup_completed, cancelled |
| scheduledPickupAt | Date | | |
| pickupCompletedAt | Date | | |
| otp | String | | For pickup verification |
| createdAt | Date | | |

---

## 5. Occasion (Reference Data)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | auto | Primary key |
| key | String | ✓ | Unique slug |
| label | String | ✓ | Display name |
| icon | String | | |
| isActive | Boolean | | default: true |
| sortOrder | Number | | |

**Seed Data:** office, party, marriage, dating, trip, outing, gym, interview, casual_hangout, beach_day, airport_look, etc.

---

## MongoDB Collections Summary

| Collection | Purpose |
|------------|---------|
| users | User profiles, auth, preferences |
| wardrobeitems | Clothing items per user |
| outfits | AI suggestions, likes, saves |
| donations | Declutter/donate flow |
| occasions | Occasion master data |
