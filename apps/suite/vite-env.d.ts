/// <reference types="vite/client" />
/// <reference path="../../vite-env.d.ts" />

declare module '*.html?raw' {
  const content: string;
  export default content;
}

declare module '*.css?raw' {
  const content: string;
  export default content;
}

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

