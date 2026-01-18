# TOKA Database Schema

Run these SQL commands in your Supabase SQL Editor:

## 1. Songs Table

```sql
-- Create songs table
CREATE TABLE songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author_name TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read songs
CREATE POLICY "Anyone can read songs"
  ON songs FOR SELECT
  USING (true);

-- Allow anyone to insert songs (no auth for MVP)
CREATE POLICY "Anyone can insert songs"
  ON songs FOR INSERT
  WITH CHECK (true);

-- Create index for sorting by created_at
CREATE INDEX songs_created_at_idx ON songs(created_at DESC);

-- Create index for author_name lookups
CREATE INDEX songs_author_name_idx ON songs(author_name);
```

## 2. Comments Table

```sql
-- Create comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read comments
CREATE POLICY "Anyone can read comments"
  ON comments FOR SELECT
  USING (true);

-- Allow anyone to insert comments
CREATE POLICY "Anyone can insert comments"
  ON comments FOR INSERT
  WITH CHECK (true);

-- Create index for fetching comments by song
CREATE INDEX comments_song_id_idx ON comments(song_id, created_at DESC);
```

## 3. Reactions Table

```sql
-- Create reactions table
CREATE TABLE reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(song_id, session_id)
);

-- Enable Row Level Security
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reactions
CREATE POLICY "Anyone can read reactions"
  ON reactions FOR SELECT
  USING (true);

-- Allow anyone to insert reactions
CREATE POLICY "Anyone can insert reactions"
  ON reactions FOR INSERT
  WITH CHECK (true);

-- Allow anyone to delete their own reactions (unlike)
CREATE POLICY "Anyone can delete reactions"
  ON reactions FOR DELETE
  USING (true);

-- Create index for counting reactions per song
CREATE INDEX reactions_song_id_idx ON reactions(song_id);

-- Create index for checking if user already reacted
CREATE INDEX reactions_session_song_idx ON reactions(session_id, song_id);
```

## 4. Storage Bucket for Audio Files

In Supabase Storage, create a public bucket:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `songs`
3. Make it **public** (so audio files can be streamed)
4. Set the following policies:

```sql
-- Allow anyone to upload files to the songs bucket
CREATE POLICY "Anyone can upload songs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'songs');

-- Allow anyone to read files from the songs bucket
CREATE POLICY "Anyone can read songs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'songs');
```

## Setup Instructions

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Run each table creation block separately
4. Go to Storage and create the `songs` bucket
5. The database is now ready for TOKA!
