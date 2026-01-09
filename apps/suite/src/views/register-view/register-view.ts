import html from './register-view.html?raw'
import css from './register-view.css?raw'
import { BaseComponent } from '@shared/web-components/src/base-component/base-component'
import { authService } from '../../services/authService'
import { appActions } from '../../store/appState'
import { suiteRouter } from '../../router/suiteRouter'

export class RegisterView extends BaseComponent {
  constructor() {
    super()
    this.render(css, html)
  }

  connectedCallback() {
    this.attachEventListeners()
  }

  private attachEventListeners() {
    this.registerForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      await this.handleRegister(
        this.nameInput.value,
        this.aliasInput.value,
        this.emailInput.value,
        this.passwordInput.value,
        this.confirmPasswordInput.value
      )
    }, { signal: this.signal })

    this.submitBtn.addEventListener('click', async () => {
      this.submitBtn.disabled = true
      this.submitBtn.textContent = 'Creating account...'
      await this.handleRegister(
        this.nameInput.value,
        this.aliasInput.value,
        this.emailInput.value,
        this.passwordInput.value,
        this.confirmPasswordInput.value
      )
      this.submitBtn.disabled = false
      this.submitBtn.textContent = 'Sign Up'
    }, { signal: this.signal })

    this.switchBtn.addEventListener('click', () => {
      suiteRouter.navigate('/login')
    }, { signal: this.signal })
  }

  private async handleRegister(
    name: string,
    alias: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    // Validation
    if (!name || !alias || !email || !password || !confirmPassword) {
      this.showError(this.errorDiv, 'Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      this.showError(this.errorDiv, 'Passwords do not match')
      return
    }

    if (password.length < 6) {
      this.showError(this.errorDiv, 'Password must be at least 6 characters')
      return
    }

    appActions.setAuthLoading(true)

    const { user, error } = await authService.signup(email, password, {
      name,
      alias,
      email,
      profileImageUrl: '',
      refereeRating: 0,
      juryRating: 0,
      firstAidCertified: false,
      useAlias: false,
      publicProfile: true,
    })

    if (error) {
      this.showError(this.errorDiv, error)
      appActions.setAuthError(error)
      appActions.setAuthLoading(false)
      return
    }

    appActions.setAuthUser(user)
    appActions.setAuthError(null)
    appActions.setAuthLoading(false)

    // Navigate to home
    suiteRouter.navigate('/home', user?.roles || [])
  }

  private showError(element: HTMLDivElement, message: string) {
    element.textContent = message
    element.style.display = 'block'
  }

  private get registerForm(): HTMLFormElement {
    return this.queryRoot<HTMLFormElement>('.register-form')
  }

  private get nameInput(): HTMLInputElement {
    return this.queryRoot<HTMLInputElement>('#name')
  }

  private get aliasInput(): HTMLInputElement {
    return this.queryRoot<HTMLInputElement>('#alias')
  }

  private get emailInput(): HTMLInputElement {
    return this.queryRoot<HTMLInputElement>('#email')
  }

  private get passwordInput(): HTMLInputElement {
    return this.queryRoot<HTMLInputElement>('#password')
  }

  private get confirmPasswordInput(): HTMLInputElement {
    return this.queryRoot<HTMLInputElement>('#confirmPassword')
  }

  private get submitBtn(): HTMLButtonElement {
    return this.queryRoot<HTMLButtonElement>('.submit-btn')
  }

  private get errorDiv(): HTMLDivElement {
    return this.queryRoot<HTMLDivElement>('.error-message')
  }

  private get switchBtn(): HTMLButtonElement {
    return this.queryRoot<HTMLButtonElement>('.switch-btn')
  }
}

customElements.define('register-view', RegisterView)

