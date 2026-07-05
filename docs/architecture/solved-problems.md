# Architectural Problems & Solutions

Este documento registra los problemas arquitectónicos encontrados en el proyecto y cómo fueron resueltos aplicando los principios de Domain-Driven Design (DDD) y Vertical Slice Architecture (VSA). Plantear la arquitectura desde el problema nos permite entender el *por qué* de cada regla.

## 1. El problema de los Slices Entrecruzados (Acoplamiento de Dominios)

**El Problema:**
En una arquitectura de Vertical Slices, cada dominio debe ser lo más independiente posible. Sin embargo, nos encontramos con que el dominio `cart` (carrito) necesitaba conocer el precio de los productos, por lo que importaba el Value Object `Price` directamente desde el dominio `products`.
Esto generaba un acoplamiento duro: si el dominio de productos cambiaba, se rompía el carrito. Los slices perdían su aislamiento y la base de código se volvía una red enmarañada (spaghetti code).

**La Solución:**
Identificamos que `Price` es un concepto universal que trasciende a un solo dominio. Se extrajo este Value Object a un **Shared Kernel** (`src/app/shared/domain/price.value-object.ts`). 
Ahora, tanto `products` como `cart` dependen del Shared Kernel, pero *nunca dependen el uno del otro*. Se restauró la independencia de los módulos.

## 2. El problema del Modelo de API vs. Modelo de Dominio (Fuga de Infraestructura)

**El Problema:**
Las APIs externas dictan la forma en que viajan los datos (DTOs, JSON crudo con tipos primitivos). Si usamos estos modelos directamente en nuestra capa de dominio o en la UI, cualquier cambio en el contrato del backend rompe toda nuestra aplicación frontend. 
Además, los modelos de API suelen carecer de comportamiento (métodos, validaciones internas), limitándonos a un modelo de dominio anémico.

**La Solución:**
Separación estricta de responsabilidades usando **Mappers (Anti-Corruption Layer)**. 
Definimos contratos separados: un modelo para la red (ej. `ApiProduct` en la capa de Infraestructura) y un modelo rico para el negocio (ej. `Product` con sus Value Objects en la capa de Dominio).
En el momento en que los datos cruzan la frontera de red (en los Repositories/Services de infraestructura), un Mapper transforma el `ApiProduct` en nuestra entidad pura `Product`. Si el backend cambia, solo se rompe y se ajusta el Mapper; el resto de la aplicación ni se entera.

## 3. El problema de la Reactividad con Estados Mutables (Angular Signals)

**El Problema:**
Angular 22 utiliza Signals para la reactividad, y su función de actualización (`signalSetFn`) evalúa los cambios basándose en la identidad de referencia (`Object.is`).
Si mutamos una entidad de dominio internamente (por ejemplo, agregando un ítem a la clase `Cart`) y luego hacemos un `.set()` con la misma instancia, Angular no detecta el cambio porque la referencia de memoria es exactamente la misma. La UI no se actualiza (ej. el badge del carrito no cambia).

**La Solución:**
Implementación del patrón **Clone** en las entidades mutables. En lugar de exponer directamente métodos que mutan el estado y esperar que el framework lo detecte, la entidad provee un método `.clone()` que devuelve una nueva instancia con los mismos datos. Al actualizar el Signal con este clon, la referencia de memoria cambia, garantizando que el motor de reactividad de Angular dispare la actualización de la vista de forma predecible.

## 4. El problema de Server-Side Rendering (SSR) con APIs del Navegador

**El Problema:**
Al tener Angular SSR activado, la aplicación se ejecuta primero en un entorno Node.js en el servidor para generar el HTML inicial. El problema es que en Node.js no existen objetos globales del navegador como `window` o `localStorage`. Si un servicio de infraestructura (como el `CartLocalStorageService`) intenta acceder a `localStorage` sin precauciones durante la fase de inicialización o renderizado, la aplicación lanza un error fatal y el build o la carga del servidor crashean.

**La Solución:**
Proteger el acceso a APIs exclusivas del navegador inyectando el token `PLATFORM_ID` de Angular y verificando el entorno de ejecución con la función `isPlatformBrowser()`. 
Esto asegura que las interacciones con `localStorage` (o cualquier otra Web API) se salteen silenciosamente cuando el código se ejecuta en el servidor, permitiendo que el SSR funcione sin problemas, y retomando la persistencia normal una vez que la app se hidrata en el cliente (el browser).
