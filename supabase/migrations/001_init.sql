-- PhoneZoo AI Ringtone Generator — Initial Schema
-- Run this in your Supabase SQL Editor

-- ============================================================
-- Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS ringtones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Input
  prompt TEXT NOT NULL,
  lyrics TEXT DEFAULT '',
  genre TEXT DEFAULT 'pop',
  duration_seconds INT DEFAULT 30 CHECK (duration_seconds BETWEEN 5 AND 120),
  seed INT,

  -- Output
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  audio_url TEXT,
  audio_size_kb INT,
  generation_time_ms INT,

  -- User (nullable = anonymous)
  user_id UUID REFERENCES auth.users(id),

  -- Metadata
  title TEXT,
  plays INT DEFAULT 0,
  downloads INT DEFAULT 0,
  is_public BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS genres (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  prompt_template TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS ringtones_status_idx ON ringtones(status);
CREATE INDEX IF NOT EXISTS ringtones_public_idx ON ringtones(is_public, created_at DESC);
CREATE INDEX IF NOT EXISTS ringtones_user_idx ON ringtones(user_id, created_at DESC);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE ringtones ENABLE ROW LEVEL SECURITY;

-- Public can read completed public ringtones
CREATE POLICY "public_read" ON ringtones
  FOR SELECT USING (is_public = true AND status = 'completed');

-- Authenticated users can read their own ringtones (any status)
CREATE POLICY "own_read" ON ringtones
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone can create a ringtone (anonymous + logged in)
CREATE POLICY "anyone_insert" ON ringtones
  FOR INSERT WITH CHECK (true);

-- Service role key bypasses RLS automatically — no extra policy needed for webhook updates

-- ============================================================
-- Seed: Genres
-- ============================================================

INSERT INTO genres (id, name, description, prompt_template, icon, sort_order) VALUES
  ('pop',       'Pop',       'Catchy, upbeat pop melodies',         'upbeat pop melody, catchy hook, bright synths, 120 bpm',               '🎵', 1),
  ('rock',      'Rock',      'Energetic guitar-driven rock',        'energetic rock, electric guitar riff, driving drums, distorted',        '🎸', 2),
  ('edm',       'EDM',       'Electronic dance with big drops',     'electronic dance music, synthesizer lead, heavy bass drop, 128 bpm',    '⚡', 3),
  ('hiphop',    'Hip Hop',   'Hip hop beats and trap production',   'hip hop beat, trap hi-hats, 808 bass, dark melodic hook, 90 bpm',       '🎤', 4),
  ('lofi',      'Lo-Fi',     'Chill lo-fi beats for relaxing',      'lo-fi hip hop, mellow piano, vinyl crackle, relaxing, slow tempo',      '☕', 5),
  ('classical', 'Classical', 'Orchestral and piano compositions',   'orchestral strings, piano melody, cinematic, elegant, classical music', '🎻', 6),
  ('jazz',      'Jazz',      'Smooth jazz with swing feel',         'smooth jazz, piano chords, walking bass, swing rhythm, saxophone',      '🎷', 7),
  ('ambient',   'Ambient',   'Atmospheric soundscapes',             'ambient soundscape, atmospheric pads, dreamy, slow, ethereal',          '🌙', 8),
  ('funk',      'Funk',      'Groovy funk with punchy bass',        'funky bass line, rhythm guitar, groove, 96 bpm, punchy drums',          '🕺', 9),
  ('kpop',      'K-Pop',     'K-pop style energetic pop',           'K-pop style, catchy hook, bright synths, energetic dance beat',         '✨', 10)
ON CONFLICT (id) DO NOTHING;
