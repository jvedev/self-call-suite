import { BaseView } from '@shared/views';

export class HomeView extends BaseView {
  render() {
    this.clear();
    
    const header = this.createElement('header', 'home-header');
    const title = this.createElement('h1', 'home-title', 'HEMA Self Call');
    const subtitle = this.createElement('p', 'home-subtitle', 'Keep score during your HEMA matches');
    
    header.appendChild(title);
    header.appendChild(subtitle);

    const nav = this.createElement('nav', 'home-nav');
    
    // New Match button
    const newMatchBtn = this.createButton('New Match', 'btn btn--primary btn--lg', () => {
      window.history.pushState(null, '', '/new-match');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    
    // Match Settings button
    const settingsBtn = this.createButton('Match Settings', 'btn btn--lg', () => {
      window.history.pushState(null, '', '/match-settings');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    
    // Past Matches button
    const historyBtn = this.createButton('Past Matches', 'btn btn--lg', () => {
      window.history.pushState(null, '', '/past-matches');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    // Theme toggle button
    const themeBtn = this.createButton('Toggle Theme', 'btn btn--sm', () => {
      this.toggleTheme();
    });

    nav.appendChild(newMatchBtn);
    nav.appendChild(settingsBtn);
    nav.appendChild(historyBtn);
    nav.appendChild(themeBtn);

    this.container.appendChild(header);
    this.container.appendChild(nav);

    // Add custom styles for home view
    const styles = `
      <style>
        .home-header {
          text-align: center;
          padding: 2rem 1rem;
          margin-bottom: 2rem;
        }
        
        .home-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--color-primary-blue);
          margin: 0 0 0.5rem 0;
        }
        
        .home-subtitle {
          font-size: 1.125rem;
          color: var(--theme-text-secondary);
          margin: 0;
        }
        
        .home-nav {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 400px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        @media (max-width: 480px) {
          .home-title {
            font-size: 2rem;
          }
          
          .home-nav {
            padding: 0 1.5rem;
          }
        }
      </style>
    `;
    
    // Add styles to document head
    const styleElement = document.createElement('style');
    styleElement.textContent = styles.replace(/<\/?style>/g, '');
    document.head.appendChild(styleElement);

    this.isRendered = true;
  }

  destroy() {
    // Remove custom styles
    const styles = document.querySelectorAll('style');
    styles.forEach(style => {
      if (style.textContent?.includes('home-header')) {
        style.remove();
      }
    });
    
    this.clear();
    this.isRendered = false;
  }

  private toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('hema-theme', newTheme);
  }
}