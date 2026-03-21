/**
 * SQLite database — local dev / testing
 * File: phonezoo.db (created automatically in project root)
 */
import Database from 'better-sqlite3'
import path from 'path'
import type { Genre, Ringtone } from '@/types'

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(path.join(process.cwd(), 'phonezoo.db'))
    _db.pragma('journal_mode = WAL')
    initSchema(_db)
  }
  return _db
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_ringtones (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      prompt TEXT NOT NULL,
      lyrics TEXT DEFAULT '',
      genre TEXT DEFAULT 'pop',
      duration_seconds INTEGER DEFAULT 30,
      seed INTEGER,
      status TEXT DEFAULT 'pending',
      audio_url TEXT,
      audio_size_kb INTEGER,
      generation_time_ms INTEGER,
      user_id TEXT,
      title TEXT,
      plays INTEGER DEFAULT 0,
      downloads INTEGER DEFAULT 0,
      is_public INTEGER DEFAULT 1
    );
    CREATE INDEX IF NOT EXISTS idx_ai_ringtones_status ON ai_ringtones(status);
    CREATE INDEX IF NOT EXISTS idx_ai_ringtones_public ON ai_ringtones(is_public, created_at DESC);

    CREATE TABLE IF NOT EXISTS genres (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      prompt_template TEXT NOT NULL,
      icon TEXT,
      sort_order INTEGER DEFAULT 0
    );
  `)

  const upsert = db.prepare(
    `INSERT OR IGNORE INTO genres (id, name, description, prompt_template, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)`
  )
  const seed = db.transaction(() => {
    upsert.run('pop',       'Pop',       'Catchy, upbeat pop melodies',         'upbeat pop melody, catchy hook, bright synths, 120 bpm',               '🎵', 1)
    upsert.run('rock',      'Rock',      'Energetic guitar-driven rock',        'energetic rock, electric guitar riff, driving drums, distorted',        '🎸', 2)
    upsert.run('edm',       'EDM',       'Electronic dance with big drops',     'electronic dance music, synthesizer lead, heavy bass drop, 128 bpm',    '⚡', 3)
    upsert.run('hiphop',    'Hip Hop',   'Hip hop beats and trap production',   'hip hop beat, trap hi-hats, 808 bass, dark melodic hook, 90 bpm',       '🎤', 4)
    upsert.run('lofi',      'Lo-Fi',     'Chill lo-fi beats for relaxing',      'lo-fi hip hop, mellow piano, vinyl crackle, relaxing, slow tempo',      '☕', 5)
    upsert.run('classical', 'Classical', 'Orchestral and piano compositions',   'orchestral strings, piano melody, cinematic, elegant, classical music', '🎻', 6)
    upsert.run('jazz',      'Jazz',      'Smooth jazz with swing feel',         'smooth jazz, piano chords, walking bass, swing rhythm, saxophone',      '🎷', 7)
    upsert.run('ambient',   'Ambient',   'Atmospheric soundscapes',             'ambient soundscape, atmospheric pads, dreamy, slow, ethereal',          '🌙', 8)
    upsert.run('funk',      'Funk',      'Groovy funk with punchy bass',        'funky bass line, rhythm guitar, groove, 96 bpm, punchy drums',          '🕺', 9)
    upsert.run('kpop',      'K-Pop',     'K-pop style energetic pop',           'K-pop style, catchy hook, bright synths, energetic dance beat',         '✨', 10)
  })
  seed()
}

// Convert SQLite row (is_public = 0/1) to Ringtone type
export function rowToRingtone(row: Record<string, unknown>): Ringtone {
  return { ...row, is_public: row.is_public === 1 } as Ringtone
}

export function getGenres(): Genre[] {
  return getDb().prepare('SELECT * FROM genres ORDER BY sort_order').all() as Genre[]
}

export function getRecentRingtones(limit = 6): Ringtone[] {
  return (getDb()
    .prepare(`SELECT * FROM ai_ringtones WHERE status = 'completed' AND is_public = 1 ORDER BY created_at DESC LIMIT ?`)
    .all(limit) as Record<string, unknown>[])
    .map(rowToRingtone)
}

export function getRingtoneById(id: string): Ringtone | null {
  const row = getDb()
    .prepare(`SELECT * FROM ai_ringtones WHERE id = ? AND status = 'completed'`)
    .get(id) as Record<string, unknown> | undefined
  return row ? rowToRingtone(row) : null
}
