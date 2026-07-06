# Guía de Entrevistas Técnicas: Angular Senior & Arquitectura

Esta guía contiene los "pitch" (discursos) técnicos basados exactamente en lo que construimos en el repositorio `store-ddd-slices`. El objetivo es que cuando te pregunten sobre un tema, no respondas solo con teoría, sino contando **el problema que resolviste y cómo lo aplicaste en este proyecto**.

---

## 1. CI/CD y Despliegues en AWS (Continuous Integration / Continuous Deployment)

**La Pregunta típica:** *"¿Tenés experiencia configurando pipelines de CI/CD? ¿Cómo manejás los despliegues?"*

**Tu Respuesta (El Pitch):**
> "Sí, me encargo del ciclo de vida completo. En mis proyectos configuro **GitHub Actions estructurado en múltiples jobs**.
> Primero, tengo un job de Integración Continua (CI) que corre siempre en cada Pull Request. Ahí levanto Node, instalo dependencias, corro mi suite de unit tests (con Vitest/Karma bajo un entorno headless) y hago el build.
> Si eso pasa y se mergea a la rama `main`, ese job genera un artefacto (la carpeta `dist`) y se la pasa a un segundo job dedicado al Despliegue Continuo (CD). 
> Ese job de CD corre bajo un **Environment protegido** en GitHub para aislar los secretos. Desde ahí, me conecto a AWS, sincronizo los estáticos con un bucket de **Amazon S3** y lanzo una invalidación a la CDN de **CloudFront** para asegurar que los usuarios reciban la última versión sin problemas de caché."

---

## 2. Arquitectura y Escalabilidad (Domain-Driven Design y Vertical Slices)

**La Pregunta típica:** *"¿Cómo estructurás una aplicación de Angular grande para que sea mantenible a lo largo del tiempo?"*

**Tu Respuesta (El Pitch):**
> "Huyo del patrón clásico de separar por carpetas técnicas (components, services, models) porque genera 'Spaghetti code' a medida que la app crece. 
> Yo aplico **Vertical Slice Architecture** combinado con conceptos de **Domain-Driven Design (DDD)**. Agrupo todo por dominio de negocio (ej: `products`, `cart`).
> Lo más crítico para mí es el **Aislamiento**: un dominio no puede depender directamente de otro. Por ejemplo, en un proyecto reciente noté que el módulo de *Carrito* importaba lógica de precios directamente desde *Productos*. Para romper ese acoplamiento, extraje el concepto de Precio a un **Shared Kernel** (Núcleo Compartido). Esto permite escalar módulos de forma independiente o incluso prepararlos para una migración a Microfrontends si el negocio lo requiere."

---

## 3. Integración con APIs y Capas Anticorrupción

**La Pregunta típica:** *"¿Cómo manejás la integración con el Backend? ¿Qué pasa si la API cambia sus contratos?"*

**Tu Respuesta (El Pitch):**
> "Trato de proteger la UI y mis reglas de negocio de los caprichos del Backend usando **Capas Anticorrupción (Mappers)**.
> Cuando consumo una API externa, defino un DTO o interfaz para la red (ej. `ApiProduct`), pero no dejo que ese objeto viaje por mis componentes. En el momento en que la respuesta llega a mi capa de infraestructura (Services/Repositories), paso esos datos por un Mapper que los convierte en mi Entidad de Dominio rica (ej. `Product`).
> Si mañana el backend cambia la estructura del JSON, mi componente visual ni se entera; simplemente ajusto el Mapper en la capa de infraestructura y el resto de la aplicación sigue funcionando intacta."

---

## 4. Reactividad y Manejo de Estado (Signals vs RxJS)

**La Pregunta típica:** *"¿Qué opinás de Angular Signals? ¿Cómo manejás estados complejos en los componentes?"*

**Tu Respuesta (El Pitch):**
> "Angular 22 con Signals nos permite un manejo de estado mucho más predecible y síncrono para la UI que usar puros `BehaviorSubjects` de RxJS. 
> Sin embargo, Signals tiene un desafío interesante: su función de actualización evalúa la identidad de referencia (`Object.is`). Si vos mutás un array o un objeto internamente y llamás a `.set()`, la vista no reacciona porque la referencia en memoria es la misma.
> Para solucionar esto en entidades complejas (como el estado de un Carrito de compras), implemento el **Patrón Clone** en mis modelos de dominio. Cada vez que el carrito muta, devuelvo una nueva instancia (`cart.clone()`), lo que garantiza que Signals detecte el cambio de referencia y dispare el ciclo de detección de cambios de manera impecable."

---

## 5. Server-Side Rendering (SSR) y Troubleshooting

**La Pregunta típica:** *"¿Tuviste problemas lidiando con SSR en Angular? ¿Cómo los solucionaste?"*

**Tu Respuesta (El Pitch):**
> "El SSR en Angular te obliga a recordar que tu código corre en dos entornos distintos: Node.js primero, y el Browser después.
> Un problema muy común que me tocó resolver es el manejo de persistencia local. Tenía un servicio que guardaba el carrito en el `localStorage`. Al pre-renderizar en el servidor (Node), la app crasheaba porque `localStorage` no existe allí.
> La solución profesional no es llenar el código de `try/catch`, sino usar Inyección de Dependencias. Inyecto el token `PLATFORM_ID` de Angular y protejo las llamadas a Web APIs con la función `isPlatformBrowser()`. Así, el servidor renderiza el HTML ignorando la persistencia, y cuando la app se hidrata en el navegador del cliente, el servicio recupera el carrito normalmente."