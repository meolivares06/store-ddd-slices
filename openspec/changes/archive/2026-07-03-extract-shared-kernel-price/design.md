# Design: Extract Shared Kernel Price

## Technical Approach

We will extract the `Price` value object from `src/app/products/domain/` to a newly created shared kernel at `src/app/shared/domain/`. This resolves the architectural violation where the `cart` bounded context directly imports from the `products` context.

## Architecture Decisions

### Decision: Shared Kernel Location

**Choice**: `src/app/shared/domain/`
**Alternatives considered**: Extracting to a completely separate library workspace or feature module.
**Rationale**: Overkill for a single value object. A local `shared/domain` directory clearly indicates shared intent without the overhead of a full library.

### Decision: Import Aliases

**Choice**: Use relative paths for imports.
**Alternatives considered**: Set up TypeScript path aliases (e.g., `@shared/domain/*`).
**Rationale**: We are keeping the refactoring localized. Changing `tsconfig.json` for paths is out of scope for this specific change unless we decide to do it globally for the project later.

## Data Flow

Data flow is unaffected. `Price` will still be instantiated identically across both `products` and `cart`.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/shared/domain/price.value-object.ts` | Create | Moved from products domain. |
| `src/app/shared/domain/price.value-object.spec.ts` | Create | Moved from products domain. |
| `src/app/products/domain/price.value-object.ts` | Delete | Moved to shared kernel. |
| `src/app/products/domain/price.value-object.spec.ts` | Delete | Moved to shared kernel. |
| `src/app/cart/**/*.ts` | Modify | Update import paths to `../../shared/domain/price.value-object` (relative path varies). |
| `src/app/products/**/*.ts` | Modify | Update import paths to `../shared/domain/price.value-object` (relative path varies). |

## Interfaces / Contracts

No new interfaces. The `Price` API remains identical:
```typescript
class Price {
  static create(value: number): Price;
  get value(): number;
  format(): string;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Price VO | Verify existing tests run successfully at the new path. |
| Unit | Products / Cart | Run all existing tests to ensure no broken imports or changed behavior. |

## Migration / Rollout

No migration required. Pure structural move.

## Open Questions
- None.
