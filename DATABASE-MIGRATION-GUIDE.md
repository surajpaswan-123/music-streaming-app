# 🔄 Database Migration Guide - Per-Card Backgrounds

## Overview
This guide helps you migrate from the old banner system to the new per-card background system.

---

## 📊 Database Changes Required

### **Option 1: Add cover_url Column (If Not Exists)**
```sql
-- Add cover_url column to songs table
ALTER TABLE songs 
ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN songs.cover_url IS 'URL of the cover image used as card background';
```

### **Option 2: Migrate Existing banner_url to cover_url**
If you already have `banner_url` data, migrate it:

```sql
-- Copy banner_url to cover_url
UPDATE songs 
SET cover_url = banner_url
WHERE banner_url IS NOT NULL;

-- Optional: Drop old banner columns (after verifying migration)
-- ALTER TABLE songs DROP COLUMN IF EXISTS banner_url;
-- ALTER TABLE songs DROP COLUMN IF EXISTS show_banner;
```

---

## 🗑️ Cleanup Old Banner System

### **Step 1: Remove Unused Columns (Optional)**
```sql
-- Only run this after confirming cover_url is working
ALTER TABLE songs DROP COLUMN IF EXISTS banner_url;
ALTER TABLE songs DROP COLUMN IF EXISTS show_banner;
```

### **Step 2: Verify Data**
```sql
-- Check songs with cover_url
SELECT id, title, artist, cover_url 
FROM songs 
WHERE cover_url IS NOT NULL;

-- Check songs without cover_url (will use fallback)
SELECT id, title, artist, cover_url 
FROM songs 
WHERE cover_url IS NULL;
```

---

## 📤 Supabase Storage Setup

### **Step 1: Create Storage Bucket**
```sql
-- Create public bucket for song covers
INSERT INTO storage.buckets (id, name, public)
VALUES ('song-covers', 'song-covers', true)
ON CONFLICT (id) DO NOTHING;
```

### **Step 2: Set Storage Policies**
```sql
-- Allow public read access
CREATE POLICY "Public Access to Song Covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'song-covers');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload to Song Covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'song-covers');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated Update Song Covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'song-covers');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated Delete Song Covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'song-covers');
```

---

## 🖼️ Upload Cover Images

### **Method 1: Via Supabase Dashboard**
1. Go to Storage → song-covers bucket
2. Click "Upload file"
3. Select image (400x400px to 800x800px recommended)
4. Copy the public URL
5. Update song record with URL

### **Method 2: Via SQL (If Images Already Hosted)**
```sql
-- Update songs with external image URLs
UPDATE songs 
SET cover_url = 'https://example.com/covers/song1.jpg'
WHERE id = 'song-id-1';

UPDATE songs 
SET cover_url = 'https://example.com/covers/song2.jpg'
WHERE id = 'song-id-2';
```

### **Method 3: Via JavaScript (Programmatic Upload)**
```javascript
import { supabase } from './config/supabase';

async function uploadCoverImage(songId, imageFile) {
  // Upload to storage
  const fileName = `${songId}-${Date.now()}.jpg`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('song-covers')
    .upload(fileName, imageFile);

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('song-covers')
    .getPublicUrl(fileName);

  // Update song record
  const { error: updateError } = await supabase
    .from('songs')
    .update({ cover_url: publicUrl })
    .eq('id', songId);

  if (updateError) throw updateError;

  return publicUrl;
}
```

---

## ✅ Verification Checklist

### **Database:**
- [ ] `cover_url` column exists in `songs` table
- [ ] Existing songs have `cover_url` values (or NULL for fallback)
- [ ] Old `banner_url` and `show_banner` columns removed (optional)

### **Storage:**
- [ ] `song-covers` bucket created
- [ ] Bucket is public
- [ ] Storage policies configured
- [ ] Cover images uploaded

### **Frontend:**
- [ ] SongBanner component removed
- [ ] Home.jsx updated (no banner section)
- [ ] SongCard.jsx uses `cover_url` for backgrounds
- [ ] CSS updated with gradient overlay

### **Testing:**
- [ ] Songs with `cover_url` show background images
- [ ] Songs without `cover_url` show fallback (no errors)
- [ ] Real-time updates work (no refresh needed)
- [ ] Responsive design works on mobile/tablet/desktop

---

## 🎯 Example: Complete Migration

### **Step-by-Step Example:**

```sql
-- 1. Add cover_url column
ALTER TABLE songs ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- 2. Create storage bucket (via Supabase Dashboard or SQL)
-- Already done in Storage Setup section above

-- 3. Upload images and get URLs (via Dashboard or API)
-- Example URLs after upload:
-- https://xxxxx.supabase.co/storage/v1/object/public/song-covers/song1.jpg
-- https://xxxxx.supabase.co/storage/v1/object/public/song-covers/song2.jpg

-- 4. Update songs with cover URLs
UPDATE songs 
SET cover_url = 'https://xxxxx.supabase.co/storage/v1/object/public/song-covers/song1.jpg'
WHERE id = 'song-id-1';

UPDATE songs 
SET cover_url = 'https://xxxxx.supabase.co/storage/v1/object/public/song-covers/song2.jpg'
WHERE id = 'song-id-2';

-- 5. Verify
SELECT id, title, cover_url FROM songs;

-- 6. (Optional) Clean up old columns
ALTER TABLE songs DROP COLUMN IF EXISTS banner_url;
ALTER TABLE songs DROP COLUMN IF EXISTS show_banner;
```

---

## 🚨 Rollback Plan (If Needed)

If something goes wrong, you can rollback:

```sql
-- Restore banner_url from cover_url (if you didn't drop it yet)
UPDATE songs 
SET banner_url = cover_url
WHERE cover_url IS NOT NULL;

-- Re-enable show_banner for songs with covers
UPDATE songs 
SET show_banner = true
WHERE cover_url IS NOT NULL;
```

**Note:** Frontend changes would need to be reverted via Git:
```bash
git revert HEAD~7  # Revert last 7 commits (adjust number as needed)
```

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Supabase Storage bucket is public
3. Ensure URLs are accessible (test in browser)
4. Check database column exists: `SELECT cover_url FROM songs LIMIT 1;`

---

## 🎉 Migration Complete!

Once all steps are done:
- ✅ Each song card has its own background
- ✅ No separate banner system
- ✅ Cleaner database structure
- ✅ Better user experience

**Enjoy your improved music streaming app!** 🎵
