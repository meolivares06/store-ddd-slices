# Specification: Extract Price Value Object to Shared Kernel

## 1. Description
The `Price` Value Object currently lives in the `products` domain but is heavily used by the `cart` domain. In DDD, vertical slices should not depend on each other's internal domain logic. To fix this, `Price` must be extracted to a Shared Kernel accessible by both domains.

## 2. Structural Requirements
- **Location:** `src/app/shared/domain/price.value-object.ts`
- **Tests:** `src/app/shared/domain/price.value-object.spec.ts`

## 3. Scenarios

### Scenario 1: Cart Domain Isolation
- **Given** the cart domain needs to manage item prices
- **When** it imports the `Price` Value Object
- **Then** the import must point to `@app/shared/domain` and NOT `@app/products`

### Scenario 2: Products Domain Isolation
- **Given** the products domain defines a product entity
- **When** it uses the `Price` Value Object
- **Then** the import must point to `@app/shared/domain`

### Scenario 3: Cross-Domain Coupling Eliminated
- **Given** a strict dependency graph
- **When** analyzed
- **Then** there must be zero imports from `cart/` into `products/` (and vice-versa) related to the Price VO.
