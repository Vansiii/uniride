# HU-03 · Aprobación de miembros — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-10-14)` · Épica: E1 Organizaciones · Prioridad: Must · PHU: 3 · Sprint: S1
> Requisito del docente que cubre: **1 — multi-cliente**
> Amenazas que toca: **A-13**

## 1. Historia

**Como** administrador de organización
**quiero** aprobar o rechazar solicitudes de ingreso
**para** que solo personas legítimas usen la plataforma.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | solicitudes pendientes en la organización A | el administrador de A abre la lista | ve cada solicitud con nombre, correo y fecha, de la más antigua a la más reciente |
| CA-2 | una solicitud pendiente | el administrador la aprueba | la membresía queda **aprobada** y la persona recibe un correo avisándole |
| CA-3 | una solicitud pendiente | el administrador la rechaza (con un motivo opcional) | la membresía queda **rechazada** y la persona recibe un correo avisándole |
| CA-4 | cualquier decisión | se registra | queda guardada con autor, fecha, decisión y motivo |
| CA-5 | una solicitud ya decidida (por ejemplo, por otro administrador un instante antes) | un administrador intenta decidirla | el sistema la rechaza indicando que ya fue decidida; vale la primera decisión |
| CA-6 (ataque A-13) | un administrador de la organización A | intenta ver o decidir solicitudes de la organización B | el sistema lo rechaza |
| CA-7 | una persona con membresía rechazada | intenta usar viajes o billetera | el sistema no se lo permite |

## 3. Reglas de negocio

- RN-1: Solo los administradores de la organización deciden sus solicitudes.
- RN-2: Solo se deciden solicitudes **pendientes**.
- RN-3: El aviso a la persona se envía por correo.
- RN-4: En v1 el rechazo es definitivo: la persona rechazada no puede volver a solicitar ingreso a la misma organización.
- RN-5: Aprobar a un miembro no lo habilita todavía para viajar: además necesita identidad verificada (HU-08) y teléfono vinculado (HU-09).

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje (clave es-BO) |
|---|---|---|
| Solicitud ya decidida (CA-5) | Rechazo | `membresias.decision.ya_decidida` |
| Lista vacía | Mensaje de que no hay pendientes | `membresias.lista.vacia` |
| Falla el correo | La decisión queda guardada; el aviso se reintenta | — |
| Acceso a otra organización (CA-6) | Rechazo | `comun.errores.no_autorizado` |

## 5. Fuera de alcance

- Revertir una decisión o expulsar a un miembro aprobado.
- Notificaciones dentro de la app (solo correo).
- Búsqueda y filtros avanzados en la lista.

## 6. Dependencias

- HU-02, HU-05.

## 7. Definition of Done

Referencia: `SPECS/constitution.md` Art. 12.

- [ ] CA-1 a CA-7 cumplidos.
- [ ] Pruebas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Prueba de ataque CA-6 (A-13) en verde.
- [ ] PR revisado · CI en verde · 7 criterios de calidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Spec actualizada · aceptada por el PO.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-10-14 | Creación (borrador) | — |
| 2026-10-14 | Rechazo definitivo en v1 | Resuelve D-12, D-16, D-20, D-21 |
