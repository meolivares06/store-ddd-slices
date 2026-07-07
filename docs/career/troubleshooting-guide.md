# Guía de Resolución de Problemas (Troubleshooting)

Este documento registra los problemas reales y complejos que enfrentamos durante el desarrollo y despliegue del proyecto `store-ddd-slices`, y cómo los resolvimos aplicando ingeniería de software. 

*Tip para entrevistas: A los reclutadores técnicos les encanta la pregunta "Contame de un problema difícil que hayas resuelto recientemente". Usa estos casos.*

## Problema 1: CloudFront devuelve error 403 (Access Denied) al hacer deploy de Angular

**Contexto:** 
Configuramos un pipeline CI/CD con GitHub Actions para hacer el build de Angular y subirlo a un bucket S3 privado, expuesto a través de CloudFront usando OAC (Origin Access Control).

**Síntoma:** 
El pipeline de GitHub Actions corría en verde (éxito), pero al entrar a la URL de CloudFront, la pantalla mostraba un error XML de AWS: `<AccessDenied>`.

**Proceso de Diagnóstico (Troubleshooting):**
1. **Revisión de Permisos:** Verificamos que CloudFront tuviera el OAC configurado y que el Bucket Policy de S3 permitiera explícitamente la lectura desde ese origen de CloudFront. Todo estaba correcto.
2. **Revisión de Enrutamiento:** Verificamos que el "Default Root Object" de CloudFront y las páginas de error personalizadas (404/403) apuntaran a `/index.html`.
3. **Inspección de Artefactos:** Fuimos físicamente al bucket de S3 a ver qué archivos había subido GitHub Actions. 

**Causa Raíz (Root Cause):**
Descubrimos que no existía el archivo `index.html`. En su lugar, había un `index.csr.html` y carpetas con rutas prerenderizadas. La causa fue que Angular 17+ estaba configurado en el `angular.json` con `outputMode: "server"` (Server-Side Rendering activado). Al compilar para SSR, Angular asume que un servidor Node procesará la raíz, por lo que genera un "Client-Side Rendering fallback" (`index.csr.html`). CloudFront buscaba `index.html` y S3 rechazaba la petición al no encontrarlo.

**Solución:**
Como la arquitectura objetivo era "Static Hosting" en S3 (que no tiene cómputo para correr Node.js), la decisión arquitectónica correcta fue alinear el código con la infraestructura. 
Modificamos el `angular.json`, eliminando las propiedades `server`, `ssr` y `outputMode`. Al volver a compilar, Angular generó una Single Page Application (SPA) estática con su `index.html` clásico, el cual S3 y CloudFront sirvieron perfectamente.

---

## Problema 2: Falso Positivo (Regresión) en Pipeline CI/CD por Tests Desactualizados

**Contexto:**
Durante la validación de la feature `evolve-products-domain` usando Spec-Driven Development (SDD), la verificación falló indicando que el Value Object `Price` no estaba defaulteando a Reales Brasileños (`BRL`).

**Síntoma:**
El subagente de verificación automática detectó un fallo en las reglas de negocio.

**Causa Raíz:**
Al auditar el código de producción (`price.value-object.ts`), descubrimos que la lógica de negocio **sí** estaba correctamente implementada y el default era `BRL`. Sin embargo, el archivo de pruebas unitarias (`price.value-object.spec.ts`) había quedado desactualizado (Stale Tests); los tests seguían inyectando y esperando que la moneda por defecto fuera `USD` y que el string formateado devolviera `'$ 15.99'` en lugar de `'15.99 BRL'`. 

**Solución:**
Refactorizamos los tests unitarios para reflejar las nuevas reglas de dominio (BRL). Esto enseñó una valiosa lección sobre la importancia de mantener la suite de pruebas sincronizada con la evolución del dominio; de lo contrario, los pipelines de CI (Continuous Integration) se bloquean por "falsas alarmas" o deuda técnica en la capa de testing.
