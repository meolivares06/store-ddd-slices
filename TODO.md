# Roadmap y Objetivos del Proyecto

Este documento sirve como bitácora para planificar los próximos pasos del proyecto `store-ddd-slices` y para registrar los hitos técnicos que suman peso al Currículum Vitae (CV) para posiciones de Senior/Arquitecto Frontend.

## 📝 Tareas Pendientes (TODO)

- [ ] **1. UI/UX:** Agregar las imágenes en las cards de los productos (vinculando el modelo de dominio con la vista).
- [ ] **2. Refactor Arquitectónico:** Verificar exhaustivamente si la arquitectura del Mapper y el Adapter está implementada de la forma correcta y óptima para DDD.
- [ ] **3. Design System Ninja:** Crear una guía/documentación interna sobre cómo aplicar estilos. 
  - *Objetivos de aprendizaje:* Valorar cómo implementar una guía de diseño real, Atomic Design, Design Tokens, cómo interpretar una paleta de colores en el código (Tailwind config), y volverse experto en tomar un diseño UI profesional y llevarlo a código de forma escalable.
- [ ] **4. Resiliencia y Manejo de Errores:** Implementar interceptores de errores globales.
  - *Referencia:* [Angular Global Error Handler](https://heckerssoftware.com/blog/angular-global-error-handler-nx-monorepo/).

---

## 🏆 Logros para el CV (CV Highlights)

*Regla: Cada vez que implementemos una solución que aporte valor real a un perfil Senior, se documentará aquí para usar en entrevistas.*

- [x] **DevOps & Cloud Infrastructure:** Creación de un pipeline de despliegue continuo (CD) con GitHub Actions hacia AWS. Alojamiento de Single Page Application (SPA) en S3 distribuyéndola globalmente con CloudFront. Seguridad implementada con OAC (Origin Access Control) e IAM de menor privilegio.
- [x] **Arquitectura DDD (Domain-Driven Design):** Separación de la lógica de negocio en Bounded Contexts. Implementación de *Value Objects* inmutables (ej. `Price`) y diseño de un *Event Bus* (Domain Events) 100% *stateless* (sin estado) usando RxJS para desacoplamiento estricto entre dominios.
- [x] **Angular Moderno (v22+):** Transición de `providedIn: 'root'` al decorador moderno `@Service`. Implementación híbrida de reactividad: Signals para el manejo del estado (Queries) y RxJS puro para flujos de eventos discretos.
- [ ] **5. Refactor Bounded Context Isolation:** Replace direct injection of CartService in Products domain with the new EventBus to achieve pure DDD decoupling.
