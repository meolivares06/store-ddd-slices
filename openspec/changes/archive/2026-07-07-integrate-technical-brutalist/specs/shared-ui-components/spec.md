# shared-ui-components Specification

## Purpose

Implement standalone, presentational ('Dumb') components for cross-domain reuse aligning with Container-Presentational patterns.

## Requirements

### Requirement: Dumb Button Component

The system MUST provide a purely presentational `app-button` component.

#### Scenario: Rendering Button
- GIVEN the `app-button` component
- WHEN it receives input properties
- THEN it MUST render a native button using the Brutalist CSS tokens
- AND it MUST emit an output event when clicked without containing business logic

### Requirement: Dumb Badge Component

The system MUST provide a purely presentational `app-badge` component.

#### Scenario: Rendering Badge
- GIVEN the `app-badge` component
- WHEN it receives input properties
- THEN it MUST render a badge using Brutalist CSS tokens
