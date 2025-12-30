/*
  # Create Multi-Tenant SaaS Schema

  ## Overview
  This migration sets up the complete database schema for a multi-tenant Instagram automation SaaS.
  It creates user profiles, keywords, and automation configuration tables with strict Row Level Security.

  ## New Tables

  ### 1. `profiles`
  User profile information extending Supabase auth.users
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique, not null)
  - `full_name` (text, nullable)
  - `avatar_url` (text, nullable)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### 2. `keywords`
  Keyword triggers for Instagram automation, scoped per user
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles)
  - `word` (text, the trigger keyword)
  - `enabled` (boolean, default true)
  - `link` (text, destination URL)
  - `message` (text, automated message)
  - `button_text` (text, CTA button text)
  - `triggers_count` (integer, usage counter)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `automation_configs`
  Per-user automation settings and API credentials
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles, unique)
  - `access_token` (text, Instagram API token)
  - `instagram_id` (text, Instagram account ID)
  - `base_url` (text, n8n base URL)
  - `api_key` (text, n8n API key)
  - `delay_seconds` (integer, delay between responses)
  - `reply_to_comment` (boolean, auto-reply setting)
  - `send_dm` (boolean, auto-DM setting)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security

  ### Row Level Security (RLS)
  All tables have RLS enabled with policies that ensure:
  - Users can only access their own data
  - Authentication is required for all operations
  - Policies use auth.uid() to enforce user isolation

  ### Profiles Table Policies
  1. Users can view their own profile
  2. Users can update their own profile
  3. Profiles are auto-created on signup (trigger)

  ### Keywords Table Policies
  1. Users can view only their keywords
  2. Users can insert keywords for themselves
  3. Users can update only their keywords
  4. Users can delete only their keywords

  ### Automation Configs Table Policies
  1. Users can view only their config
  2. Users can insert their config
  3. Users can update only their config
  4. Users can delete only their config

  ## Important Notes
  - Database trigger automatically creates profile on user signup
  - One config per user (unique constraint on user_id)
  - All timestamps use timestamptz for timezone support
  - Indexes on user_id columns for query performance
  - Sensitive data (tokens, keys) stored securely in automation_configs
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- KEYWORDS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  word text NOT NULL,
  enabled boolean DEFAULT true NOT NULL,
  link text NOT NULL,
  message text DEFAULT '' NOT NULL,
  button_text text DEFAULT '' NOT NULL,
  triggers_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS keywords_user_id_idx ON keywords(user_id);
CREATE INDEX IF NOT EXISTS keywords_enabled_idx ON keywords(enabled);

-- Enable RLS on keywords
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;

-- Keywords RLS Policies
CREATE POLICY "Users can view own keywords"
  ON keywords FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own keywords"
  ON keywords FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own keywords"
  ON keywords FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own keywords"
  ON keywords FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- AUTOMATION CONFIGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS automation_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  access_token text DEFAULT '',
  instagram_id text DEFAULT '',
  base_url text DEFAULT '',
  api_key text DEFAULT '',
  delay_seconds integer DEFAULT 5 NOT NULL,
  reply_to_comment boolean DEFAULT true NOT NULL,
  send_dm boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS automation_configs_user_id_idx ON automation_configs(user_id);

-- Enable RLS on automation_configs
ALTER TABLE automation_configs ENABLE ROW LEVEL SECURITY;

-- Automation Configs RLS Policies
CREATE POLICY "Users can view own config"
  ON automation_configs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own config"
  ON automation_configs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own config"
  ON automation_configs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own config"
  ON automation_configs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- UPDATED_AT TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_keywords_updated_at ON keywords;
CREATE TRIGGER update_keywords_updated_at
  BEFORE UPDATE ON keywords
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_automation_configs_updated_at ON automation_configs;
CREATE TRIGGER update_automation_configs_updated_at
  BEFORE UPDATE ON automation_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
