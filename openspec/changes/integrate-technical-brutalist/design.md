# Technical Design: Integrate Technical Brutalist Design System

## Architecture Overview

This change introduces a strict separation between global design tokens and presentational UI components, removing Tailwind CSS in favor of raw CSS Custom Properties. The goal is to fully embrace a Technical Brutalist aesthetic (monochrome, high-contrast, bold borders, sharp edges) and reinforce the Container-Presentational pattern by providing 'dumb' components (`app-button`, `app-badge`) for the Container components to use.

## Design Details

### 1. CSS Custom Properties (Design Tokens)

We will create a central token file to define the Technical Brutalist theme.

**File:** `src/styles/_tokens.css`

```css
:root {
  /* Colors - High Contrast / Monochrome with stark accents */
  --color-bg: #ffffff;
  --color-fg: #000000;
  --color-accent: #ff0000; /* Brutalist red */
  --color-surface: #f0f0f0;

  /* Typography - Monospace and bold */
  --font-family-sans: "Helvetica Neue", Helvetica, Arial, sans-serif;
  --font-family-mono: "Courier New", Courier, monospace;

  /* Borders - Thick, sharp */
  --border-width-thin: 1px;
  --border-width-thick: 3px;
  --border-style: solid;
  --border-color: var(--color-fg);

  /* Spacing - Rigid grid */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;

  /* Shadows - Hard shadows (no blur) */
  --shadow-hard: 4px 4px 0px var(--color-fg);
}
```

This file will be imported into the main global stylesheet (e.g., `src/styles.css`).

### 2. Shared UI Components (Presentational)

We will implement isolated standalone Angular components utilizing the new signals-based input/output APIs.

#### Button Component (`app-button`)
**Path:** `src/shared/ui/button/`

- **TS (`button.component.ts`):**
  - Standalone component.
  - Inputs: `label` (string, required), `variant` (string, optional: 'primary' | 'secondary').
  - Outputs: `clicked` (EventEmitter/output).
- **CSS (`button.component.css`):**
  - Uses tokens: `--border-width-thick`, `--shadow-hard`, `--color-fg`, etc.
  - No Tailwind classes. Hover states shift the hard shadow (pseudo-3D effect).

#### Badge Component (`app-badge`)
**Path:** `src/shared/ui/badge/`

- **TS (`badge.component.ts`):**
  - Standalone component.
  - Inputs: `text` (string, required).
- **CSS (`badge.component.css`):**
  - Brutalist tag style: monospace font, solid borders, high contrast background.

### 3. Refactoring Products UI (Container & Presentational)

#### Presentational: `ProductComponent` (`src/app/products/application/ui/product/`)
- Replace existing Tailwind utility classes with semantic raw CSS classes.
- Use `app-button` for the "Add to Cart" or "Buy" actions.
- Use `app-badge` for product tags or price highlights.
- Create `product.component.css` referencing tokens.

#### Container: `ProductList` (`src/app/products/application/ui/product-list/`)
- Manage the layout (CSS Grid/Flexbox) using raw CSS classes mapped to tokens (`--spacing-md`, etc.).
- Remove any Tailwind classes from the template.
- Continue to pass down data to `ProductComponent` purely via inputs, handling events via outputs.

## Impact Analysis

- **Styles:** Enforces strict usage of CSS variables. Removes framework dependence.
- **Components:** Standardizes basic UI elements, making them perfectly isolated and reusable.
- **Accessibility:** High contrast nature of Brutalism ensures WCAG AA compliance natively. Hard borders and clear focus states must be implemented in the components.
