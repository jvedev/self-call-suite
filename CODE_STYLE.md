# Code Style Guide

## CSS

- This project uses **native CSS nesting** (supported in modern browsers).
- All stylesheets use the new CSS nesting syntax with curly braces.
- Do **not** flatten nested CSS or convert to legacy syntax.
- See [MDN: CSS Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/Nesting_selector) for reference.

### Example

```css
:host {
    .placeholder {
        .score-buttons {
            button {
                font-size: 1em;
            }
        }
    }
}
```

# Web Component Code Conventions

- Each web component must:
  - Inherit from `BaseComponent`.
  - Have its own folder named after the component.
  - Include three files per component: `.ts`, `.css`, and `.html`, all named after the tag (e.g., `score-component.ts`, `score-component.css`, `score-component.html`).
  - Import HTML and CSS using:
    ```typescript
    import html from "./score-component.html?raw"
    import css from "./score-component.css?raw"
    ```
- Use native CSS nesting in all CSS files.
- 
## Web Component Sizing

- By default, web components should let their size be determined by outside styles (parent/container).
- Do **not** set fixed width or height in the component CSS unless required for layout.
- Use `inline-size: 100%` and `height: 100%` only if the parent provides constraints.
- Avoid hardcoded pixel values for sizing; prefer relative units or inherit from parent.

**Example:**
```css
:host {
    display: block;
    box-sizing: border-box;
    /* Let parent/container decide size */
    inline-size: 100%;
    height: 100%;
    width:100%;
}