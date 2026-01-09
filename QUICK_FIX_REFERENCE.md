# Quick Fix Reference

## The Problems
1. **Trying to insert non-existent columns**: `clubs`, `roles` don't exist in profiles table
2. **Using camelCase instead of snake_case**: Inserting `firstAidCertified` instead of `first_aid_certified`

## The Solution

### Three key changes:

1. **In authService.ts signup():**
   ```typescript
   // Use mapProfileToDb to convert camelCase to snake_case
   const profileData = {
     id: authData.user.id,
     ...this.mapProfileToDb(profile),  // ✅ Converts firstAidCertified → first_aid_certified
   }
   // Don't insert clubs/roles - they're managed separately
   ```

2. **In dataService.ts create():**
   ```typescript
   // Apply mapToDb before inserting
   const dbData = this.mapToDb(table, data)  // ✅ Proper conversion
   await supabase.from(table).insert([dbData])
   ```

3. **In dataService.ts getClubMembers():**
   ```typescript
   // Query through join table, not directly on profiles
   await supabase
     .from('profile_clubs')
     .select('profiles(*)')
     .eq('club_id', clubId)
   ```

## Database Field Mapping

| TypeScript | Database |
|-----------|----------|
| `firstAidCertified` | `first_aid_certified` |
| `profileImageUrl` | `profile_image_url` |
| `refereeRating` | `referee_rating` |
| `juryRating` | `jury_rating` |
| `useAlias` | `use_alias` |
| `publicProfile` | `public_profile` |

## Important: Not Database Columns

These are TypeScript properties but NOT in the profiles table:
- `clubs` - stored in `profile_clubs` join table
- `roles` - stored in `user_roles` join table

## Result

✅ User signup now works without schema errors
✅ All CRUD operations use proper naming conventions
✅ Relationships properly managed through join tables

