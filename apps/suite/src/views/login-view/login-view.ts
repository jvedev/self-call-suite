import html from './login-view.html?raw'
import css from './login-view.css?raw'
import { BaseComponent } from '@shared/web-components/src/base-component/base-component'
import { authService } from '../../services/authService'
import { appActions } from '../../store/appState'


export class LoginView extends BaseComponent {
  constructor() {
    super()
    this.render(css, html)
  }

  connectedCallback() {
    this.attachEventListeners()
  }

  private attachEventListeners() {
    this.loginForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      await this.handleLogin(this.emailInput.value, this.passwordInput.value)
    }, { signal: this.signal })

    this.submitBtn.addEventListener('click', async () => {
      this.submitBtn.disabled = true
      this.submitBtn.textContent = 'Signing in...'
      await this.handleLogin(this.emailInput.value, this.passwordInput.value)
      this.submitBtn.disabled = false
      this.submitBtn.textContent = 'Sign In'
    }, { signal: this.signal })

    this.switchBtn.addEventListener('click', () => {
      window.location.pathname = '/register'
    }, { signal: this.signal })
  }

  private async handleLogin(email: string, password: string) {
    if (!email || !password) {
      this.showError(this.errorDiv, 'Please fill in all fields')
      return
    }

    appActions.setAuthLoading(true)
    const { user, error } = await authService.login(email, password)

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
    window.location.pathname = '/home'
  }

  private showError(element: HTMLDivElement, message: string) {
    element.textContent = message
    element.style.display = 'block'
  }

  private get loginForm(): HTMLFormElement {
    return this.queryRoot<HTMLFormElement>('.login-form')
  }

  private get emailInput(): HTMLInputElement {
    return this.queryRoot<HTMLInputElement>('#email')
  }

  private get passwordInput(): HTMLInputElement {
    return this.queryRoot<HTMLInputElement>('#password')
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

customElements.define('login-view', LoginView)

