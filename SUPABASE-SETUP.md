# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Login
3. Click "New Project"
4. Fill in:
   - Project Name: `music-streaming-app`
   - Database Password: (save this securely)
   - Region: Choose closest to you
5. Wait for project to be created (~2 minutes)

## 2. Get API Keys

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (for backend only, keep secret)

## 3. Enable Email Authentication

1. Go to Authentication → Providers
2. Enable "Email" provider
3. Configure email templates (optional)
4. Disable email confirmation for development:
   - Go to Authentication → Settings
   - Uncheck "Enable email confirmations"

## 4. Create Database Tables

Go to SQL Editor and run this script:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create playlists table
CREATE TABLE public.playlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on playlists
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

-- Playlists policies
CREATE POLICY "Users can view their own playlists"
  ON public.playlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own playlists"
  ON public.playlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists"
  ON public.playlists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists"
  ON public.playlists FOR DELETE
  USING (auth.uid() = user_id);

-- Create playlist_songs table
CREATE TABLE public.playlist_songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE NOT NULL,
  song_id TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on playlist_songs
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;

-- Playlist songs policies
CREATE POLICY "Users can view songs in their playlists"
  ON public.playlist_songs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add songs to their playlists"
  ON public.playlist_songs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove songs from their playlists"
  ON public.playlist_songs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

-- Create liked_songs table
CREATE TABLE public.liked_songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  song_id TEXT NOT NULL,
  liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, song_id)
);

-- Enable RLS on liked_songs
ALTER TABLE public.liked_songs ENABLE ROW LEVEL SECURITY;

-- Liked songs policies
CREATE POLICY "Users can view their own liked songs"
  ON public.liked_songs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can like songs"
  ON public.liked_songs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike songs"
  ON public.liked_songs FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_playlists_user_id ON public.playlists(user_id);
CREATE INDEX idx_playlist_songs_playlist_id ON public.playlist_songs(playlist_id);
CREATE INDEX idx_liked_songs_user_id ON public.liked_songs(user_id);
CREATE INDEX idx_liked_songs_song_id ON public.liked_songs(song_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for playlists
CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 5. Update Environment Variables

Add to your `.env` files:

### Backend `.env`:
```env
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_KEY=your_service_role_key
```

### Frontend `.env`:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 6. Verify Setup

1. Check Tables:
   - Go to Table Editor
   - You should see: `playlists`, `playlist_songs`, `liked_songs`

2. Check RLS:
   - Each table should have RLS enabled
   - Policies should be visible

3. Test Auth:
   - Go to Authentication → Users
   - Try creating a test user manually

## Security Notes

- ✅ Row Level Security (RLS) is enabled on all tables
- ✅ Users can only access their own data
- ✅ Service key is only used in backend
- ✅ Frontend uses anon key (safe to expose)
- ✅ All foreign keys have CASCADE delete

## Troubleshooting

**Issue**: Can't create tables
- **Solution**: Make sure you're in SQL Editor, not Table Editor

**Issue**: RLS blocking queries
- **Solution**: Check if user is authenticated and policies are correct

**Issue**: Auth not working
- **Solution**: Verify API keys are correct in .env files

## Next Steps

After completing this setup:
1. Install Supabase client in frontend and backend
2. Implement auth flow
3. Test user registration and login
4. Implement liked songs and playlists

---

**Setup Complete!** ✅ Your Supabase project is ready for Phase-3 implementation.
