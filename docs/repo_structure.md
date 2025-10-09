in this repo the structure is as follows:

```
/
├── README.md
├── docs
│   ├── repo structure.md
│   └── usage.md
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


# apps

# Self call
Self call is a standalone app for keeping score no login is required so auth views are not included
it will have the following views:

Home (unique to this app)
├──new match
│   └── match
│       ├── hit
│       ├── warning
│       ├── timeout
│       ├── adjust time
│       ├── alter match event
│       └── end match
├──match settings
├──scoreboard (pops up in a new window only available when on a multi monitor setup)
└──past matches
    └── match details




