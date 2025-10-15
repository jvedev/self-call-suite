export * from './home-view/home-view';
export * from './new-match-view/new-match-view';
export * from './match-view/match-view';
export * from './match-settings-view/match-settings-view';

export type View = HTMLDivElement & { render: () => string; };


// Default export containing all views to prevent tree-shaking

