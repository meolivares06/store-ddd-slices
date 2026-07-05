## Exploration: Extract Price Value Object to Shared Kernel

### Current State
The `Price` Value Object is currently defined within the `products` bounded context (`src/app/products/domain/price.value-object.ts`). However, the `cart` bounded context relies heavily on it to compute totals and store item prices. This creates an unhealthy cross-domain dependency where `cart` directly imports domain models from `products`, violating vertical slice isolation in DDD.

### Affected Areas
- `src/app/products/domain/price.value-object.ts` — Currently holds the VO and will be moved.
- `src/app/cart/domain/cart.model.ts` — Imports `Price` from products.
- `src/app/cart/application/cart.service.ts` — Imports `Price` from products.
- `src/app/cart/infrastructure/cart-local-storage.service.ts` — Imports `Price` from products.
- `src/app/cart/application/ui/cart/cart.spec.ts` — Imports `Price` from products.
- `src/app/products/domain/product.model.ts` — Needs updated import paths.
- `src/app/products/infrastructure/product-http.ts` — Needs updated import paths.
- Various test files (`*.spec.ts`) in both `cart` and `products` — Need updated import paths.

### Approaches
1. **Move to `src/app/shared/domain/price.value-object.ts`**
   - Pros: Directly maps to standard DDD architecture where `shared` has its own `domain` layer. Keeps all shared domain models together.
   - Cons: Might become a dumping ground if we don't strictly control what goes into `shared/domain`.
   - Effort: Low

2. **Move to `src/app/shared/value-objects/price.value-object.ts`**
   - Pros: Categorizes shared components specifically by their DDD type (value objects, entities).
   - Cons: Overly prescriptive folder structure for a small number of shared concepts.
   - Effort: Low

### Recommendation
**Approach 1: `src/app/shared/domain/price.value-object.ts`** is recommended. It is standard in Angular DDD architectures to have a `shared` scope that mimics the internal structure of feature slices (having a `domain` folder). It is simple and establishes a clear home for shared domain primitives.

### Risks
- Moving the file might break imports if not all instances are updated. (Mitigated by TypeScript's compiler which will catch strict import errors).
- Shared Kernel can become a monolith over time if we indiscriminately add domain models to it; we must strictly limit it to generic/primitives like `Price`.

### Ready for Proposal
Yes — The orchestrator can proceed with proposing this change.