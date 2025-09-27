# Medications API Testing Guide

This file contains example requests for testing the medications API endpoints.

## Authentication

First, you need to authenticate to get an access token. Use your existing auth endpoints or Supabase authentication.

## Base URL

```
http://localhost:3001/api/medications
```

## API Endpoints

### 1. Create a New Medication

**POST** `/api/medications`

```bash
curl -X POST http://localhost:3001/api/medications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Metformin",
    "generic_name": "Metformin Hydrochloride",
    "dosage": "500mg",
    "frequency": "Twice daily",
    "duration": "3 months",
    "instructions": "Take with meals to reduce stomach upset",
    "prescribed_by": "Dr. Smith",
    "prescription_date": "2025-09-27T00:00:00Z",
    "start_date": "2025-09-27T00:00:00Z",
    "end_date": "2025-12-27T00:00:00Z",
    "is_active": true,
    "refills_remaining": 2,
    "cost": 450.00,
    "pharmacy_name": "Apollo Pharmacy",
    "pharmacy_location": "Main Street, Delhi",
    "availability_status": "In Stock",
    "alternatives": ["Glucophage", "Glycomet"],
    "reminder_times": ["08:00", "20:00"],
    "side_effects": "Nausea, diarrhea (usually temporary)",
    "category": "Diabetes"
  }'
```

### 2. Get All Medications

**GET** `/api/medications`

```bash
# Get all medications
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/medications

# With filters
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3001/api/medications?category=Diabetes&is_active=true&limit=10"

# Search medications
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3001/api/medications?search=metformin"
```

### 3. Get Specific Medication

**GET** `/api/medications/:id`

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/medications/MEDICATION_UUID_HERE
```

### 4. Update Medication

**PUT** `/api/medications/:id`

```bash
curl -X PUT http://localhost:3001/api/medications/MEDICATION_UUID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "dosage": "1000mg",
    "frequency": "Once daily",
    "instructions": "Take in the morning with breakfast"
  }'
```

### 5. Toggle Medication Active Status

**PATCH** `/api/medications/:id/toggle-active`

```bash
curl -X PATCH http://localhost:3001/api/medications/MEDICATION_UUID_HERE/toggle-active \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Delete Medication

**DELETE** `/api/medications/:id`

```bash
curl -X DELETE http://localhost:3001/api/medications/MEDICATION_UUID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Get Medication Statistics

**GET** `/api/medications/stats/summary`

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/medications/stats/summary
```

### 8. Get Today's Reminders

**GET** `/api/medications/reminders/today`

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/medications/reminders/today
```

## Example Responses

### Successful Medication Creation Response

```json
{
  "message": "Medication created successfully",
  "medication": {
    "_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Metformin",
    "generic_name": "Metformin Hydrochloride",
    "dosage": "500mg",
    "frequency": "Twice daily",
    "user_id": "user-uuid-here",
    "is_active": true,
    "cost": 450,
    "reminder_times": ["08:00", "20:00"],
    "category": "Diabetes",
    "created_at": "2025-09-27T10:30:00Z"
  }
}
```

### Medication List Response

```json
{
  "medications": [
    {
      "_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Metformin",
      "generic_name": "Metformin Hydrochloride",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "is_active": true,
      "cost": 450,
      "category": "Diabetes"
    }
  ],
  "count": 1,
  "pagination": {
    "limit": 50,
    "offset": 0,
    "has_more": false
  }
}
```

### Statistics Response

```json
{
  "stats": {
    "total": 5,
    "active": 3,
    "inactive": 2,
    "total_cost": 2250.5,
    "categories": {
      "Diabetes": 2,
      "Blood Pressure": 2,
      "Vitamins": 1
    }
  }
}
```

### Today's Reminders Response

```json
{
  "reminders": [
    {
      "medication_id": "550e8400-e29b-41d4-a716-446655440000",
      "medication_name": "Metformin",
      "dosage": "500mg",
      "time": "08:00",
      "instructions": "Take with meals"
    },
    {
      "medication_id": "550e8400-e29b-41d4-a716-446655440000",
      "medication_name": "Metformin",
      "dosage": "500mg",
      "time": "20:00",
      "instructions": "Take with meals"
    }
  ],
  "date": "2025-09-27"
}
```

## Error Responses

### Validation Error

```json
{
  "errors": [
    {
      "field": "name",
      "message": "Medication name is required"
    }
  ]
}
```

### Unauthorized

```json
{
  "error": "Access token required"
}
```

### Not Found

```json
{
  "error": "Medication not found"
}
```

## Testing with Postman

1. Create a new collection called "Medications API"
2. Set up environment variables:
   - `base_url`: http://localhost:3001
   - `auth_token`: Your JWT token
3. Create requests for each endpoint above
4. Use `{{base_url}}/api/medications` for URL
5. Add `Authorization: Bearer {{auth_token}}` header

## Testing Checklist

- [ ] Create medication with all fields
- [ ] Create medication with minimal required fields
- [ ] Get all medications (empty list initially)
- [ ] Get medications with filters
- [ ] Search medications by name
- [ ] Get specific medication by ID
- [ ] Update medication
- [ ] Toggle medication active status
- [ ] Get medication statistics
- [ ] Get today's reminders
- [ ] Delete medication
- [ ] Test with invalid IDs (should return 404)
- [ ] Test without authentication (should return 401)
- [ ] Test with invalid data (should return validation errors)
