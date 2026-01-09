import html from './super-admin-dashboard.html?raw'
import css from './super-admin-dashboard.css?raw'
import { BaseComponent } from '@shared/web-components/src/base-component/base-component'
import { clubService } from '../../services/dataService'
import { Club } from '../../types'

export class SuperAdminDashboard extends BaseComponent {
  private clubs: Club[] = []
  private currentView: 'overview' | 'clubs' | 'club-form' = 'overview'
  private editingClub: Club | null = null

  constructor() {
    super()
    this.render(css, html)
  }

  async connectedCallback() {
    await this.loadClubs()
    this.showOverview()
    this.attachEventListeners()
  }

  private async loadClubs() {
    const { data, error } = await clubService.getAllClubs()
    if (!error) {
      this.clubs = data
    }
  }

  private attachEventListeners() {
    const navButtons = this.queryRoot<HTMLDivElement>('.nav-buttons')

    navButtons.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement
        const view = target.dataset.view as typeof this.currentView
        if (view) {
          this.switchView(view)
        }
      }, { signal: this.signal })
    })
  }

  private switchView(view: typeof this.currentView) {
    this.currentView = view
    const content = this.queryRoot<HTMLDivElement>('.content-area')
    content.innerHTML = ''

    switch (view) {
      case 'overview':
        this.showOverview()
        break
      case 'clubs':
        this.showClubsList()
        break
      case 'club-form':
        this.showClubForm()
        break
    }
  }

  private showOverview() {
    const content = this.queryRoot<HTMLDivElement>('.content-area')
    content.innerHTML = `
      <div class="overview">
        <h2>Super Admin Dashboard</h2>
        <div class="stats">
          <div class="stat-card">
            <div class="stat-number">${this.clubs.length}</div>
            <div class="stat-label">Total Clubs</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">5</div>
            <div class="stat-label">Admins</div>
          </div>
        </div>
        <p>Use the navigation above to manage clubs and administrators.</p>
      </div>
    `
  }

  private showClubsList() {
    const content = this.queryRoot<HTMLDivElement>('.content-area')

    const html = `
      <div class="clubs-list">
        <div class="list-header">
          <h2>Manage Clubs</h2>
          <button class="new-club-btn primary">+ New Club</button>
        </div>

        <div class="clubs-table">
          ${this.clubs.length === 0 ? '<p>No clubs found. Create one to get started.</p>' : ''}
          ${this.clubs.map(club => `
            <div class="club-item card">
              <div class="club-info">
                <h3>${club.name}</h3>
                <p>${club.contactEmail}</p>
              </div>
              <div class="club-actions">
                <button class="edit-btn" data-id="${club.id}">Edit</button>
                <button class="delete-btn" data-id="${club.id}">Delete</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `

    content.innerHTML = html

    const newClubBtn = content.querySelector('.new-club-btn') as HTMLButtonElement
    newClubBtn?.addEventListener('click', () => {
      this.editingClub = null
      this.switchView('club-form')
    }, { signal: this.signal })

    content.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLButtonElement).dataset.id
        const club = this.clubs.find(c => c.id === id)
        if (club) {
          this.editingClub = club
          this.switchView('club-form')
        }
      }, { signal: this.signal })
    })

    content.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = (e.target as HTMLButtonElement).dataset.id as string
        if (confirm('Are you sure you want to delete this club?')) {
          await clubService.deleteClub(id)
          await this.loadClubs()
          this.showClubsList()
        }
      }, { signal: this.signal })
    })
  }

  private showClubForm() {
    const content = this.queryRoot<HTMLDivElement>('.content-area')
    const isEdit = !!this.editingClub

    const html = `
      <div class="club-form">
        <h2>${isEdit ? 'Edit Club' : 'Create New Club'}</h2>
        
        <form id="clubForm">
          <div class="form-group">
            <label for="name">Club Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value="${isEdit ? this.editingClub!.name : ''}"
              required
            />
          </div>

          <div class="form-group">
            <label for="contactEmail">Contact Email *</label>
            <input 
              type="email" 
              id="contactEmail" 
              name="contactEmail" 
              value="${isEdit ? this.editingClub!.contactEmail : ''}"
              required
            />
          </div>

          <div class="form-group">
            <label for="site">Website</label>
            <input 
              type="url" 
              id="site" 
              name="site" 
              value="${isEdit ? this.editingClub?.site || '' : ''}"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="primary">Save Club</button>
            <button type="button" class="secondary cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    `

    content.innerHTML = html

    const form = content.querySelector('#clubForm') as HTMLFormElement
    const cancelBtn = content.querySelector('.cancel-btn') as HTMLButtonElement

    form?.addEventListener('submit', async (e) => {
      e.preventDefault()
      await this.saveClub(form)
    }, { signal: this.signal })

    cancelBtn?.addEventListener('click', () => {
      this.editingClub = null
      this.switchView('clubs')
    }, { signal: this.signal })
  }

  private async saveClub(form: HTMLFormElement) {
    const formData = new FormData(form)
    const clubData = {
      name: formData.get('name') as string,
      contactEmail: formData.get('contactEmail') as string,
      site: formData.get('site') as string || undefined,
    }

    if (this.editingClub) {
      await clubService.updateClub(this.editingClub.id, clubData)
    } else {
      await clubService.createClub({
        ...clubData,
        contactPersonId: undefined,
        logoUrl: undefined,
      })
    }

    await this.loadClubs()
    this.editingClub = null
    this.switchView('clubs')
  }

}

customElements.define('super-admin-dashboard', SuperAdminDashboard)

