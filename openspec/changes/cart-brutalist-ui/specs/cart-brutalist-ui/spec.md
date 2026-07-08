# cart-brutalist-ui Specification

## Purpose

Defines the Brutalist UI layout and design requirements for the Shopping Cart, implementing CSS Grid and raw CSS tokens within a Container-Presentational component architecture.

## Requirements

### Requirement: Brutalist Cart Layout

The system MUST render the `CartPage` using a two-column CSS Grid layout on desktop.

#### Scenario: Desktop View
- GIVEN the user is on a desktop device
- WHEN viewing the cart
- THEN the item list MUST appear in the main column
- AND the checkout summary MUST appear in a sticky sidebar column

#### Scenario: Mobile View
- GIVEN the user is on a mobile device
- WHEN viewing the cart
- THEN the layout MUST stack into a single column
- AND the checkout summary MUST appear below the item list

### Requirement: Brutalist Presentational Components

The system MUST render cart items and the summary using dedicated presentational components styled with hard shadows and thick borders.

#### Scenario: Rendering a Cart Item
- GIVEN a product in the cart
- WHEN the `CartItemComponent` is rendered
- THEN it MUST display the item ID, formatted unit price, and a `QuantityStepperComponent`
- AND it MUST use `--border-width-thick` and `--shadow-hard` from CSS tokens
- AND it MUST emit an event when the user chooses to remove the item

#### Scenario: Rendering the Checkout Summary
- GIVEN the cart has items
- WHEN the `CartSummaryComponent` is rendered
- THEN it MUST display the total formatted price
- AND it MUST provide a button to clear the cart
- AND the summary container MUST use a stark contrasting border (`--border-width-thick`)

### Requirement: Brutalist Quantity Stepper

The system MUST provide a generic atom component for numeric input.

#### Scenario: Interacting with the Stepper
- GIVEN the `QuantityStepperComponent` is used in a cart item
- WHEN rendered
- THEN it MUST display the current quantity using `--font-family-mono`
- AND it MUST provide buttons to increment and decrement the quantity
- AND it MUST emit a change event upon interaction