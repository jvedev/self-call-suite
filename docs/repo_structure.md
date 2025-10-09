in this repo the structure is as follows:

```
/
├── README.md
├── docs
│   ├── repo_structure.md
│   └── usage.md
├── shared
│   ├── views              # Shared view definitions and templates
│   ├── web-components     # Shared web components (vanilla TS)
│   ├── styles             # Shared CSS/CSS modules
│   └── modules            # Shared logic modules containging logging state settings types etc
└── apps
    ├── self call          # Standalone self-call app (no login)
    ├── scoreboard         # Scoreboard display app
    ├── scoreKeeper        # Table crew app for scorekeeping
    ├── admin              # Admin/organizer app
    └── server             # Backend (Express, Prisma, etc)
```

# apps

## Self call
Self call is a standalone app for keeping score; no login is required so auth views are not included.
It will have the following views:

Home (unique to this app)
├── new match
│   └── match
│       ├── hit
│       ├── warning
│       ├── timeout
│       ├── adjust time
│       ├── alter match event
│       └── end match
├── match settings
├── scoreboard (pops up in a new window only available when on a multi monitor setup)
└── past matches
    └── match details
