# HU-21 · Calificación mutua — Plan técnico

> Fase SDD: **Plan** (Diseño). Estado: `aprobado (2026-11-17, PO)` · Rama: `feat/HU-21-calificacion-mutua` (backend, mobile)
> Spec aprobada por el PO el 2026-11-17.

## 1. Módulos afectados

| Carpeta | Módulo / componente | Cambio |
|---|---|---|
| backend | `calificaciones` (módulo nuevo) | controlador, servicio, DTOs |
| backend | `viajes/viajes.service.ts` (~l. 361, `calificacionPromedio: null`) | lee el promedio público (CA-6) |
| mobile | `app/calificar/[reservaId].tsx` (pantalla nueva), `TarjetaMiViaje`/detalle de reserva, resultados de búsqueda | botón «Calificar», estrellas, insignia con promedio |
| web / contracts | — | sin cambios |

Reutiliza: `FirmaDispositivoGuard` NO (no es acción de dinero; JWT basta), `OrganizacionGuard`, `enOrganizacion`, `AuditoriaService`, `BloqueosService` (pares de HU-25), `Boton`, `Mensajes`, `useAccionSensible` no aplica. El campo `calificacionPromedio` ya existe en la API de búsqueda (D-17).

## 2. Cambios al modelo de datos

| Tabla | Cambio | Restricciones | ¿`organizacion_id` + RLS? |
|---|---|---|---|
| `calificaciones` (nueva) | `id`, `organizacion_id`, `reserva_id`, `autor_id`, `destinatario_id`, `estrellas`, `comentario`, `creado_en` | `UNIQUE(reserva_id, autor_id)` (CA-3, CA-12); `CHECK estrellas BETWEEN 1 AND 5`; `CHECK length(comentario) <= 140`; FK a reserva; solo INSERT para `uniride_app` (RN-5) | **Sí**, RLS por organización (A-13) |

Promedio público por persona en todas sus organizaciones (RN-4): función SQL `promedio_calificacion(usuario uuid)` `SECURITY DEFINER` que devuelve solo `(promedio, cantidad)`, con `search_path` fijo y `EXECUTE` solo para `uniride_app`. Excluye pares con bloqueo `par` vigente o de los 7 días previos al pago (RN-7). Así no se abre lectura cruzada de la tabla ni se cambia ninguna política existente.

Migración: `020_calificaciones` (solo agrega). Cambia RLS existente: **no**. Nueva política RLS y función `SECURITY DEFINER`: **requieren confirmación humana** (`AGENTS.md` §14) por ser aislamiento entre organizaciones.

## 3. Endpoints

| Método | Ruta | Rol | Firma / biometría | Request → Response | Errores |
|---|---|---|---|---|---|
| POST | `/reservas/:id/calificaciones` | participante de la reserva (pasajero, o conductor del viaje) | JWT; sin biometría | `{ destinatarioId?, estrellas, comentario? }` → 201 `{ id }` | 403 `NO_PARTICIPANTE`, 409 `YA_CALIFICADA`, 409 `PLAZO_VENCIDO`, 409 `RESERVA_NO_PAGADA`, 400 |
| GET | `/reservas/:id/calificaciones` | participante | JWT | → `{ puedoCalificar, plazoHasta, recibida? }`; `recibida` solo si ya califiqué o venció el plazo (CA-7) | 403, 404 |

El destinatario lo deduce el servidor (pasajero→conductor; conductor→pasajero indicado, que debe tener reserva pagada en ese viaje); nunca se confía en el cliente. La fecha de pago es el movimiento `liberacion_viaje` (igual que HU-32). Idempotencia por `UNIQUE`: dos envíos a la vez dejan una fila, el segundo recibe `YA_CALIFICADA`. Auditoría `calificacion.creada`. Swagger: [ ]

## 4. Pantallas y voz

| Cliente | Pantalla | Pasos | Claves i18n nuevas |
|---|---|---|---|
| mobile | Calificar | estrellas 1–5 (botones de 48 px con etiqueta accesible), comentario opcional con contador, «Enviar» | `calificaciones.crear.{titulo,estrellas,comentario,enviar,gracias,ya_calificada,plazo_vencido,no_pagada,comentario_largo,error}` |
| mobile | Búsqueda / detalle | promedio «4,6 · 12 calificaciones» con ≥ 3; si no, «Nuevo» | `calificaciones.promedio.*` |

Sin comandos de voz nuevos.

## 5. Diagramas UML

- [ ] Secuencia: pasajero califica (app → API → tabla con RLS → auditoría).
- [ ] Clases: `Calificacion` ↔ `Reserva`, `Usuario`.
- [ ] Casos de uso y paquetes: módulo `calificaciones`.

## 6. Estrategia de pruebas

| Criterio / amenaza | Tipo | Archivo |
|---|---|---|
| CA-1, CA-2 | integración | `backend/test/calificaciones/calificar.e2e-spec.ts` |
| CA-3, CA-12 | integración: dos POST en paralelo → una fila | ídem |
| CA-4 | borde: día 7 (acepta) y día 7 + 1 s (rechaza) | `calificaciones.service.spec.ts` |
| CA-5 | integración: cada estado distinto de `pagada` | e2e |
| CA-6 | integración: 2 calificaciones → «Nuevo»; 3 → promedio 1 decimal | e2e |
| CA-7 | integración: calificación ciega | e2e |
| **A-13** (CA-8) | ataque: usuario de otra organización o no participante → 403, sin fila | `test/ataques/a-13-calificaciones.e2e-spec.ts` |
| **A-08** (CA-9) | ataque: sin sesión / sin ser parte | `test/ataques/a-08-calificaciones.e2e-spec.ts` |
| **A-10** (CA-10) | ataque: par bloqueado se califica 5★ ×10 → promedio público no cambia | `test/ataques/a-10-calificaciones.e2e-spec.ts` |
| CA-11 | unitaria: respuestas públicas no traen autor ni comentario | spec del servicio |
| Pantalla | Jest + Testing Library | `mobile/src/__tests__/calificar.test.tsx` |

## 7. Riesgos

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| Función `SECURITY DEFINER` mal acotada abre lectura cruzada | Baja | Alto | Devuelve solo agregado, `search_path` fijo, prueba de ataque A-13 |
| 4 pruebas de ataque + migración con tiempo corto | Media | Medio | Se implementa tercero en el orden; si falla el tiempo, se entrega sin CA-10 y se declara |
| Detalle de reserva del conductor no lista pasajeros | Media | Bajo | El conductor califica desde el viaje; si no cabe, solo califica el pasajero (declararlo) |

## 8. Tareas propuestas

| Tarea | Horas | Responsable |
|---|---|---|
| Migración 020 (tabla, RLS, función) y Prisma | 2 | por asignar |
| Backend: servicio, controlador, reglas de plazo y ciega, promedio en búsqueda | 4 | por asignar |
| Backend: pruebas e2e y de ataque A-08 / A-10 / A-13 | 3 | por asignar |
| Mobile: pantalla, botón en Mis viajes, insignia con promedio | 4 | por asignar |
| Verificar y PR | 1 | por asignar |
