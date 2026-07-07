# Guía de Estudio: Arquitectura DDD Avanzada y AWS

Este documento resume las decisiones arquitectónicas y conceptos teóricos avanzados discutidos durante la implementación del portfolio `store-ddd-slices`. Ideal para repasar antes de entrevistas técnicas Senior.

## 1. Domain Events (Bus de Eventos) vs Angular Signals
**Pregunta de Entrevista:** "¿Por qué no usar Angular Signals para emitir eventos entre componentes?"

**Respuesta Teórica:**
- **Signals = Estado:** Angular diseñó las Signals con una garantía *glitch-free* (libre de fallos). Esto significa que si el valor cambia múltiples veces en un mismo ciclo, Angular descarta los valores intermedios y solo ejecuta el `effect()` con el último valor. Esto es perfecto para el estado (ej: total del carrito), pero **fatal para eventos discretos** (ej: clics de "Agregar al carrito").
- **RxJS (Subjects) = Eventos:** RxJS maneja flujos de tiempo discretos. No pierde ningún evento intermedio.
- **Implementación DDD:** Creamos un `EventBusService` usando RxJS `Subject` en la capa `shared/`. Es 100% **Stateless** (sin estado). Actúa solo como un mediador (similar a MediatR en C#) para que un Bounded Context (ej: Products) emita un evento sin acoplarse ni conocer al Bounded Context que lo escucha (ej: Cart).

## 2. CQRS (Command Query Responsibility Segregation)
**Concepto:** Separar las operaciones de lectura (Queries) de las operaciones de escritura (Commands).
- **Queries:** Solo leen datos. Usan DTOs planos optimizados para la vista. En Angular moderno, esto se modela perfectamente con un `computed()` de Signals.
- **Commands:** Mutan el estado y aplican reglas de negocio (validaciones, Value Objects). 
- **NgRx SignalStore y rxMethod:** Es la evolución moderna en Angular. Usamos Signals para el estado (Queries), y exponemos `rxMethod` para los Commands. `rxMethod` envuelve RxJS por debajo para manejar el flujo asíncrono y la concurrencia, manteniendo la API limpia basada en Signals.

## 3. Aggregates (Raíces de Agregación)
**Concepto:** Un Aggregate Root es la entidad principal que agrupa y protege a otras entidades dependientes.
- **Ejemplo:** El `Cart` (Carrito) es el Aggregate Root. Los `CartItems` (Productos adentro del carrito) son dependientes.
- **Regla de Oro:** Ningún componente externo puede modificar un `CartItem` directamente. Toda modificación (ej: cambiar cantidad) debe pasar por el método del Aggregate Root (`Cart.changeQuantity()`), garantizando que el estado global y los totales siempre sean consistentes.

## 4. Infraestructura AWS: SSR vs Static SPA en S3
**Pregunta de Entrevista:** "¿Por qué desactivaste el SSR de Angular 17 para desplegar en S3?"

**Respuesta Teórica:**
- **AWS S3 es Storage, no Compute:** S3 es un servicio de almacenamiento de objetos estáticos. No tiene un motor de Node.js para ejecutar código en el servidor.
- **Angular SSR (`outputMode: "server"`):** Requiere un servidor Node.js (EC2, Elastic Beanstalk, o App Runner) para renderizar el HTML al vuelo. Si se sube a S3, CloudFront no encuentra el `index.html` raíz, sino un `index.csr.html` (Client-Side Rendering fallback), arrojando un error `403 Access Denied`.
- **Decisión Arquitectónica:** Para un portfolio gratuito y de mantenimiento cero, el *trade-off* correcto es compilar Angular como una **Static SPA** (Single Page Application pura). Esto permite alojarlo en S3 + CloudFront por un costo mensual de casi $0.00, sacrificando el renderizado en servidor pero ganando extrema resiliencia y simplicidad DevOps.
