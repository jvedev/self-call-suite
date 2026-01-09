/**
 * Generic Data Service
 * Handles CRUD operations for all database tables
 */

import { supabase } from './supabaseClient'
import { Club, Event, Tournament, Participant, Pool, Fight, UserProfile } from '../types'

type Entity = Club | Event | Tournament | Participant | Pool | Fight | UserProfile

interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  ascending?: boolean
}

class DataService {
  /**
   * Create a new record
   */
  async create<T extends Entity>(
    table: string,
    data: Omit<T, 'id'>
  ): Promise<{ data: T | null; error?: string }> {
    try {
      const dbData = this.mapToDb(table, data)
      const { data: result, error } = await supabase
        .from(table)
        .insert([dbData])
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data: this.mapFromDb(table, result) as T }
    } catch (error) {
      return { data: null, error: String(error) }
    }
  }

  /**
   * Read a single record by ID
   */
  async getById<T extends Entity>(
    table: string,
    id: string
  ): Promise<{ data: T | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select()
        .eq('id', id)
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data: this.mapFromDb(table, data) as T }
    } catch (error) {
      return { data: null, error: String(error) }
    }
  }

  /**
   * Read multiple records
   */
  async getAll<T extends Entity>(
    table: string,
    options: QueryOptions = {}
  ): Promise<{ data: T[]; error?: string }> {
    try {
      let query = supabase.from(table).select()

      if (options.limit) {
        query = query.limit(options.limit)
      }

      if (options.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1)
      }

      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending ?? true })
      }

      const { data, error } = await query

      if (error) {
        return { data: [], error: error.message }
      }

      return { data: (data || []).map(item => this.mapFromDb(table, item) as T) }
    } catch (error) {
      return { data: [], error: String(error) }
    }
  }

  /**
   * Query records with filters
   */
  async query<T extends Entity>(
    table: string,
    filters: Record<string, any>,
    options: QueryOptions = {}
  ): Promise<{ data: T[]; error?: string }> {
    try {
      let query = supabase.from(table).select()

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })

      if (options.limit) {
        query = query.limit(options.limit)
      }

      if (options.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1)
      }

      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending ?? true })
      }

      const { data, error } = await query

      if (error) {
        return { data: [], error: error.message }
      }

      return { data: (data || []).map(item => this.mapFromDb(table, item) as T) }
    } catch (error) {
      return { data: [], error: String(error) }
    }
  }

  /**
   * Update a record
   */
  async update<T extends Entity>(
    table: string,
    id: string,
    updates: Partial<T>
  ): Promise<{ data: T | null; error?: string }> {
    try {
      const dbUpdates = this.mapToDb(table, updates)

      const { data, error } = await supabase
        .from(table)
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data: this.mapFromDb(table, data) as T }
    } catch (error) {
      return { data: null, error: String(error) }
    }
  }

  /**
   * Delete a record
   */
  async delete(
    table: string,
    id: string
  ): Promise<{ error?: string }> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: String(error) }
    }
  }

  /**
   * Map database format to application format (snake_case -> camelCase)
   */
  private mapFromDb(_table: string, data: any): Entity {
    if (!data) return data

    // Generic snake_case to camelCase conversion
    const mapped: any = {}
    Object.entries(data).forEach(([key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
      mapped[camelKey] = value
    })

    return mapped as Entity
  }

  /**
   * Map application format to database format (camelCase -> snake_case)
   */
  private mapToDb(_table: string, data: Partial<Entity>): any {
    const mapped: any = {}
    Object.entries(data).forEach(([key, value]) => {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      mapped[snakeKey] = value
    })

    return mapped
  }
}

export const dataService = new DataService()

/**
 * Specialized Club Service
 */
export class ClubService {
  async getAllClubs(): Promise<{ data: Club[]; error?: string }> {
    return dataService.getAll<Club>('clubs')
  }

  async getClubById(id: string): Promise<{ data: Club | null; error?: string }> {
    return dataService.getById<Club>('clubs', id)
  }

  async createClub(club: Omit<Club, 'id'>): Promise<{ data: Club | null; error?: string }> {
    return dataService.create<Club>('clubs', club)
  }

  async updateClub(id: string, updates: Partial<Club>): Promise<{ data: Club | null; error?: string }> {
    return dataService.update<Club>('clubs', id, updates)
  }

  async deleteClub(id: string): Promise<{ error?: string }> {
    return dataService.delete('clubs', id)
  }

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
      roles: [], // Will be fetched separately from user_roles table if needed
      clubs: [], // Will be fetched separately from profile_clubs table if needed
    }
  }
}

/**
 * Specialized Event Service
 */
export class EventService {
  async getAllEvents(): Promise<{ data: Event[]; error?: string }> {
    return dataService.getAll<Event>('events')
  }

  async getEventById(id: string): Promise<{ data: Event | null; error?: string }> {
    return dataService.getById<Event>('events', id)
  }

  async getEventsByClub(organizerId: string): Promise<{ data: Event[]; error?: string }> {
    return dataService.query<Event>('events', { organizer_id: organizerId })
  }

  async createEvent(event: Omit<Event, 'id'>): Promise<{ data: Event | null; error?: string }> {
    return dataService.create<Event>('events', event)
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<{ data: Event | null; error?: string }> {
    return dataService.update<Event>('events', id, updates)
  }

  async deleteEvent(id: string): Promise<{ error?: string }> {
    return dataService.delete('events', id)
  }
}

/**
 * Specialized Tournament Service
 */
export class TournamentService {
  async getTournamentsByEvent(eventId: string): Promise<{ data: Tournament[]; error?: string }> {
    return dataService.query<Tournament>('tournaments', { event_id: eventId })
  }

  async getTournamentById(id: string): Promise<{ data: Tournament | null; error?: string }> {
    return dataService.getById<Tournament>('tournaments', id)
  }

  async createTournament(tournament: Omit<Tournament, 'id'>): Promise<{ data: Tournament | null; error?: string }> {
    return dataService.create<Tournament>('tournaments', tournament)
  }

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<{ data: Tournament | null; error?: string }> {
    return dataService.update<Tournament>('tournaments', id, updates)
  }

  async deleteTournament(id: string): Promise<{ error?: string }> {
    return dataService.delete('tournaments', id)
  }
}

export const clubService = new ClubService()
export const eventService = new EventService()
export const tournamentService = new TournamentService()

