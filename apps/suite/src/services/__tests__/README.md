# Jest Integration Tests

This directory contains integration tests for the Suite application services that test actual Supabase operations **without mocking**.

## Setup

### 1. Install Dependencies
```bash
npm install
```

Jest and testing dependencies are already configured in `package.json`.

### 2. Configure Environment Variables

Create a `.env.test` file in the `apps/suite` directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```

Or use your existing `.env` or `.env.local` file if you prefer.

**Important Notes:**
- Use a **test/development** Supabase project, NOT production
- The tests will create and delete test data, so ensure you have a dedicated project
- The anon key (public key) is sufficient for these tests

### 3. Database Setup

Ensure your Supabase project has the schema from `backend/supabase_schema.sql` applied.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test authService.test.ts
npm test dataService.test.ts
```

## Test Files

### `authService.test.ts`
Tests the authentication service with real Supabase operations:

- **signup()** - User registration with profile creation
  - Validates camelCase to snake_case field conversion
  - Ensures `clubs` and `roles` are NOT stored as database columns
  - Verifies proper data insertion with correct column names
  - Tests handling of optional fields
  - Validates that join table fields work correctly

- **mapProfileFromDb()** - Database to application mapping
  - Tests snake_case to camelCase conversion
  - Validates all profile fields are properly mapped

- **updateProfile()** - Profile updates
  - Tests field conversion on updates
  - Validates that updates use correct database column names

- **Column consistency** - Database schema validation
  - Ensures all columns use snake_case naming
  - Verifies no camelCase columns exist in database

### `dataService.test.ts`
Tests the generic data service with real Supabase operations:

- **create()** - Entity creation with mapping
  - Tests camelCase to snake_case conversion
  - Validates proper database column names
  - Verifies returned data is in camelCase format

- **update()** - Entity updates with mapping
  - Tests field conversion on updates
  - Validates correct column names

- **getAll()** - Entity retrieval with mapping
  - Tests snake_case to camelCase conversion on retrieval
  - Validates returned format matches application expectations

- **Column consistency** - Entity field mapping validation
  - Ensures proper conversion for all field types
  - Validates database vs. application naming conventions

## Test Data & Cleanup

Each test:
1. Creates test data in Supabase
2. Performs operations to verify behavior
3. Automatically cleans up test data after completion

Tests are designed to be safe for repeated execution:
- Uses timestamps to create unique test data
- Properly cleans up after themselves
- Uses `afterAll` hooks to ensure cleanup

## Troubleshooting

### "Missing Supabase environment variables"
Ensure you've created `.env.test` or `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY`.

### "Connection refused" or network errors
1. Verify your Supabase URL is correct and the project is active
2. Check your internet connection
3. Ensure the key/project is not expired

### Tests are slow
Integration tests are inherently slower than unit tests as they make real network requests:
- Typical test time: 5-15 seconds depending on network
- Timeout is set to 30 seconds per test
- If tests consistently timeout, your network may be slow

### Row doesn't exist errors
This usually means the insert succeeded but the select failed. Try:
1. Check your Supabase project is active
2. Verify the schema is properly applied
3. Check that RLS policies (if any) allow reads

### Profile field errors
Verify the database schema uses snake_case column names:
- `first_aid_certified` (not `firstAidCertified`)
- `profile_image_url` (not `profileImageUrl`)
- `use_alias` (not `useAlias`)
- `referee_rating` (not `refereeRating`)
- `jury_rating` (not `juryRating`)
- `public_profile` (not `publicProfile`)

If any columns use camelCase, run the schema migration to fix them.

## What These Tests Verify

✅ **camelCase to snake_case conversion** works correctly
✅ **Field mapping** functions properly in both directions
✅ **Database columns** use correct naming conventions
✅ **Data integrity** is preserved through conversions
✅ **Non-existent columns** are not inserted
✅ **Optional fields** are handled correctly
✅ **Relationships** (clubs, roles) use join tables, not direct columns

## Why No Mocking?

These tests use real Supabase operations because:

1. **Real behavior validation** - Tests verify actual database behavior, not mocked behavior
2. **Integration testing** - Ensures the full stack (TypeScript → Supabase → Database) works
3. **Schema validation** - Catches database schema issues that mocks wouldn't catch
4. **Naming convention verification** - Ensures camelCase/snake_case mapping is correct

Without these integration tests, you might not catch:
- Column naming mismatches
- Missing schema fields
- Field type incompatibilities
- Relationship issues

## CI/CD Integration

To run these tests in CI/CD:

```yaml
# Example GitHub Actions
- name: Run integration tests
  env:
    VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    VITE_SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
  run: npm test
```

## Performance Notes

- First test run may be slower (module loading)
- Subsequent runs are cached
- Network latency affects test duration (typical: 5-15 seconds total)
- Each test creates/deletes data, adding some overhead

## Future Improvements

- Add test data factories for common scenarios
- Add performance benchmarks
- Add RLS policy testing
- Add role-based access testing

