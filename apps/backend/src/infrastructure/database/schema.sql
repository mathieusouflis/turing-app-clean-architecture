-- PostgreSQL schema for Turing machine tapes
CREATE TABLE IF NOT EXISTS tapes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL DEFAULT '',
  head_position INTEGER NOT NULL DEFAULT 0,
  current_state TEXT NOT NULL DEFAULT 'q0',
  transitions JSONB NOT NULL DEFAULT '[]'::jsonb,
  initial_state TEXT NOT NULL DEFAULT 'q0',
  final_states TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tapes_created_at ON tapes(created_at);

