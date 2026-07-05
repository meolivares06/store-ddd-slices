# Proposal: Extract Shared Kernel Price

## Intent

Extract the `Price` value object into a shared kernel domain to prevent cross-domain coupling between `products` and `cart`, while keeping its internal formatting logic intact.

## Scope

### In Scope
- Create `src/app/shared/domain` directory for the shared kernel.
- Move `price.value-object.ts` and its spec from `src/app/products/domain/` to `src/app/shared/domain/`.
- Update all imports in the `products` and `cart` contexts to reference the new location.

### Out of Scope
- Extracting or creating any other shared value objects or components (Price is the only one shared).
- Creating standalone formatting Pipes (formatting logic remains inside the Price VO).
- Configuring ESLint boundaries to enforce domain separation (this is a future goal/improvement).

## Capabilities

> This section is the CONTRACT between proposal and specs phases.
> The sdd-spec agent reads this to know exactly which spec files to create or update.

### New Capabilities
None.

### Modified Capabilities
None.

## Approach

Create the `src/app/shared/domain` directory to establish the shared kernel. Move the `price.value-object.ts` and its spec file to this new location. Search the entire codebase for references to the old `src/app/products/domain/price.value-object` path and update them to point to `src/app/shared/domain/price.value-object`. Ensure all existing tests pass after the move.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/products/domain/price.value-object.ts` | Moved | Relocated to shared kernel. |
| `src/app/products/` | Modified | Updated imports across product models, store, and UI components. |
| `src/app/cart/` | Modified | Updated imports across cart models, service, persistence, and UI components. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Broken imports in un-tested files | Low | Run TypeScript compiler (`tsc --noEmit`) and full test suite to catch all broken paths. |

## Rollback Plan

Revert the git commit that performs the file moves and import updates.

## Dependencies

- None

## Success Criteria

- [ ] `price.value-object.ts` lives in `src/app/shared/domain`.
- [ ] No files in `cart` import directly from `products` domain.
- [ ] All unit tests pass.
- [ ] The app builds successfully.
