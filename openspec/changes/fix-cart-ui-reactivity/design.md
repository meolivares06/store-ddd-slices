# Design: Fix Cart UI Reactivity

## Technical Approach

Add a `clone()` method to the `Cart` domain model that creates a new object instance with the same state. Use it in `CartService.addToCart()` and `CartService.removeFromCart()` before mutating and calling `signal.set()`. This ensures Angular's `signalSetFn` sees a different reference via `Object.is` comparison and triggers reactive consumers (badge counter, cart items list).

## Architecture Decisions

### Decision: Clone Strategy

| Option | Tradeoff | Decision |
|--------|----------|----------|
| JSON roundtrip | `Price` objects lose type after deserialization; `Cart` has no `fromJSON()`; private fields may not serialize cleanly under ES2022+ | ❌ Rejected |
| `Cart.create()` + replay items | O(n) replay loop; `addItem()` has quantity-merge semantics that are misleading for a pure clone | ❌ Rejected |
| **Dedicated `clone()` method** | Encapsulated in domain model; `Cart` already has `private constructor` so inter-instance access to `_items` is natural | ✅ **Chosen** |

**Rationale**: The `clone()` method is a single line in the service, no cognitive overhead. The domain model owns its cloning semantics. `Price` is a value object (immutable), so sharing references in shallow-copied items is safe. No new public constructors or factories needed.

### Decision: Where to Clone

| Location | Rationale |
|----------|-----------|
| `CartService.addToCart()` | Clone **before** mutation when cart exists; `null → create` path doesn't need cloning (new reference already) |
| `CartService.removeFromCart()` | Clone **before** mutation always |
| `CartService.clearCart()` | No change — `signal.set(null)` already provides a different reference |

**`clearCart()` is excluded** — it sets `null`, which is always a different reference than the previous Cart object.

## Data Flow

```
Before (broken):
  addToCart → signal.get() → same ref → .addItem() mutates in-place → signal.set(same ref) → Object.is === true → ❌ no notification

After (fixed):
  addToCart → signal.get() → .clone() → NEW ref → .addItem() on clone → signal.set(NEW ref) → Object.is === false → ✅ notification
```

```
removeFromCart (before):
  signal.get() → same ref → .removeItem() mutates → signal.set(same ref) → ❌

removeFromCart (after):
  signal.get() → .clone() → NEW ref → .removeItem() on clone → signal.set(NEW ref) → ✅
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/cart/domain/cart.model.ts` | Modify | Add `clone(): Cart` method |
| `src/app/cart/application/cart.service.ts` | Modify | Call `clone()` in `addToCart` and `removeFromCart` before mutation |

No new files. No deletions.

## Interfaces / Contracts

```typescript
// Added to Cart class (cart.model.ts)
clone(): Cart {
  const cloned = new Cart(this.id, this.customerId);
  cloned._items = this._items.map(item => ({ ...item }));
  return cloned;
}
```

The shallow spread `{ ...item }` is safe because `Price` is an immutable value object — its reference can be shared without risk of mutation.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `Cart.clone()` produces equal state with different reference | Verify `Object.is(original, clone) === false`, items match, total matches |
| Unit | `CartService.addToCart()` triggers signal notification | Existing computed tests (`itemCount`, `total`) now pass without workarounds |
| Unit | `CartService.removeFromCart()` triggers signal notification | Existing computed tests verify reactivity |
| Integration | Full add → remove → clear flow | No change; existing integration specs remain valid |

Existing test suite (`ng test`) must pass without modification. The existing tests already assert computed values — they were passing before only by coincidence (first add signal fires because `null → Cart` is a new reference; the bug only manifests on subsequent operations).

## Migration / Rollout

No migration required. This is a pure in-memory change — no data format changes, no storage schema updates, no feature flags.

## Open Questions

None.
