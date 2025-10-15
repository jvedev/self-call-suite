/// <reference types="vite/client" />
// IMPORTANT: Add "vite-env.d.ts" to your tsconfig.json "include" array!
// Example:
// "include": [
//   "vite-env.d.ts",
//   "src",
//   // ...other paths...
// ]

declare module '*.html?raw' {
  const content: string;
  export default content;
}

declare module '*.css?raw' {
  const content: string;
  export default content;
}

// For some editors/linters, also declare the plain extensions:
declare module '*.html' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*?raw' {
  const content: string;
  export default content;
}
