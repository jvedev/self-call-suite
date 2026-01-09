/**
 * Integration tests for AuthService
 * Tests actual Supabase operations without mocking
 */

import { authService } from '../authService';
import { supabase } from '../supabaseClient';
import { UserRole } from '../../types';

// Test data
const testUserEmail = `test-${Date.now()}@example.com`;
const testPassword = 'TestPassword123!@#';

const testProfile = {
  name: 'John Doe',
  alias: 'johndoe',
  email: testUserEmail,
  profileImageUrl: 'https://example.com/avatar.jpg',
  refereeRating: 5,
  juryRating: 3,
  firstAidCertified: true,
  useAlias: true,
  publicProfile: true,
};

describe('AuthService Integration Tests', () => {
  // Cleanup: Delete test user after all tests
  afterAll(async () => {
    try {
      // Get the user ID by email
      const { data: users, error: getUserError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', testUserEmail)
        .single();

      if (users?.id) {
        // Delete from profiles (will cascade if properly set up)
        // Note: Auth user deletion requires service role key, so we just clean up the profile
        await supabase
          .from('profiles')
          .delete()
          .eq('id', users.id);
      }
    } catch (error) {
      console.warn('Cleanup warning (this is okay if user was not created):', error);
    }
  });

  describe('signup', () => {
    test('should create a new user with correct profile data in snake_case columns', async () => {
      const result = await authService.signup(testUserEmail, testPassword, testProfile);

      // Check that signup succeeded
      expect(result.user).toBeDefined();
      expect(result.error).toBeUndefined();

      // Check basic user properties
      expect(result.user.id).toBeDefined();
      expect(result.user.email).toBe(testUserEmail);
      expect(result.user.name).toBe(testProfile.name);
      expect(result.user.alias).toBe(testProfile.alias);

      // Check that the profile was created in the database with correct field names
      const { data: profileFromDb, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', testUserEmail)
        .single();

      expect(fetchError).toBeNull();
      expect(profileFromDb).toBeDefined();

      // Verify that snake_case columns were properly created
      expect(profileFromDb.use_alias).toBe(testProfile.useAlias);
      expect(profileFromDb.profile_image_url).toBe(testProfile.profileImageUrl);
      expect(profileFromDb.first_aid_certified).toBe(testProfile.firstAidCertified);
      expect(profileFromDb.referee_rating).toBe(testProfile.refereeRating);
      expect(profileFromDb.jury_rating).toBe(testProfile.juryRating);
      expect(profileFromDb.public_profile).toBe(testProfile.publicProfile);
    });

    test('should not insert clubs and roles as direct columns', async () => {
      const result = await authService.signup(testUserEmail, testPassword, testProfile);

      expect(result.user).toBeDefined();

      // Fetch the profile directly to ensure clubs/roles aren't in the table
      const { data: profileFromDb } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', testUserEmail)
        .single();

      // These should not be properties of the profile row
      // (they exist as TypeScript properties on the returned object, but not in DB)
      expect(profileFromDb).not.toHaveProperty('clubs');
      expect(profileFromDb).not.toHaveProperty('roles');
    });

    test('should return default roles in response even though not stored', async () => {
      const result = await authService.signup(testUserEmail, testPassword, testProfile);

      expect(result.user).toBeDefined();
      // The returned user should have default roles for app use
      expect(result.user.roles).toEqual([UserRole.EVENT_PARTICIPANT]);
      expect(result.user.clubs).toEqual([]);
    });

    test('should handle missing optional fields', async () => {
      const testEmail = `test-minimal-${Date.now()}@example.com`;
      const minimalProfile = {
        name: 'Jane Doe',
        alias: 'janedoe',
        email: testEmail,
        refereeRating: 0,
        juryRating: 0,
        firstAidCertified: false,
        useAlias: false,
        publicProfile: false,
      };

      const result = await authService.signup(testEmail, testPassword, minimalProfile);

      expect(result.user).toBeDefined();
      expect(result.error).toBeUndefined();
      expect(result.user.email).toBe(testEmail);

      // Cleanup
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', testEmail)
          .single();

        if (profile?.id) {
          await supabase.from('profiles').delete().eq('id', profile.id);
        }
      } catch (error) {
        console.warn('Cleanup failed for minimal profile');
      }
    });
  });

  describe('getCurrentSession', () => {
    test('should return null if no session exists', async () => {
      // Sign out first to ensure no session
      await authService.logout();

      const session = await authService.getCurrentSession();
      expect(session).toBeNull();
    });
  });

  describe('mapProfileFromDb', () => {
    test('should correctly map snake_case database fields to camelCase properties', async () => {
      // This tests the private method indirectly through getUserProfile
      const result = await authService.signup(testUserEmail, testPassword, testProfile);

      if (result.user?.id) {
        const profile = await authService.getUserProfile(result.user.id);

        // Verify camelCase conversion
        expect(profile?.profileImageUrl).toBe(testProfile.profileImageUrl);
        expect(profile?.firstAidCertified).toBe(testProfile.firstAidCertified);
        expect(profile?.useAlias).toBe(testProfile.useAlias);
        expect(profile?.publicProfile).toBe(testProfile.publicProfile);
        expect(profile?.refereeRating).toBe(testProfile.refereeRating);
        expect(profile?.juryRating).toBe(testProfile.juryRating);
      }
    });
  });

  describe('updateProfile', () => {
    test('should update profile fields with proper snake_case conversion', async () => {
      const signupResult = await authService.signup(testUserEmail, testPassword, testProfile);

      if (!signupResult.user?.id) {
        throw new Error('Failed to create test user');
      }

      const userId = signupResult.user.id;

      // Update profile
      const updates = {
        refereeRating: 8,
        useAlias: false,
        publicProfile: false,
      };

      const updateResult = await authService.updateProfile(userId, updates);
      expect(updateResult.error).toBeUndefined();

      // Fetch from database to verify snake_case columns were updated
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      expect(updatedProfile?.referee_rating).toBe(8);
      expect(updatedProfile?.use_alias).toBe(false);
      expect(updatedProfile?.public_profile).toBe(false);
    });
  });

  describe('Column name consistency', () => {
    test('should verify all profile columns use snake_case in database', async () => {
      const result = await authService.signup(testUserEmail, testPassword, testProfile);

      if (result.user?.id) {
        // Get raw column names from database
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', result.user.id)
          .single();

        expect(error).toBeNull();
        expect(data).toBeDefined();

        // List all expected snake_case columns
        const expectedColumns = [
          'id',
          'name',
          'alias',
          'email',
          'profile_image_url',
          'referee_rating',
          'jury_rating',
          'first_aid_certified',
          'use_alias',
          'public_profile',
        ];

        expectedColumns.forEach(column => {
          expect(data).toHaveProperty(column);
        });

        // Ensure no camelCase columns exist
        const camelCaseColumns = [
          'profileImageUrl',
          'refereeRating',
          'juryRating',
          'firstAidCertified',
          'useAlias',
          'publicProfile',
        ];

        camelCaseColumns.forEach(column => {
          expect(data).not.toHaveProperty(column);
        });
      }
    });
  });
});

