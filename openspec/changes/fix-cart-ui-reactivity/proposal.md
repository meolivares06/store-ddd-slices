# Proposal: Fix Cart UI Reactivity

## Intent

CartService mutates the Cart object in-place and calls `this.#cart.set(currentCart)` with the same object reference. Angular 22's `signalSetFn` uses `Object.is` for equality — same reference means no reactive notification. This breaks two consumer features:

- **Cart badge counter** stays at 1 (Layout `itemCount` computed never re-evaluates after first add)
- **Remove button** has no effect (CartPage `items` computed never updates after removal)

Both share the same root cause and are fixed together.

## Scope

### In Scope
- Fix `addToCart` to clone/create a new Cart reference before `set()`
- Fix `removeFromCart` to clone/create a new Cart reference before `set()`
- Add test verifying signal emits after mutation (optional)
- All existing tests must pass

### Out of Scope
- No UI changes to Layout, CartPage, or ProductList
- No storage/repository changes
- No new capabilities or domain logic
- No changes to `clearCart()` — it sets `null`, which already triggers reactivity

## Capabilities

### New Capabilities

None — bug fix with no new spec-level behavior.

### Modified Capabilities

None — no requirements change; existing spec scenarios (badge reactivity, remove item, empty state) will now pass correctly.

## Approach

In both `addToCart` and `removeFromCart`, instead of mutating `currentCart` and setting the same reference:

1. Clone the Cart state into a NEW Cart instance before any mutation
2. Apply the mutation on the new instance
3. Set the NEW instance on the signal

Simplest strategy: `Cart.fromJSON(JSON.stringify(currentCart))` or a dedicated `clone()` method on Cart if one exists. This ensures `Object.is` detects a different reference and triggers reactive consumers.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/cart/application/cart.service.ts` | Modified | Create new Cart reference before set() in addToCart and removeFromCart |
| `src/app/cart/application/cart.service.spec.ts` | Modified (optional) | Signal notification test demonstrating reactivity after mutations |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Clone misses a Cart property | Low | Verify Cart model shape; existing tests cover serialization |

## Rollback Plan

Revert changes to `src/app/cart/application/cart.service.ts` — single file, no migrations, no data loss.

## Dependencies

None.

## Success Criteria

- [ ] Cart badge counter updates correctly after multiple additions (itemCount recomputes)
- [ ] Remove button removes items from cart view (items recomputes)
- [ ] `clearCart()` still works correctly (unchanged behavior)
- [ ] All existing tests pass (`ng test`)
