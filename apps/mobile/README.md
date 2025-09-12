# Mobile Application

This directory is reserved for your mobile application development.

## Supported Mobile Frameworks

You can use any mobile framework of your choice:

### React Native

- Cross-platform mobile development with JavaScript/TypeScript
- Shared code between iOS and Android
- Great integration with Node.js backend

### Flutter

- Cross-platform mobile development with Dart
- Native performance
- Rich UI components

### Native Development

- **iOS**: Swift/Objective-C with Xcode
- **Android**: Kotlin/Java with Android Studio

## Backend Integration

Your mobile app can connect to the Node.js backend server at:

- **Development**: `http://localhost:3001`
- **Production**: Your deployed server URL

## API Endpoints

All API endpoints are available at `/api/*`. Key endpoints include:

- `/api/auth/*` - Authentication
- `/api/users/*` - User management
- `/api/health-records/*` - Health records
- `/api/consultations/*` - Consultations
- `/api/pharmacy/*` - Pharmacy and prescriptions

## Database Access

The mobile app can also directly connect to Supabase using:

- Supabase JavaScript SDK (React Native)
- Supabase Flutter SDK (Flutter)
- Supabase REST API (Any framework)

## Environment Configuration

Create a `.env` or configuration file with:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
API_BASE_URL=http://localhost:3001 (for development)
```

## Next Steps

1. Choose your mobile framework
2. Initialize your mobile project in this directory
3. Configure environment variables
4. Start building your mobile app!

The backend server is already set up and ready to serve your mobile application.
