# Supabase Setup Guide

This guide will help you set up Supabase for both the web and server applications.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new Supabase project

## Configuration Steps

### 1. Get Supabase Credentials

From your Supabase dashboard:

- Go to Settings → API
- Copy your Project URL
- Copy your `anon/public` key
- Copy your `service_role/secret` key (for server-side operations)

### 2. Environment Variables

#### Web App (.env.local)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

#### Server App (.env)

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Database Schema

Create the following tables in your Supabase dashboard:

#### Profiles Table

```sql
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### Health Records Table

```sql
CREATE TABLE health_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own health records" ON health_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own health records" ON health_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health records" ON health_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health records" ON health_records
  FOR DELETE USING (auth.uid() = user_id);
```

#### Consultations Table

```sql
CREATE TABLE consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 30,
  meeting_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own consultations" ON consultations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own consultations" ON consultations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own consultations" ON consultations
  FOR UPDATE USING (auth.uid() = user_id);
```

### 4. Usage Examples

#### Client-side (React Components)

```typescript
import { supabase } from "@/lib/supabase";
import { AuthService } from "@/lib/auth";
import { DatabaseService } from "@/lib/database";

// Authentication
const handleSignUp = async (email: string, password: string) => {
  const { user, error } = await AuthService.signUp({ email, password });
  if (error) console.error("Sign up failed:", error);
};

// Database operations
const getUserProfile = async () => {
  const user = await AuthService.getCurrentUser();
  if (user) {
    const { data, error } = await DatabaseService.getUserProfile(user.id);
    if (error) console.error("Failed to fetch profile:", error);
    return data;
  }
};
```

#### Server-side (API Routes)

```typescript
import { createRouteHandlerClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = createRouteHandlerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Your logic here
}
```

#### Server App (Express.js)

```javascript
const { supabaseAdmin, supabaseAnon } = require("./src/config/supabase");

// Use supabaseAdmin for admin operations
// Use supabaseAnon for public operations
```

## Security Notes

1. **Never expose service_role key** in client-side code
2. **Always use Row Level Security (RLS)** on your tables
3. **Validate user input** before database operations
4. **Use proper error handling** to avoid exposing sensitive information

## Troubleshooting

### Common Issues

1. **Environment variables not loaded**: Restart your development server
2. **CORS issues**: Check your Supabase project settings
3. **RLS blocking queries**: Ensure your policies are correctly configured
4. **Authentication errors**: Verify your API keys are correct

### Testing Connection

You can test your Supabase connection by running:

```bash
# In web app
npm run dev

# In server app
npm run dev
```

Then check the browser console or server logs for any connection errors.

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Express.js with Supabase](https://supabase.com/docs/reference/javascript/introduction)
