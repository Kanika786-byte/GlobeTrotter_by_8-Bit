# Google OAuth Setup Guide for Globe Trotter

Follow these steps to enable Google authentication in your Globe Trotter application.

## 📋 Prerequisites

- Supabase project (click "Connect to Supabase" button in top right)
- Google Cloud Console account

## 🔧 Step 1: Set Up Supabase Project

1. **Click "Connect to Supabase"** button in the top right corner of your app
2. **Create a new Supabase project** if you don't have one:
   - Go to [https://supabase.com](https://supabase.com)
   - Click "Start your project"
   - Create account or sign in
   - Click "New Project"
   - Fill in project details and create

3. **Get your Supabase credentials:**
   - Go to Settings → API
   - Copy your **Project URL** and **anon public key**
   - Update your `.env` file with these values

## 🔑 Step 2: Google Cloud Console Setup

### 2.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `globe-trotter-auth`
4. Click "Create"

### 2.2 Enable Google+ API

1. In your Google Cloud project, go to **"APIs & Services" → "Library"**
2. Search for **"Google+ API"**
3. Click on it and press **"Enable"**

### 2.3 Create OAuth 2.0 Credentials

1. Go to **"APIs & Services" → "Credentials"**
2. Click **"Create Credentials" → "OAuth 2.0 Client IDs"**
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in app name: `Globe Trotter`
   - Add your email as developer contact
   - Save and continue through all steps

4. **Create OAuth Client ID:**
   - Application type: **"Web application"**
   - Name: `Globe Trotter Web Client`
   
5. **Add Authorized Redirect URIs:**
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
   *(Replace `your-project-id` with your actual Supabase project ID)*
   
   **Important:** Also add for local development:
   ```
   http://localhost:5173/auth/callback
   ```

6. Click **"Create"**
7. **Copy your Client ID and Client Secret** - you'll need these next

## 🔧 Step 3: Configure Supabase Authentication

1. **Go to your Supabase dashboard**
2. Navigate to **"Authentication" → "Providers"**
3. **Find Google provider** and click to configure
4. **Enable Google provider**
5. **Enter your Google credentials:**
   - **Client ID**: Paste from Google Cloud Console
   - **Client Secret**: Paste from Google Cloud Console
6. **Configure redirect URL** (should be automatically set to):
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
6. Click **"Save"**

## 🌐 Step 4: Update Your Environment

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🚀 Step 5: Test Google Authentication

1. **Restart your development server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Go to the login page** and click **"Continue with Google"**

3. **You should be redirected to Google** for authentication

4. **After successful login**, you'll be redirected back to your app

5. **Check the browser console** for any error messages if authentication fails

## 🔍 Troubleshooting

### Common Issues:

**❌ "Error 400: redirect_uri_mismatch"**
- Check that your redirect URI in Google Cloud Console exactly matches:
  `https://your-project-id.supabase.co/auth/v1/callback`

**❌ "Google+ API not enabled"**
- Make sure you enabled the Google+ API in Google Cloud Console
- Wait a few minutes for the API to be fully activated

**❌ "Invalid client ID"**
- Double-check your Client ID and Secret in Supabase
- Make sure there are no extra spaces or characters

**❌ "Supabase not configured"**
- Verify your `.env` file has the correct Supabase URL and anon key
- Restart your development server after updating `.env`

### Testing Checklist:

✅ Supabase project created and configured  
✅ Google Cloud project created  
✅ Google+ API enabled  
✅ OAuth 2.0 credentials created  
✅ Redirect URI added to Google Cloud Console  
✅ Local development redirect URI added  
✅ Google provider enabled in Supabase  
✅ Client ID and Secret added to Supabase  
✅ Environment variables updated  
✅ Development server restarted  

## 📞 Need Help?

If you're still having issues:

1. **Check the browser console** for detailed error messages
2. **Verify all URLs** match exactly (no trailing slashes)
3. **Wait 5-10 minutes** after making changes for them to propagate
4. **Try incognito mode** to avoid cached authentication states

## 🎉 Success!

Once configured, users will be able to:
- Sign in with their Google accounts
- Have their profile automatically created
- Access all Globe Trotter features
- Maintain their session across browser visits

Your Globe Trotter app now has enterprise-grade Google OAuth authentication! 🚀