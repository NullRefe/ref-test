# Healthcare Backend Server

A robust Node.js backend server for a healthcare application with Supabase integration, built for a monorepo architecture.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Health Records Management**: CRUD operations for patient health records
- **Consultation Booking**: Video/phone/in-person consultation scheduling
- **Prescription Management**: Digital prescriptions and medication tracking
- **Pharmacy Integration**: Nearby pharmacy finder and inventory management
- **User Management**: Profile management for patients, doctors, and pharmacies
- **Security**: Rate limiting, CORS, input validation, and security headers

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + JWT
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure

```
src/
├── config/
│   └── supabase.js          # Supabase client configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── validation.js        # Request validation middleware
│   └── errorHandler.js      # Global error handling
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management routes
│   ├── healthRecords.js     # Health records routes
│   ├── consultations.js     # Consultation booking routes
│   └── pharmacy.js          # Pharmacy and prescription routes
├── utils/
│   └── helpers.js           # Utility functions
└── index.js                 # Main application entry point
```

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the following variables:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key
- `JWT_SECRET`: A secure random string for JWT signing

### 2. Database Setup

1. Create a new Supabase project
2. Run the SQL schema in `database/schema.sql` in your Supabase SQL editor
3. This will create all necessary tables, indexes, and Row Level Security policies

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/doctors` - Get all doctors
- `GET /api/users/doctors/:id` - Get doctor details
- `POST /api/users/availability` - Update doctor availability (doctors only)
- `GET /api/users/stats` - Get user statistics

### Health Records

- `GET /api/health-records` - Get user's health records
- `GET /api/health-records/:id` - Get specific health record
- `POST /api/health-records` - Create new health record
- `PUT /api/health-records/:id` - Update health record
- `DELETE /api/health-records/:id` - Delete health record

### Consultations

- `GET /api/consultations` - Get user's consultations
- `GET /api/consultations/:id` - Get specific consultation
- `POST /api/consultations` - Book new consultation (patients only)
- `PATCH /api/consultations/:id/status` - Update consultation status (doctors only)
- `DELETE /api/consultations/:id` - Cancel consultation

### Pharmacy

- `GET /api/pharmacy/medications` - Get available medications
- `GET /api/pharmacy/prescriptions` - Get user's prescriptions
- `POST /api/pharmacy/prescriptions` - Create prescription (doctors only)
- `GET /api/pharmacy/nearby` - Get nearby pharmacies
- `POST /api/pharmacy/adherence` - Track medication adherence

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Role-Based Access Control

The system supports multiple user roles:

- **Patient**: Can view/manage own health records, book consultations, view prescriptions
- **Doctor**: Can manage consultations, create prescriptions, update availability
- **Pharmacy**: Can manage inventory and medications
- **Admin**: Full system access

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (in development mode)"
}
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for specific origins
- **Helmet**: Security headers
- **Input Validation**: All inputs are validated and sanitized
- **Row Level Security**: Database-level access control

## Database Schema

The application uses the following main tables:

- `users` - User profiles and authentication
- `health_records` - Patient health records
- `consultations` - Medical consultations
- `prescriptions` - Digital prescriptions
- `medications` - Medication catalog
- `pharmacies` - Pharmacy directory
- `medication_adherence` - Medication tracking

## Integration with Mobile App

The server is designed to work seamlessly with mobile applications built using any framework (React Native, Flutter, native iOS/Android, etc.). All endpoints return JSON responses suitable for mobile consumption. The shared Supabase database structure ensures consistency across web and mobile platforms.

## Development

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Adding New Features

1. Create new route files in `src/routes/`
2. Add middleware as needed in `src/middleware/`
3. Update database schema if required
4. Add proper authentication and validation
5. Update this README with new endpoints

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use a process manager like PM2
3. Set up proper logging
4. Configure database connection pooling
5. Set up monitoring and health checks

## Health Check

The server provides a health check endpoint:

```
GET /health
```

Returns server status, uptime, and environment information.

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Write tests for new features
5. Update documentation
