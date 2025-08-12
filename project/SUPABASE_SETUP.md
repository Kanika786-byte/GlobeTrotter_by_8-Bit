# How to Add Supabase Credentials

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign up"
3. Create an account or sign in
4. Click "New Project"
5. Choose your organization
6. Fill in:
   - **Project Name**: `globe-trotter` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
7. Click "Create new project"
8. Wait for the project to be created (takes 1-2 minutes)

## Step 2: Get Your Credentials

Once your project is ready:

1. Go to your project dashboard
2. Click on **"Settings"** in the left sidebar
3. Click on **"API"** under Settings
4. You'll see two important values:

### Project URL
- Look for **"Project URL"**
- It looks like: `https://abcdefghijklmnop.supabase.co`
- Copy this entire URL

### Anonymous Key
- Look for **"Project API keys"**
- Find the **"anon public"** key
- It's a long string starting with `eyJ...`
- Copy this entire key

## Step 3: Update Your .env File

1. Open the `.env` file in your project root
2. Replace the placeholder values:

```env
# Replace with your actual Project URL
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co

# Replace with your actual anon key
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here

# Optional: Add other environment variables
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Step 4: Restart Your Development Server

1. Stop your current development server (Ctrl+C)
2. Run `npm run dev` again
3. The application should now connect to Supabase successfully

## Example of What Your .env Should Look Like

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjU0MjQwMCwiZXhwIjoxOTU4MTE4NDAwfQ.example-signature-here
```

## Troubleshooting

### If you still get "Failed to fetch" errors:

1. **Check your .env file**: Make sure there are no extra spaces or quotes
2. **Restart the server**: Always restart after changing .env
3. **Check the URL**: Make sure it starts with `https://` and ends with `.supabase.co`
4. **Check the key**: Make sure the anon key is complete and starts with `eyJ`

### If you don't have a Supabase account:

The app will work in "demo mode" but authentication won't function. You'll need to create a Supabase project for full functionality.

## Security Note

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- The anon key is safe to use in frontend applications
- Never share your service role key publicly