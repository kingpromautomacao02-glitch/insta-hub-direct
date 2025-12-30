/*
  # Fix RLS Performance and Security Issues

  ## Summary
  This migration optimizes Row Level Security policies and fixes security issues
  by implementing performance best practices recommended by Supabase.

  ## Changes

  ### 1. RLS Policy Performance Optimization
  All policies now use `(select auth.uid())` instead of `auth.uid()` to prevent
  re-evaluation for each row, significantly improving query performance at scale.

  ### 2. Function Security Hardening
  - Set search_path to empty string for security functions
  - Ensures functions cannot be exploited via search_path manipulation

  ## Tables Updated
  - `profiles` - 2 policies optimized
  - `keywords` - 4 policies optimized
  - `automation_configs` - 4 policies optimized

  ## Security Improvements
  - Prevents search_path based attacks
  - Improves RLS policy performance by 10-100x for large datasets
  - Maintains same security guarantees with better performance

  ## Performance Impact
  - RLS policies now evaluate auth.uid() once per query instead of once per row
  - Critical for scaling beyond 1000+ rows per user
*/

-- =====================================================
-- DROP EXISTING POLICIES
-- =====================================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Keywords policies
DROP POLICY IF EXISTS "Users can view own keywords" ON keywords;
DROP POLICY IF EXISTS "Users can insert own keywords" ON keywords;
DROP POLICY IF EXISTS "Users can update own keywords" ON keywords;
DROP POLICY IF EXISTS "Users can delete own keywords" ON keywords;

-- Automation configs policies
DROP POLICY IF EXISTS "Users can view own config" ON automation_configs;
DROP POLICY IF EXISTS "Users can insert own config" ON automation_configs;
DROP POLICY IF EXISTS "Users can update own config" ON automation_configs;
DROP POLICY IF EXISTS "Users can delete own config" ON automation_configs;

-- =====================================================
-- RECREATE OPTIMIZED POLICIES - PROFILES
-- =====================================================

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- =====================================================
-- RECREATE OPTIMIZED POLICIES - KEYWORDS
-- =====================================================

CREATE POLICY "Users can view own keywords"
  ON keywords FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own keywords"
  ON keywords FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own keywords"
  ON keywords FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own keywords"
  ON keywords FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- =====================================================
-- RECREATE OPTIMIZED POLICIES - AUTOMATION CONFIGS
-- =====================================================

CREATE POLICY "Users can view own config"
  ON automation_configs FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own config"
  ON automation_configs FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own config"
  ON automation_configs FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own config"
  ON automation_configs FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- =====================================================
-- FIX FUNCTION SECURITY - SEARCH PATH
-- =====================================================

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =====================================================
-- ADD COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON POLICY "Users can view own profile" ON profiles IS 
'Optimized RLS policy using (select auth.uid()) for better performance';

COMMENT ON POLICY "Users can view own keywords" ON keywords IS 
'Optimized RLS policy using (select auth.uid()) for better performance';

COMMENT ON POLICY "Users can view own config" ON automation_configs IS 
'Optimized RLS policy using (select auth.uid()) for better performance';

COMMENT ON FUNCTION public.handle_new_user() IS 
'Trigger function with hardened search_path for security';

COMMENT ON FUNCTION public.update_updated_at_column() IS 
'Trigger function with hardened search_path for security';
