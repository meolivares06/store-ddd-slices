# Specification: Shared Domain

## Description
Shared Domain logic and Kernel items accessible by other vertical slices.

## Requirements

### Requirement: Price Value Object Rules

The `Price` Value Object MUST be isolated in the Shared Kernel and validate basic amount and currency rules, using Brazilian Reais (BRL) as the default.

#### Scenario: Default BRL Currency
- GIVEN a new `Price` Value Object is instantiated
- WHEN no currency is explicitly provided
- THEN the system MUST assume Brazilian Reais (BRL) as the default currency

#### Scenario: Cart Domain Isolation
- GIVEN the cart domain needs to manage item prices
- WHEN it imports the `Price` Value Object
- THEN the import MUST point to `@app/shared/domain` and NOT `@app/products`

#### Scenario: Products Domain Isolation
- GIVEN the products domain defines a product entity
- WHEN it uses the `Price` Value Object
- THEN the import MUST point to `@app/shared/domain`

#### Scenario: Cross-Domain Coupling Eliminated
- GIVEN a strict dependency graph
- WHEN analyzed
- THEN there MUST be zero imports from `cart/` into `products/` (and vice-versa) related to the Price VO
