# Testing Guide - Data Isolation Verification

## Overview
This guide helps you verify that the multi-tenant SaaS transformation is working correctly and that data is properly isolated between users.

## Pre-Testing Checklist
- [x] Database schema created with profiles, keywords, and automation_configs tables
- [x] Row Level Security (RLS) enabled on all tables
- [x] RLS policies implemented for data isolation
- [x] Authentication system implemented
- [x] Protected routes configured
- [x] User menu with logout functionality added
- [x] Build completed successfully

## Test Scenarios

### 1. User Registration & Authentication

**Test 1.1: Sign Up**
1. Navigate to `/signup`
2. Create a new account with:
   - Full Name: Test User 1
   - Email: test1@example.com
   - Password: test123456
3. Verify:
   - ✓ Successfully redirected to dashboard after signup
   - ✓ Profile automatically created in database
   - ✓ User email displayed in sidebar user menu
   - ✓ Empty dashboard with no keywords

**Test 1.2: Login**
1. Log out from Test User 1
2. Navigate to `/login`
3. Log in with test1@example.com credentials
4. Verify:
   - ✓ Successfully logged in
   - ✓ Previous data persists (if any was created)

**Test 1.3: Logout**
1. Click user menu in sidebar
2. Click "Sair" (Logout)
3. Verify:
   - ✓ Redirected to login page
   - ✓ Cannot access protected routes without authentication

### 2. Data Creation & Persistence

**Test 2.1: Create Keywords**
As Test User 1:
1. Navigate to "Palavras-Chave" page
2. Create 3 keywords:
   - Keyword 1: "teste1" → https://example.com/1
   - Keyword 2: "teste2" → https://example.com/2
   - Keyword 3: "teste3" → https://example.com/3
3. Verify:
   - ✓ Keywords appear in list immediately
   - ✓ Keywords count updates on dashboard
   - ✓ Data persists after page refresh

**Test 2.2: Update Configuration**
As Test User 1:
1. Navigate to "Configurações" page
2. Update Instagram API settings:
   - Access Token: "test_token_user1"
   - Instagram ID: "123456789"
   - Base URL: "https://n8n-user1.com"
3. Save changes
4. Verify:
   - ✓ Settings save successfully
   - ✓ Settings persist after page refresh

### 3. Data Isolation Testing (CRITICAL)

**Test 3.1: Create Second User**
1. Log out from Test User 1
2. Sign up as new user:
   - Full Name: Test User 2
   - Email: test2@example.com
   - Password: test123456

**Test 3.2: Verify Empty State**
As Test User 2:
1. Check Dashboard
   - ✓ MUST show 0 active keywords
   - ✓ MUST show 0 total triggers
   - ✓ MUST NOT show any data from Test User 1
2. Check "Palavras-Chave" page
   - ✓ MUST be empty (no keywords from Test User 1)
3. Check "Configurações" page
   - ✓ MUST have default/empty configuration
   - ✓ MUST NOT show Test User 1's settings

**Test 3.3: Create Data for User 2**
As Test User 2:
1. Create different keywords:
   - Keyword: "user2keyword" → https://example.com/user2
2. Update configuration with different values:
   - Access Token: "test_token_user2"
   - Instagram ID: "987654321"
3. Verify:
   - ✓ User 2's data is saved correctly

**Test 3.4: Switch Between Users**
1. Log out from Test User 2
2. Log in as Test User 1
3. Verify:
   - ✓ ONLY Test User 1's keywords visible (teste1, teste2, teste3)
   - ✓ Test User 1's configuration shown
   - ✓ NO data from Test User 2 visible
4. Log out and log in as Test User 2
5. Verify:
   - ✓ ONLY Test User 2's keywords visible (user2keyword)
   - ✓ Test User 2's configuration shown
   - ✓ NO data from Test User 1 visible

### 4. Database-Level Verification

**Test 4.1: Check RLS Policies (Using Supabase Dashboard)**
1. Go to Supabase Dashboard → SQL Editor
2. Run as authenticated User 1:
   ```sql
   SELECT * FROM keywords;
   ```
   - ✓ Should ONLY return User 1's keywords
3. Try to access User 2's data directly:
   ```sql
   SELECT * FROM keywords WHERE user_id = '<user2-uuid>';
   ```
   - ✓ Should return EMPTY (RLS blocks access)

**Test 4.2: Verify Profile Creation Trigger**
1. Sign up as Test User 3
2. Check profiles table in Supabase:
   - ✓ Profile automatically created with user's email
   - ✓ Profile ID matches auth.users ID

### 5. Edge Cases

**Test 5.1: Protected Routes**
1. Log out completely
2. Try to access:
   - `/` (dashboard)
   - `/palavras-chave`
   - `/configuracoes`
   - `/perfil`
3. Verify:
   - ✓ All redirect to `/login`
   - ✓ After login, redirected back to requested page

**Test 5.2: Profile Update**
1. Log in as any user
2. Navigate to `/perfil`
3. Update full name
4. Save changes
5. Verify:
   - ✓ Name updates successfully
   - ✓ Name persists after refresh
   - ✓ Updated name shows in user menu initials

**Test 5.3: Concurrent Sessions**
1. Open two browser windows (or use incognito)
2. Log in as User 1 in window 1
3. Log in as User 2 in window 2
4. Create data in both windows simultaneously
5. Verify:
   - ✓ Each user sees only their own data
   - ✓ No data leakage between sessions

## Security Verification Checklist

### Row Level Security
- [x] RLS enabled on profiles table
- [x] RLS enabled on keywords table
- [x] RLS enabled on automation_configs table

### RLS Policies
- [x] Users can only SELECT their own rows
- [x] Users can only INSERT rows with their user_id
- [x] Users can only UPDATE their own rows
- [x] Users can only DELETE their own rows

### Authentication
- [x] Login works correctly
- [x] Sign up creates profile automatically
- [x] Logout clears session
- [x] Protected routes require authentication
- [x] Session persists on page refresh

### Data Isolation
- [x] Users cannot see other users' keywords
- [x] Users cannot see other users' configurations
- [x] Users cannot modify other users' data
- [x] Database queries are automatically scoped to user_id

## Common Issues & Solutions

### Issue: Can't see data after creating it
**Solution:** Check browser console for errors. Verify RLS policies allow SELECT.

### Issue: "Row Level Security" error when creating data
**Solution:** Verify user is authenticated. Check that INSERT policies include user_id check.

### Issue: Data from other users is visible
**Solution:** CRITICAL SECURITY ISSUE! Check RLS policies immediately. Verify:
1. RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
2. Policies use `auth.uid() = user_id` correctly
3. No policies using `USING (true)` which would expose all data

### Issue: Build fails
**Solution:** Run `npm install` to ensure all dependencies are installed.

## Success Criteria

All tests must pass with the following results:
✅ Users can register and login successfully
✅ Data persists across sessions (refresh/logout/login)
✅ Complete data isolation between users (CRITICAL)
✅ RLS policies prevent unauthorized access at database level
✅ Build completes without errors
✅ All pages load correctly with proper loading states
✅ No console errors in browser developer tools

## Next Steps After Testing

Once all tests pass:
1. ✅ Deploy to production
2. ✅ Monitor for any RLS policy violations
3. ✅ Set up error tracking (Sentry, LogRocket, etc.)
4. ✅ Add analytics to track user behavior
5. ✅ Consider adding subscription/billing features
6. ✅ Implement team/organization features if needed

## Notes

- Always test with at least 2 different users to verify data isolation
- Test on different browsers to ensure compatibility
- Test responsive design on mobile devices
- Monitor Supabase logs for any RLS policy violations
- Keep track of any edge cases discovered during testing
