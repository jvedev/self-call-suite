import html from './profile-view.html?raw'
import css from './profile-view.css?raw'
import { BaseComponent } from '@shared/web-components/src/base-component/base-component'
import { appState } from '../../store/appState'
import { snapshot } from 'valtio'
import { authorizationService } from '../../services/authorizationService'

export class ProfileView extends BaseComponent {
  constructor() {
    super()
    this.render(css, html)
  }

  connectedCallback() {
    this.renderProfile()
    this.attachEventListeners()
  }

  private renderProfile() {
    const state = snapshot(appState)
    const user = state.auth.user

    if (!user) {
      this.placeHolder.innerHTML = '<p>No user logged in</p>'
      return
    }

    // const rolesList = user.roles
    //   .map(role => authorizationService.getRoleDisplayName(role))
    //   .join(', ')

    const content = this.queryRoot<HTMLDivElement>('.profile-content')
    content.innerHTML = `
      <div class="profile-header">
        <h2>${user.name}</h2>
        <p class="alias">@${user.alias}</p>
      </div>

      <div class="profile-info">
        <div class="info-section">
          <h3>Basic Information</h3>
          <div class="info-row">
            <label>Name</label>
            <span>${user.name}</span>
          </div>
          <div class="info-row">
            <label>Alias</label>
            <span>${user.alias}</span>
          </div>
          <div class="info-row">
            <label>Email</label>
            <span>${user.email}</span>
          </div>
        </div>

        <div class="info-section">
          <h3>Roles</h3>
          <div class="roles-list">
            ${user.roles.map(role => `
              <span class="role-badge" style="background-color: ${authorizationService.getRoleColor(role)}">
                ${authorizationService.getRoleDisplayName(role)}
              </span>
            `).join('')}
          </div>
        </div>

        <div class="info-section">
          <h3>Certifications</h3>
          <div class="info-row">
            <label>First Aid Certified</label>
            <span>${user.firstAidCertified ? '✓ Yes' : '✗ No'}</span>
          </div>
          <div class="info-row">
            <label>Referee Rating</label>
            <span>${user.refereeRating}</span>
          </div>
          <div class="info-row">
            <label>Jury Rating</label>
            <span>${user.juryRating}</span>
          </div>
        </div>
      </div>

      <div class="profile-actions">
        <button class="edit-btn primary">Edit Profile</button>
        <a href="/home" class="back-link">← Back to Home</a>
      </div>
    `
  }

  private attachEventListeners() {
    const editBtn = this.queryRoot<HTMLButtonElement>('.edit-btn')
    editBtn?.addEventListener('click', () => {
      alert('Edit profile feature coming soon!')
    }, { signal: this.signal })
  }

}

customElements.define('profile-view', ProfileView)

