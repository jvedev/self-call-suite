# Database Schema Mismatch Fix - Complete Summary

## Issues Fixed

### 1. Non-existent Columns in profiles Table
**Error:** `Could not find the 'clubs' column of 'profiles' in the schema cache`
- The `profiles` table doesn't have `clubs` or `roles` columns
- These are many-to-many relationships managed through join tables (`profile_clubs`, `user_roles`)

### 2. camelCase vs snake_case Column Names
**Error:** `Could not find the 'firstAidCertified' column of 'profiles' in the schema cache`
- TypeScript code uses camelCase (e.g., `firstAidCertified`, `profileImageUrl`)
- Database uses snake_case (e.g., `first_aid_certified`, `profile_image_url`)
- The conversion wasn't being applied during inserts

## Files Modified

### 1. `apps/suite/src/services/authService.ts`

**Changes:**
- Modified `signup()` method to use `mapProfileToDb()` for camelCase to snake_case conversion
- Removed `roles` and `clubs` from the profile insertion (they're not database columns)
- Updated return statement to include the user `id`

```typescript
// Now properly converts: firstAidCertified → first_aid_certified
const profileData = {
  id: authData.user.id,
  ...this.mapProfileToDb(profile),  // ✅ Applies proper conversion
}
```

- Updated `mapProfileToDb()` to exclude `roles` and `clubs` (managed separately)

### 2. `apps/suite/src/services/dataService.ts`

**Changes:**
- Modified `create()` method to apply `mapToDb()` conversion before inserting
- Improved `getClubMembers()` to query through the `profile_clubs` join table

```typescript
// Now converts data before inserting
const dbData = this.mapToDb(table, data)  // ✅ Applies proper conversion
const { data: result, error } = await supabase
  .from(table)
  .insert([dbData])
```

### 3. `apps/suite/vite-env.d.ts`

**Changes:**
- Fixed syntax error (extra closing brace)

## How camelCase to snake_case Conversion Works

The `mapToDb()` function in DataService:
```typescript
private mapToDb(_table: string, data: Partial<Entity>): any {
  const mapped: any = {}
  Object.entries(data).forEach(([key, value]) => {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    mapped[snakeKey] = value
  })
  return mapped
}
```

This converts:
- `firstAidCertified` → `first_aid_certified`
- `profileImageUrl` → `profile_image_url`
- `refereeRating` → `referee_rating`
- `juryRating` → `jury_rating`
- `useAlias` → `use_alias`
- `publicProfile` → `public_profile`

## How Join Tables Work

### For Clubs (many-to-many relationship)
```typescript
// Database structure:
CREATE TABLE profile_clubs (
  profile_id uuid REFERENCES profiles(id),
  club_id uuid REFERENCES clubs(id),
  PRIMARY KEY (profile_id, club_id)
);

// TypeScript type includes clubs for application use:
interface UserProfile {
  clubs: string[];  // club IDs
}

// But it's NOT a column in profiles table - it's a relationship
```

### To fetch a user's clubs:
```typescript
const { data, error } = await supabase
  .from('profile_clubs')
  .select('clubs(*)')
  .eq('profile_id', userId)
```

### To fetch members of a club:
```typescript
const { data, error } = await supabase
  .from('profile_clubs')
  .select('profiles(*)')
  .eq('club_id', clubId)
```

## Verification

✅ All TypeScript compilation errors resolved
✅ Proper camelCase to snake_case conversion applied
✅ Non-existent columns no longer referenced
✅ Join table relationships properly implemented

## Testing

After these changes:
1. User signup will properly insert profile data with correct column names
2. All entity creation will use proper naming conventions
3. Profile updates will convert field names correctly
4. Club member queries will fetch through join tables

## Future Enhancements

If you need to retrieve clubs/roles with profiles:

```typescript
// Fetch profile with clubs
async getUserWithClubs(userId: string) {
  const profile = await this.getUserProfile(userId);
  const { data: clubLinks } = await supabase
    .from('profile_clubs')
    .select('clubs(*)')
    .eq('profile_id', userId);
  
  return {
    ...profile,
    clubs: clubLinks?.map(link => link.clubs) || []
  };
}
```

