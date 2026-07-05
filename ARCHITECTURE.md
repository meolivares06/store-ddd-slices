# Arquitectura — Store DDD Slices

> Guía definitiva de la arquitectura del proyecto.
> Cualquier agente (IA o humano) debe seguir estas reglas al generar o modificar código.

---

## Filosofía

DDD + Vertical Slices + Screaming Architecture.

Cada funcionalidad (`products/`, `cart/`) es autónoma. No hay carpetas compartidas de `components/`, `services/` o `models/`. El nombre de cada slice debe gritar de qué trata el negocio.

---

## Estructura de cada Vertical Slice

```
products/                        ← el nombre grita el dominio
├── domain/                      → Puro TypeScript, sin Angular
│   ├── product.model.ts         → Entidad (clase con factory)
│   └── price.value-object.ts    → Value Object (clase inmutable)
│
├── infrastructure/              → HTTP, localStorage, DTOs
│   ├── product-api.dto.ts       → Api* = calco de la API externa
│   └── product-http.ts          → Service HTTP + mapper
│
└── application/                 → Estado, orquestación, componentes
    ├── product-repository.interface.ts  → Interfaz + InjectionToken
    ├── product-store.ts                 → Store con signals
    └── ui/
        ├── product/                     → Dumb component (solo inputs/outputs)
        └── product-list/                → Smart component (orquesta)
```

---

## Reglas por Capa

### Domain (`domain/`)

| Regla | Exigencia |
|-------|-----------|
| **Zero Angular** | No imports de Angular. No `@Service`, no `inject`, no `HttpClient` |
| **Zero frameworks** | RxJS permitido solo si es indispensable. Preferir funciones puras |
| **Constructor privado** | Toda entidad/VO se construye con `static create()` |
| **Validación en factory** | El factory valida TODO antes de construir. Datos inválidos = error |
| **Inmutabilidad** | Value Objects: inmutables, operaciones devuelven nuevas instancias |
| **Value Objects** | Para conceptos con reglas: `Price`, `Email`, `Currency`. No `number` crudos |
| **Aggregate Root** | Colecciones privadas expuestas como `readonly`. Solo el root muta |

### Infrastructure (`infrastructure/`)

| Regla | Exigencia |
|-------|-----------|
| **DTOs con prefijo Api** | `ApiProduct`, `ApiProductResponse`, `ApiDimensions` |
| **DTOs sin comportamiento** | Solo interfaces, cero lógica |
| **Mapper explícito** | Función pura `mapToProduct(api: ApiProduct): Product` |
| **No lógica de negocio** | Todo lo que sea regla vive en domain/ |
| **Repository implementa interfaz** | `class ProductHttp implements ProductRepository` |

### Application (`application/`)

| Regla | Exigencia |
|-------|-----------|
| **Signals para estado** | `signal()`, `computed()`, nunca sujetos RxJS para estado |
| **Inyección vía token** | `inject(PRODUCT_REPOSITORY_TOKEN)`, nunca la clase concreta |
| **Sin lógica de negocio** | Delegar en domain/ (`product.applyDiscount()`, no `p.price * 0.9`) |
| **Componentes dumb** | `input()` / `output()`, sin inyección de servicios |
| **Componentes smart** | Inyectan store/service, delegan en dumb components |

---

## Nomenclatura

### DTOs (siempre en infrastructure/)

| Prefijo | Significado | Ejemplo |
|---------|-------------|---------|
| `Api*` | Datos de API externa | `ApiProduct`, `ApiProductResponse` |
| `*Dto` | (alternativa) | `ProductDto` — usar solo si no hay API externa |

### Entidades y VOs (siempre en domain/)

| Nombre | Significado |
|--------|-------------|
| `Product` | Entidad del dominio (sin prefijo) |
| `Price` | Value Object (sin prefijo) |
| `Cart` | Aggregate Root (sin prefijo) |

**Regla mnemotécnica:** `Api` es el acento extranjero (infraestructura). El nombre pelado es tu idioma nativo (dominio).

---

## Patrones Obligatorios

| Patrón | Dónde | Por qué |
|--------|-------|---------|
| **Factory Method** | Entidades y VOs | Controlar creación con validación |
| **Value Object** | Conceptos con reglas | Eliminar Primitive Obsession |
| **DTO** | Infraestructura | Separar contrato API del dominio |
| **Mapper / Adapter** | Infraestructura | Traducir DTO → Entidad |
| **Repository** | Application (interface) | Abstraer origen de datos |
| **Aggregate Root** | Colecciones con reglas | Consistencia del agregado |
| **Dependency Injection** | Angular (token) | Cumplir DIP, facilitar tests |

---

## SOLID — Verificación por Capa

| Principio | Cómo se cumple |
|-----------|----------------|
| **S** | Cada archivo tiene UNA razón de cambio |
| **O** | Nuevas fuentes de datos = nueva impl del Repository, Store intacto |
| **L** | `ProductHttp implements ProductRepository` — reemplazable sin efectos |
| **I** | `ProductRepository` solo expone lo que se necesita |
| **D** | Store depende de `PRODUCT_REPOSITORY_TOKEN`, no de `ProductHttp` |

---

## Inyección de Dependencias

### Cómo NO se hace
```typescript
// ❌ Store acoplado a una clase concreta
class ProductStore {
  #http = inject(ProductHttp);
}
```

### Cómo SÍ se hace
```typescript
// 1. Interfaz en application/
export interface ProductRepository { ... }
export const PRODUCT_REPOSITORY_TOKEN = new InjectionToken<ProductRepository>(...);

// 2. Implementación en infrastructure/
@Service()
export class ProductHttp implements ProductRepository { ... }

// 3. Store inyecta token
class ProductStore {
  #repo = inject(PRODUCT_REPOSITORY_TOKEN);
}

// 4. Wiring en app.config
{ provide: PRODUCT_REPOSITORY_TOKEN, useExisting: ProductHttp }
```

### ¿Por qué InjectionToken y no la interfaz?

Las interfaces de TypeScript **no existen en runtime**. Al compilar a JavaScript, desaparecen. `InjectionToken` genera un objeto real que Angular puede usar como clave en su mapa de providers.

---

## Tests

| Tipo | Dónde | Angular | Qué probar |
|------|-------|---------|------------|
| **Dominio** | `domain/*.spec.ts` | ❌ No | Reglas de negocio, validación, inmutabilidad |
| **Aplicación** | `application/*.spec.ts` | ❌ No (mock del token) | Orquestación, flujos, estados |
| **Infraestructura** | `infrastructure/*.spec.ts` | ✅ Sí | HTTP, mappers, serialización |
| **UI** | `ui/*/spec.ts` | ✅ Sí | Renderizado, inputs/outputs |

### Reglas de tests

- Los tests de dominio **nunca** importan TestBed, Angular, ni HttpClient
- Los tests de aplicación **mockean los tokens** de DI, nunca usan implementaciones reales
- Los tests de infraestructura **pueden** usar HttpClient (via `provideHttpClient`)
- Usar `vi.fn()` de Vitest para mocks, no Jasmine

---

## Convenciones Angular 22+

| Regla | Detalle |
|-------|---------|
| Standalone components | Por defecto. No escribir `standalone: true` |
| OnPush | Por defecto. No escribir `changeDetection: OnPush` |
| `@Service()` | Preferir sobre `@Injectable({providedIn: 'root'})` |
| `input()` / `output()` | Nunca decoradores `@Input` / `@Output` |
| `inject()` | Nunca constructor injection |
| Signals | `signal()`, `computed()` para estado. No `mutate()` |
| Control flow | `@if`, `@for`, `@switch`. No `*ngIf`, `*ngFor` |
| Host bindings | En objeto `host` del decorador, no `@HostBinding` / `@HostListener` |
| `@angular/forms/signals` | Preferir para formularios nuevos |

---

## Estado del Proyecto

```
src/app/
├── products/           ← Catálogo (completo)
│   ├── domain/
│   │   ├── product.model.ts
│   │   ├── price.value-object.ts
│   │   ├── product.model.spec.ts       (6)
│   │   └── price.value-object.spec.ts  (12)
│   ├── infrastructure/
│   │   ├── product-api.dto.ts
│   │   ├── product-http.ts
│   │   └── product-http.spec.ts
│   └── application/
│       ├── product-repository.interface.ts
│       ├── product-store.ts
│       ├── product-store.spec.ts        (5)
│       └── ui/
│           ├── product/                (dumb)
│           └── product-list/           (smart)
│
├── cart/               ← Carrito (completo)
│   ├── domain/
│   │   └── cart.model.ts
│   │   └── cart.model.spec.ts          (13)
│   ├── infrastructure/
│   │   └── cart-local-storage.service.ts
│   └── application/
│       ├── cart-repository.interface.ts
│       ├── cart.service.ts
│       └── cart.service.spec.ts         (9)
│
├── layout/             ← Layout visual
└── app/                ← App root

Tests: 10 files, 51 tests (18 domain + 14 application + 2 infra + 3 UI + 3 app-root)
```

---

## Anti-patrones — Lo que NO hacemos

| Anti-patrón | Por qué |
|-------------|---------|
| Carpetas compartidas `components/`, `services/`, `models/` | Crea dependencias ocultas entre slices |
| Lógica de negocio en stores o componentes | No testable, duplicada, frágil |
| `any` en lugar de `unknown` | Pierde type safety |
| `as` para casting de tipos API a dominio | Miente al compilador, no transforma en runtime |
| Import directo de clases de infraestructura desde aplicación | Viola DIP |
| Mutar signals con `mutate()` | Rompe la inmutabilidad del estado |
| Tipo `number` para precio, moneda, etc. | Primitive Obsession |
| `@Injectable({providedIn: 'root'})` en lugar de `@Service()` | Inconsistente con el resto del proyecto (Angular 22+) |
