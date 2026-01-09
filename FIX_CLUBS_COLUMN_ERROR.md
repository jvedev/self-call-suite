# Fix: "Could not find the 'clubs' column of 'profiles'" Error

## Problem
The application was encountering the error:
```
Could not find the 'clubs' column of 'profiles' in the schema cache
```

And subsequently:
```
Could not find the 'firstAidCertified' column of 'profiles' in the schema cache
```

This occurred because:
1. The TypeScript code was trying to insert and update `clubs` and `roles` fields directly into the `profiles` table, but these columns don't exist in the database schema
2. The TypeScript code uses camelCase property names (e.g., `firstAidCertified`), but the database schema uses snake_case column names (e.g., `first_aid_certified`), and the name conversion wasn't being applied during inserts

## Root Cause
The database schema uses **join tables** for many-to-many relationships:
- **`profile_clubs`** - Links profiles to clubs (not a column in profiles table)
- **`user_roles`** - Links users to authentication roles (not a column in profiles table)

However, the TypeScript types defined `clubs` and `roles` as properties of `UserProfile`, and the code was treating them as if they were columns in the `profiles` table.

## Database Schema Context
```sql
-- profiles table - does NOT have 'clubs' or 'roles' columns
create table profiles (
    id uuid primary key,
    name text not null,
    alias text not null,
    email text not null unique,
    profile_image_url text,
    referee_rating integer not null default 0,
    jury_rating integer not null default 0,
    first_aid_certified boolean not null default false,
    useAlias boolean not null default false,
    public_profile boolean not null default true
);

-- Join table for many-to-many relationship
create table profile_clubs (
    profile_id uuid references profiles(id) on delete cascade,
    club_id uuid references clubs(id) on delete cascade,
    primary key (profile_id, club_id)
);

-- Join table for authentication roles
create table user_roles (
    user_id uuid references auth.users(id) on delete cascade,
    role text check (role in ('admin', 'table-crew', 'staff')),
    primary key (user_id, role)
);
```

## Changes Made

### 1. **authService.ts** - Fixed signup method
**Before:**
```typescript
const profileData = {
  id: authData.user.id,
  ...profile,  // ❌ camelCase properties not converted to snake_case
  roles: [UserRole.EVENT_PARTICIPANT],
  clubs: [],
}
```

**After:**
```typescript
const profileData = {
  id: authData.user.id,
  ...this.mapProfileToDb(profile),  // ✅ Convert camelCase to snake_case
}
// Then return with default roles and empty clubs (don't insert them)
return { user: { ...profile, roles: [UserRole.EVENT_PARTICIPANT], clubs: [] } as UserProfile }
```

The key change is using `this.mapProfileToDb(profile)` to convert properties like:
- `firstAidCertified` → `first_aid_certified`
- `profileImageUrl` → `profile_image_url`
- `useAlias` → `use_alias`
- `publicProfile` → `public_profile`
- `refereeRating` → `referee_rating`
- `juryRating` → `jury_rating`

### 2. **authService.ts** - Fixed mapProfileToDb method
**Before:**
```typescript
private mapProfileToDb(profile: Partial<UserProfile>): any {
  return {
    name: profile.name,
    alias: profile.alias,
    // ... other fields ...
    roles: profile.roles,      // ❌ These columns don't exist
    clubs: profile.clubs,      // ❌ These columns don't exist
  }
}
```

**After:**
```typescript
private mapProfileToDb(profile: Partial<UserProfile>): any {
  return {
    name: profile.name,
    alias: profile.alias,
    // ... other fields ...
    // Note: roles and clubs are managed separately through join tables
  }
}
```

### 3. **dataService.ts** - Fixed getClubMembers method
**Before:**
```typescript
async getClubMembers(clubId: string): Promise<{ data: UserProfile[]; error?: string }> {
  return dataService.query<UserProfile>('profiles', { clubs: clubId })  // ❌ clubs is not a column
}
```

**After:**
```typescript
async getClubMembers(clubId: string): Promise<{ data: UserProfile[]; error?: string }> {
  try {
    // Query through the profile_clubs join table to get all profiles in a club
    const { data, error } = await supabase
      .from('profile_clubs')
      .select('profiles(*)')
      .eq('club_id', clubId)

    if (error) {
      return { data: [], error: error.message }
    }

    // Extract profiles from the join table results
    const profiles = (data || [])
      .map((row: any) => row.profiles)
      .filter(Boolean)
      .map((profile: any) => this.mapProfileFromDb(profile) as UserProfile)

    return { data: profiles }
  } catch (error) {
    return { data: [], error: String(error) }
  }
}
```

### 4. **dataService.ts** - Fixed create method
**Before:**
```typescript
async create<T extends Entity>(
  table: string,
  data: Omit<T, 'id'>
): Promise<{ data: T | null; error?: string }> {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert([data])  // ❌ data still in camelCase, not converted
      .select()
      .single()
    // ...
  }
}
```

**After:**
```typescript
async create<T extends Entity>(
  table: string,
  data: Omit<T, 'id'>
): Promise<{ data: T | null; error?: string }> {
  try {
    const dbData = this.mapToDb(table, data)  // ✅ Convert to snake_case first
    const { data: result, error } = await supabase
      .from(table)
      .insert([dbData])  // ✅ Now insert converted data
      .select()
      .single()
    // ...
  }
}
```

This ensures that all entity creation operations use the proper camelCase to snake_case conversion before inserting into the database.

## Future Implementation Notes

### For Fetching User Clubs
To properly retrieve all clubs for a user, you'll need to:
1. Query the `profile_clubs` table filtered by `profile_id`
2. Join with the `clubs` table to get club details

Example:
```typescript
const { data, error } = await supabase
  .from('profile_clubs')
  .select('clubs(*)')
  .eq('profile_id', userId)
```

### For Managing User Roles
To manage user application roles:
1. Use the `user_roles` table for authentication roles (admin, table-crew, staff)
2. Consider creating a `profile_roles` table if you need application-level roles separate from auth roles

## Testing
After these changes:
1. User signup should work without schema errors
2. User profiles can be updated without trying to update non-existent columns
3. Club member queries should properly fetch through the join table

The application will now correctly separate concerns:
- **Direct profile properties** - stored in the `profiles` table
- **Relationships** - managed through join tables (`profile_clubs`, `user_roles`, etc.)
