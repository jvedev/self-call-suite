# overview
suite off apps for self call hema system
this is a system to use in h.e.m.a. (historical european martial arts) to keep score during a match.
the system will be used by table crew to keep score during a match.
the system will be used by competitors to see their score during a match.
the system will be used by spectators to see the score during a match.
the system will be used by organizers to manage competitions and matches.

# styling
this will be a modern design with a focus on usability and accessibility.
radio buttons should in fact look like buttons.
the design should be clean and simple with a focus on the content.
the main colors used are red and blue

# overall apps
the apps are optimised for mobile use but should work on desktop as well.
the apps should be installable as a pwa and work offline with a service worker.
the apps wil be used in portrait mode on mobile devices.
the apps should have a dark and light mode that can be toggled by the user.


# techniologies used:
- vanilla typescript
- web components
- valtio state management
- modern nested css
- navigation through a router service
- service worker for offline use
- pwa installable
- light and dark mode with theme manager service
- responsive design for mobile and desktop
- accessible design with high contrast and readable fonts
- i18n for multiple languages
- jwt for authentication
- api service for communication with the backend
- sql lite or postgers backend
- prisma orm for database management
- bcrypt for password hashing
- jsonwebtoken for jwt management
- express for the backend server
- cors for cross origin resource sharing
- dotenv for environment variable management

## Monorepo Structure

This repository is organized as a monorepo. The main structure is:

```
/
├── README.md
├── docs
├── shared
│   ├── views
│   ├── web-components
│   ├── styles
│   └── modules
│       ├── logging
│       ├── state
│       ├── settings
│       └── auth
└── apps
    ├── self call
    ├── scoreboard
    ├── scoreKeeper
    ├── admin
    └── server
```

See [`docs/repo_structure.md`](documentation/repo_structure.md) for more details.

## Getting Started

1. Install dependencies in each app and shared package.
2. Use your preferred package manager to run or build each app.
3. See individual app folders for specific instructions.

## Documentation

The following files in the `docs` directory provide detailed definitions:

- [`match logic and settings`](documentation/logic_settings.md)
- [`repo structure`](documentation/repo_structure.md)
- [`views`](documentation/views.md)
