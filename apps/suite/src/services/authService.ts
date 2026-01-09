/**
 * Authentication Service
 * Handles signup, login, logout, and session management with Supabase
 */

import { supabase } from './supabaseClient'
import { UserProfile, UserRole } from '../types'

class AuthService {
  /**
   * Sign up a new user with email and password
   */
  async signup(
    email: string,
    password: string,
    profile: Omit<UserProfile, 'id' | 'roles' | 'clubs'>
  ): Promise<{ user: UserProfile; error?: string }> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        return { user: null as any, error: authError.message }
      }

      if (!authData.user) {
        return { user: null as any, error: 'User creation failed' }
      }

      // Create profile (without roles and clubs - these are managed separately)
      // Map camelCase properties to snake_case for database
      const profileData = {
        id: authData.user.id,
        ...this.mapProfileToDb(profile),
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([profileData])

      if (profileError) {
        return { user: null as any, error: profileError.message }
      }

      // Return profile with default roles and empty clubs (don't insert them)
      return { user: { id: authData.user.id, ...profile, roles: [UserRole.EVENT_PARTICIPANT], clubs: [] } as UserProfile }
    } catch (error) {
      return { user: null as any, error: String(error) }
    }
  }

  /**
   * Sign in with email and password
   */
  async login(email: string, password: string): Promise<{ user: UserProfile | null; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { user: null, error: error.message }
      }

      if (!data.user) {
        return { user: null, error: 'Login failed' }
      }

      // Fetch user profile
      const profile = await this.getUserProfile(data.user.id)
      return { user: profile }
    } catch (error) {
      return { user: null, error: String(error) }
    }
  }

  /**
   * Sign out the current user
   */
  async logout(): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        return { error: error.message }
      }
      return {}
    } catch (error) {
      return { error: String(error) }
    }
  }

  /**
   * Get current session
   */
  async getCurrentSession() {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data.session
    } catch (error) {
      console.error('Failed to get session:', error)
      return null
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Failed to fetch profile:', error)
        return null
      }

      return this.mapProfileFromDb(data)
    } catch (error) {
      console.error('Failed to get user profile:', error)
      return null
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<{ error?: string }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(this.mapProfileToDb(updates))
        .eq('id', userId)

      if (error) {
        return { error: error.message }
      }
      return {}
    } catch (error) {
      return { error: String(error) }
    }
  }

  /**
   * Watch auth state changes
   */
  onAuthStateChange(callback: (user: UserProfile | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await this.getUserProfile(session.user.id)
        callback(profile)
      } else {
        callback(null)
      }
    })
  }

  /**
   * Map database profile to UserProfile
   */
  private mapProfileFromDb(data: any): UserProfile {
    return {
      id: data.id,
      name: data.name,
      alias: data.alias,
      email: data.email,
      profileImageUrl: data.profile_image_url,
      refereeRating: data.referee_rating,
      juryRating: data.jury_rating,
      firstAidCertified: data.first_aid_certified,
      useAlias: data.use_alias,
      publicProfile: data.public_profile,
      roles: data.roles || [],
      clubs: data.clubs || [],
    }
  }

  /**
   * Map UserProfile to database format
   */
  private mapProfileToDb(profile: Partial<UserProfile>): any {
    return {
      name: profile.name,
      alias: profile.alias,
      email: profile.email,
      profile_image_url: profile.profileImageUrl,
      referee_rating: profile.refereeRating,
      jury_rating: profile.juryRating,
      first_aid_certified: profile.firstAidCertified,
      use_alias: profile.useAlias,
      public_profile: profile.publicProfile,
      // Note: roles and clubs are managed separately through join tables
    }
  }
}

export const authService = new AuthService()

