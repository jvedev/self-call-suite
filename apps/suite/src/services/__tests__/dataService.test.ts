/**
 * Integration tests for DataService
 * Tests actual Supabase operations without mocking
 */

import { clubService } from '../dataService';
import { supabase } from '../supabaseClient';
import { Club } from '../../types';

describe('DataService Integration Tests', () => {
  let testClubId: string;

  describe('create method with camelCase to snake_case conversion', () => {
    test('should properly convert camelCase properties to snake_case on insert', async () => {
      const testClub: Omit<Club, 'id'> = {
        name: 'Test Club for Mapping',
        contactEmail: `test-club-${Date.now()}@example.com`,
        site: 'https://example.com',
        logoUrl: 'https://example.com/logo.png',
      };

      // Use clubService to test dataService.create indirectly
      const result = await clubService.createClub(testClub);

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBeDefined();

      if (result.data?.id) {
        testClubId = result.data.id;

        // Fetch the raw data from database to verify snake_case column names
        const { data: rawClub, error } = await supabase
          .from('clubs')
          .select('*')
          .eq('id', testClubId)
          .single();

        expect(error).toBeNull();
        expect(rawClub).toBeDefined();

        // Verify that snake_case columns exist
        expect(rawClub).toHaveProperty('contact_email');
        expect(rawClub).toHaveProperty('logo_url');
        expect(rawClub?.contact_email).toBe(testClub.contactEmail);
        expect(rawClub?.logo_url).toBe(testClub.logoUrl);

        // Verify camelCase properties don't exist in database
        expect(rawClub).not.toHaveProperty('contactEmail');
        expect(rawClub).not.toHaveProperty('logoUrl');
      }
    });

    test('should return data in camelCase format after insert', async () => {
      const testClub: Omit<Club, 'id'> = {
        name: `Test Club ${Date.now()}`,
        contactEmail: `contact-${Date.now()}@example.com`,
        site: 'https://example.com',
        logoUrl: 'https://example.com/logo.png',
      };

      const result = await clubService.createClub(testClub);

      expect(result.data).toBeDefined();
      expect(result.data?.logoUrl).toBe(testClub.logoUrl);
      expect(result.data?.contactEmail).toBe(testClub.contactEmail);

      // Cleanup
      if (result.data?.id) {
        await supabase.from('clubs').delete().eq('id', result.data.id);
      }
    });
  });

  describe('update method with camelCase to snake_case conversion', () => {
    test('should properly convert camelCase properties to snake_case on update', async () => {
      // Create a test club first
      const testClub: Omit<Club, 'id'> = {
        name: `Test Club for Update ${Date.now()}`,
        contactEmail: `update-test-${Date.now()}@example.com`,
        site: 'https://original.com',
        logoUrl: 'https://example.com/original.png',
      };

      const createResult = await clubService.createClub(testClub);
      expect(createResult.data?.id).toBeDefined();

      if (createResult.data?.id) {
        const clubId = createResult.data.id;

        // Update with camelCase properties
        const updates = {
          site: 'https://updated.com',
          logoUrl: 'https://example.com/updated.png',
        };

        const updateResult = await clubService.updateClub(clubId, updates);
        expect(updateResult.error).toBeUndefined();

        // Verify the update in the database
        const { data: updatedClub } = await supabase
          .from('clubs')
          .select('*')
          .eq('id', clubId)
          .single();

        expect(updatedClub?.site).toBe(updates.site);
        expect(updatedClub?.logo_url).toBe(updates.logoUrl);

        // Cleanup
        await supabase.from('clubs').delete().eq('id', clubId);
      }
    });
  });

  describe('getAll method with camelCase to snake_case conversion', () => {
    test('should return data in camelCase format after fetch', async () => {
      const result = await clubService.getAllClubs();

      expect(result.error).toBeUndefined();
      expect(Array.isArray(result.data)).toBe(true);

      // If there are any clubs, verify the format
      if (result.data && result.data.length > 0) {
        const club = result.data[0];

        // Should have camelCase properties
        if (club.logoUrl !== undefined) {
          expect(club).toHaveProperty('logoUrl');
        }
        if (club.contactEmail !== undefined) {
          expect(club).toHaveProperty('contactEmail');
        }

        // Should NOT have snake_case properties
        expect(club).not.toHaveProperty('logo_url');
        expect(club).not.toHaveProperty('contact_email');
      }
    });
  });

  describe('Column name consistency', () => {
    test('should verify mapping functions properly handle all field types', async () => {
      const testClub: Omit<Club, 'id'> = {
        name: `Consistency Test ${Date.now()}`,
        contactEmail: `consistency-${Date.now()}@example.com`,
        site: 'https://test.com',
        logoUrl: 'https://test.com/logo.png',
      };

      const result = await clubService.createClub(testClub);

      if (result.data?.id) {
        // Fetch raw data
        const { data: raw } = await supabase
          .from('clubs')
          .select('*')
          .eq('id', result.data.id)
          .single();

        // Expected snake_case fields
        const snakeCaseFields = ['contact_email', 'logo_url', 'name', 'site'];
        snakeCaseFields.forEach(field => {
          expect(raw).toHaveProperty(field);
        });

        // Should not have camelCase versions
        const camelCaseFields = ['contactEmail', 'logoUrl'];
        camelCaseFields.forEach(field => {
          expect(raw).not.toHaveProperty(field);
        });

        // Cleanup
        await supabase.from('clubs').delete().eq('id', result.data.id);
      }
    });
  });

  // Cleanup
  afterAll(async () => {
    if (testClubId) {
      try {
        await supabase.from('clubs').delete().eq('id', testClubId);
      } catch (error) {
        console.warn('Cleanup failed for test club:', error);
      }
    }
  });
});

