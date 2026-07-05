# Delta Specification: Extract Shared Kernel Price

## ADDED Requirements
None. This is a pure structural refactoring.

## MODIFIED Requirements
None. The functional behavior of the `Price` value object remains identical.

## REMOVED Requirements
None.

## RENAMED Requirements
None.

## Structural Constraints
### Requirement: Shared Kernel Isolation
The system MUST isolate the `Price` value object into a shared kernel domain to allow consumption by both `products` and `cart` contexts without introducing cross-domain coupling.

#### Scenario: Cross-domain references are eliminated
- GIVEN the `cart` module needs to format or display a price
- WHEN the `cart` code imports the `Price` value object
- THEN it MUST import from `src/app/shared/domain/price.value-object`
- AND it MUST NOT import from `src/app/products/`
