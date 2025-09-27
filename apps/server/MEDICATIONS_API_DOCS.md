# Medications Backend API Documentation

## Overview

This backend API provides comprehensive medication management functionality for the healthcare application. It includes CRUD operations, medication tracking, reminder management, and statistics.

## Database Schema

The medications API uses the following Supabase table structure:

```sql
CREATE TABLE public.medications (
  _id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  _cuid text UNIQUE,
  _tid text,
  name text NOT NULL,
  generic_name text,
  dosage text,
  frequency text,
  duration text,
  instructions text,
  prescribed_by text,
  prescription_date timestamptz,
  start_date timestamptz,
  end_date timestamptz,
  is_active boolean DEFAULT true,
  refills_remaining integer,
  cost numeric,
  pharmacy_name text,
  pharmacy_location text,
  availability_status text,
  alternatives jsonb,
  reminder_times jsonb,
  side_effects text,
  category text,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid()
);
```

## Security Features

- **Row Level Security (RLS)**: Users can only access their own medications
- **JWT Authentication**: All endpoints require valid authentication
- **Input Validation**: Comprehensive validation using express-validator
- **SQL Injection Protection**: Parameterized queries through Supabase client
- **Rate Limiting**: Applied at application level

## API Endpoints

### Base URL: `/api/medications`

| Method | Endpoint             | Description               | Auth Required |
| ------ | -------------------- | ------------------------- | ------------- |
| GET    | `/`                  | Get all user medications  | Yes           |
| GET    | `/:id`               | Get specific medication   | Yes           |
| POST   | `/`                  | Create new medication     | Yes           |
| PUT    | `/:id`               | Update medication         | Yes           |
| PATCH  | `/:id/toggle-active` | Toggle active status      | Yes           |
| DELETE | `/:id`               | Delete medication         | Yes           |
| GET    | `/stats/summary`     | Get medication statistics | Yes           |
| GET    | `/reminders/today`   | Get today's reminders     | Yes           |

## Validation Rules

### Required Fields

- `name`: Medication name (string, not empty)

### Optional Fields with Validation

- `prescription_date`, `start_date`, `end_date`: ISO 8601 date strings
- `is_active`: Boolean (true/false)
- `refills_remaining`: Integer ≥ 0
- `cost`: Numeric value
- `alternatives`: Valid JSON array
- `reminder_times`: Valid JSON array of time strings (HH:MM format)

## Features

### 1. Medication Management

- Create, read, update, delete medications
- User-specific medication lists
- Active/inactive status tracking
- Prescription tracking with dates

### 2. Reminder System

- JSON-based reminder times storage
- Today's reminders endpoint
- Time validation (24-hour format: HH:MM)

### 3. Cost Tracking

- Individual medication costs
- Total cost calculations
- Daily cost estimation

### 4. Categories & Organization

- Medication categorization
- Category-based filtering
- Statistical breakdowns by category

### 5. Pharmacy Integration

- Pharmacy name and location storage
- Availability status tracking
- Alternative medications support

### 6. Statistics & Analytics

- Total, active, and inactive medication counts
- Cost summaries
- Category distributions
- Adherence tracking utilities

## Helper Functions

Located in `src/utils/helpers.js`:

### Medication-Specific Helpers

- `calculateMedicationAdherence()`: Calculate adherence rates
- `checkMedicationRefillStatus()`: Check refill needs
- `validateReminderTimes()`: Validate time format
- `generateDosageInstructions()`: Generate instruction text
- `calculateDailyCost()`: Calculate daily medication cost
- `groupMedicationsByCategory()`: Group medications by category

## Query Parameters

### GET `/api/medications`

- `category`: Filter by medication category
- `is_active`: Filter by active status (true/false)
- `search`: Search in name, generic_name, prescribed_by
- `limit`: Results per page (1-100, default: 50)
- `offset`: Pagination offset (default: 0)

## Response Formats

### Success Response Structure

```json
{
  "message": "Operation successful",
  "medication": {
    /* medication object */
  },
  "medications": [
    /* array of medications */
  ],
  "stats": {
    /* statistics object */
  },
  "reminders": [
    /* array of reminders */
  ]
}
```

### Error Response Structure

```json
{
  "error": "Error message",
  "errors": [
    /* array of validation errors */
  ]
}
```

## Authentication Flow

1. User authenticates through Supabase Auth
2. JWT token provided in Authorization header: `Bearer <token>`
3. Middleware validates token and extracts user ID
4. All database operations filtered by user_id

## File Structure

```
apps/server/src/
├── routes/
│   └── medications.js          # Main API routes
├── middleware/
│   ├── auth.js                 # Authentication middleware
│   └── validation.js           # Validation middleware
├── config/
│   └── supabase.js            # Supabase client configuration
└── utils/
    └── helpers.js             # Utility functions
```

## Environment Variables

Required in `.env`:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
```

## Error Handling

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (invalid token)
- `404`: Not Found (medication doesn't exist)
- `500`: Internal Server Error

### Error Types

1. **Validation Errors**: Invalid input format or missing required fields
2. **Authentication Errors**: Missing or invalid JWT tokens
3. **Authorization Errors**: Attempting to access other user's data
4. **Database Errors**: Supabase connection or query issues
5. **Not Found Errors**: Requesting non-existent resources

## Performance Considerations

### Database Optimizations

- Indexes on frequently queried columns (category, user_id)
- Pagination to limit response size
- Row Level Security for automatic user filtering

### API Optimizations

- Request validation to prevent unnecessary database calls
- Proper HTTP status codes for client caching
- JSON response compression (handled by Express)

## Usage Examples

### Frontend Integration

```javascript
// Example React hook for medications
const useMedications = () => {
  const [medications, setMedications] = useState([]);

  const fetchMedications = async () => {
    const response = await fetch("/api/medications", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setMedications(data.medications);
  };

  return { medications, fetchMedications };
};
```

### Server-to-Server Integration

```javascript
// Example medication service
const MedicationService = {
  async createMedication(medicationData, userToken) {
    const response = await fetch(`${API_BASE}/api/medications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(medicationData),
    });

    return response.json();
  },
};
```

## Testing

See `MEDICATIONS_API_TESTING.md` for comprehensive testing instructions and examples.

## Future Enhancements

### Planned Features

1. **Medication Interactions**: Check for drug interactions
2. **Dose Tracking**: Track when medications are taken
3. **Refill Automation**: Automatic refill reminders
4. **Doctor Integration**: Allow doctors to prescribe medications
5. **Pharmacy Integration**: Real-time inventory and pricing
6. **Adherence Reporting**: Detailed adherence analytics
7. **Medication History**: Track changes over time

### API Versioning

- Current version: v1
- Future versions will maintain backward compatibility
- Deprecation notices will be provided for major changes

## Support

For issues or questions about the medications API:

1. Check the testing documentation
2. Review error messages and status codes
3. Verify authentication and permissions
4. Check database connectivity and configuration
