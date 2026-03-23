-- VoxIQ Supabase Database Schema
-- Paste and run this entirely in your Supabase SQL Editor

-- 1. Create the Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Create the Analyses Table
CREATE TABLE IF NOT EXISTS public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT,
  status TEXT DEFAULT 'completed',
  duration NUMERIC,
  transcript TEXT,
  words JSONB,
  filler_words JSONB,
  wpm_average NUMERIC,
  wpm_data JSONB,
  pitch_data JSONB,
  volume_data JSONB,
  emotions JSONB,
  emotion_timeline JSONB,
  dominant_emotion TEXT,
  overall_score NUMERIC,
  vocal_variety_score NUMERIC,
  pauses JSONB,
  recommendations JSONB,
  assembly_ai_id TEXT
);

-- Enable Row Level Security (RLS) for Analyses
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses" 
  ON public.analyses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses" 
  ON public.analyses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses" 
  ON public.analyses FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses" 
  ON public.analyses FOR DELETE USING (auth.uid() = user_id);
