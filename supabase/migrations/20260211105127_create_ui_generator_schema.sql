/*
  # UI Generator Schema

  1. New Tables
    - `sessions`
      - `id` (uuid, primary key)
      - `title` (text) - Session title
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `role` (text) - 'user' or 'assistant'
      - `content` (text) - Message content
      - `created_at` (timestamptz)
    
    - `generations`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `version` (integer) - Version number
      - `plan` (jsonb) - Structured plan from Planner agent
      - `code` (text) - Generated React code
      - `explanation` (text) - Plain English explanation
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Public read/write for MVP (no auth required per assignment)
*/

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text DEFAULT 'New UI Session',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  version integer NOT NULL DEFAULT 1,
  plan jsonb,
  code text NOT NULL,
  explanation text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, version)
  
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to sessions"
  ON sessions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to sessions"
  ON sessions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to sessions"
  ON sessions FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to messages"
  ON messages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to messages"
  ON messages FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read access to generations"
  ON generations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to generations"
  ON generations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS messages_session_id_idx ON messages(session_id);
CREATE INDEX IF NOT EXISTS generations_session_id_idx ON generations(session_id);