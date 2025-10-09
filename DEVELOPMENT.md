# Development Guide

## Getting Started

### Prerequisites

- Node.js 18+ (for ES modules and modern features)
- npm 7+ (for workspace support)

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd self-call-suite

# Install all dependencies
npm install

# Build shared modules (required before running apps)
npm run build:shared
```

### Running Applications

#### Self-Call App (Main Application)
```bash
cd apps/self-call
npm run dev
# Open http://localhost:3000
```

#### Backend Server
```bash
cd apps/server

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npx prisma generate

# Start development server  
npm run dev
# Server runs on http://localhost:3001
```

#### Other Apps
```bash
# Scoreboard display
cd apps/scoreboard && npm run dev

# Admin interface  
cd apps/admin && npm run dev

# Alternative scorer
cd apps/scoreKeeper && npm run dev
```

## Monorepo Workflow

### Building

The build order matters due to dependencies:

1. **Shared Modules**: Core business logic must be built first
2. **Shared Views**: Base classes for UI components
3. **Shared Web Components**: Custom elements using modules
4. **Applications**: Individual apps consuming shared packages

```bash
# Build everything in correct order
npm run build:shared  # Builds all shared packages
npm run build:apps    # Builds all applications

# Or build individually
cd shared/modules && npm run build
cd shared/views && npm run build
cd shared/web-components && npm run build
```

### Adding Dependencies

```bash
# Add to specific package
npm install lodash --workspace=@shared/modules

# Add dev dependency
npm install @types/lodash --save-dev --workspace=@shared/modules

# Add to root (affects all packages)
npm install prettier --save-dev
```

### TypeScript Project References

The monorepo uses TypeScript project references for:
- Incremental compilation
- Cross-package type checking
- Better IDE support

When adding new packages, update:
1. Root `tsconfig.json` references array
2. Dependent packages' `tsconfig.json` references
3. Package dependencies in `package.json`

## Architecture Guidelines

### Shared Packages

**@shared/modules**: Pure business logic
- State management with Valtio
- Settings and configuration
- Authentication logic
- Logging utilities
- No UI dependencies

**@shared/styles**: CSS design system
- CSS custom properties for theming
- Component styles with BEM methodology
- Responsive design utilities
- Accessibility features

**@shared/views**: UI framework
- Base view classes
- Router for navigation
- Common UI utilities
- Abstract DOM manipulation

**@shared/web-components**: Reusable elements
- Custom HTML elements
- State-reactive components
- Encapsulated styling
- Framework-agnostic

### Application Structure

Each application follows the same pattern:

```
apps/[app-name]/
├── package.json          # App-specific dependencies
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Build configuration (frontend)
├── index.html            # Entry point (frontend)
├── src/
│   ├── main.ts          # Application entry point
│   ├── views/           # App-specific views
│   └── components/      # App-specific components
└── public/              # Static assets
```

## State Management

### Valtio Patterns

```typescript
// Create reactive state
const store = proxy({
  count: 0,
  user: null
});

// Subscribe to changes
subscribe(store, () => {
  console.log('State changed:', store);
});

// Mutate directly (reactive)
store.count++;
store.user = { name: 'John' };
```

### Match State Flow

1. **Create Match**: Initialize state with fighters
2. **Start Match**: Begin timer and event logging
3. **Score Events**: Add hits, warnings, timeouts
4. **End Match**: Finalize and add to history

## UI Development

### View Pattern

```typescript
export class MyView extends BaseView {
  render() {
    this.clear(); // Clear container
    
    // Create elements
    const header = this.createElement('h1', 'my-title', 'Title');
    const button = this.createButton('Click Me', 'btn btn--primary', () => {
      // Handle click
    });
    
    // Add to container
    this.container.appendChild(header);
    this.container.appendChild(button);
  }
  
  destroy() {
    this.clear();
    // Cleanup event listeners, intervals, etc.
  }
}
```

### Styling Guidelines

- Use CSS custom properties for theming
- Follow BEM methodology for class names
- Mobile-first responsive design
- 44px minimum touch targets
- High contrast support

### Web Components

```typescript
export class MyComponent extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  
  disconnectedCallback() {
    // Cleanup
  }
  
  private render() {
    this.innerHTML = `
      <div class="my-component">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('my-component', MyComponent);
```

## Testing Strategy

### Unit Tests
- Test business logic in shared modules
- Mock external dependencies
- Focus on state management and calculations

### Integration Tests  
- Test view rendering and interactions
- Test API endpoints with test database
- Mock authentication and external services

### E2E Tests
- Test complete user workflows
- Test across different devices and browsers
- Test offline capabilities

## Performance Guidelines

### Bundle Size
- Use dynamic imports for large dependencies
- Split vendor bundles from application code
- Tree-shake unused exports

### Runtime Performance
- Minimize DOM manipulation
- Use efficient state updates
- Implement virtual scrolling for large lists
- Cache expensive calculations

### Network
- Implement proper caching strategies
- Use service workers for offline support
- Minimize API requests with batching

## Deployment

### Frontend Apps
Built with Vite, outputs to `dist/`:
- Static files ready for CDN
- Service worker for PWA features
- Source maps for debugging

### Backend Server
- Transpiled TypeScript to JavaScript
- Environment-based configuration
- Database migrations with Prisma
- Health checks and monitoring

### Database
- Prisma migrations for schema changes
- Backup strategies for production
- Connection pooling for performance

## Debugging

### Development Tools
- Browser DevTools for frontend debugging
- VS Code debugger for backend
- Network tab for API monitoring
- Application tab for PWA features

### Logging
- Structured logging with context
- Different log levels (DEBUG, INFO, WARN, ERROR)
- Client-side error tracking
- Server-side error handling

### Common Issues
- **Build Errors**: Check TypeScript project references
- **Import Errors**: Verify package exports and dependencies  
- **Style Issues**: Check CSS import paths and custom properties
- **State Issues**: Use Valtio devtools for debugging

## Contributing

1. Create feature branch from `main`
2. Make changes following architecture guidelines  
3. Add tests for new functionality
4. Update documentation as needed
5. Create pull request with clear description

### Code Style
- Prettier for formatting (configured in `.prettierrc`)
- TypeScript strict mode enabled
- ESLint rules for consistency
- Semantic commit messages