# Proposal: Integrate Technical Brutalist Design System

## Intent

Implement a 'Technical Brutalist' design system utilizing raw CSS Custom Properties (Design Tokens) to align with the existing DDD / Container-Presentational architecture. This will replace framework-dependent styling approaches (avoiding Tailwind) and establish a strict Atomic/Dumb component UI layer.

## Scope

### In Scope
- Define a comprehensive Design Tokens architecture in `src/styles/` for colors, typography, and spacing based on Technical Brutalist aesthetics.
- Create purely presentational 'Dumb' components (`app-button`, `app-badge`) in a new `src/shared/ui/` directory.
- Refactor existing `ProductList` (`src/app/products/application/ui/product-list/product-list.ts`) to use tokens and dumb components.
- Refactor existing `ProductComponent` (`src/app/products/application/ui/product/product.ts`) to use tokens and dumb components.

### Out of Scope
- Introducing third-party CSS frameworks (e.g., Tailwind, Bootstrap).
- Refactoring domain logic or state management (`product-store`, `product-http`).
- Adding new feature flows outside the visual refactor of the product listing.

## Capabilities

> This section is the CONTRACT between proposal and specs phases.

### New Capabilities
- `design-system-core`: Introduction of CSS Custom Properties for typography, borders, and colors aligned to Brutalism.
- `shared-ui-components`: Implementation of standalone atomic components (`app-button`, `app-badge`) for cross-domain reuse.

### Modified Capabilities
- `product-listing`: UI modernization using the new Technical Brutalist tokens and dumb components, without changing business requirements.

## Approach

1. **Tokens Architecture**: Create a global `src/styles/_tokens.css` defining the Brutalist palette (high contrast, bold borders, monospace typography). 
2. **Atomic UI**: Create standalone Angular components for `app-button` and `app-badge` in `src/shared/ui/`. These will rely strictly on modern Angular `input()` and `output()`.
3. **Container-Presentational Alignment**: Update `ProductList` (Container) and `ProductComponent` (Presentational) to use the new atomic components and apply the design tokens for layout and spacing.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/styles/` | New | Global CSS Custom Properties (tokens) |
| `src/shared/ui/` | New | Atomic components (`app-button`, `app-badge`) |
| `src/app/products/application/ui/product-list/` | Modified | Applying layout tokens and dumb components |
| `src/app/products/application/ui/product/` | Modified | Applying UI tokens and dumb components |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Inconsistent token usage | Med | Strict code review and linting for direct hex values |
| Accessibility regressions | Low | Ensure `app-button` and `app-badge` pass AXE checks and WCAG AA contrast standards |

## Rollback Plan

Revert the specific PR implementing this change. Since it only affects the presentation layer, no data migrations or API rollbacks are necessary. We can simply restore the previous CSS and component templates via Git.

## Dependencies

- None (explicitly avoiding external UI libraries).

## Success Criteria

- [ ] `src/styles/` contains a comprehensive set of CSS variables for Brutalism.
- [ ] `app-button` and `app-badge` exist in `src/shared/ui/` and are used by product components.
- [ ] `ProductList` and `ProductComponent` templates are updated and use no Tailwind classes.
- [ ] Accessibility (WCAG AA) standards are maintained with high-contrast colors.