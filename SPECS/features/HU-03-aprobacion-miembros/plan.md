# HU-03 · Aprobación de miembros — Plan técnico

> Fase SDD: **Plan** (Diseño). Cómo se construye lo que dice `spec.md`.
> Estado: `aprobado (2026-10-14)` · Rama: `feat/HU-03-aprobacion-miembros`
> **Orden en S1: 5.ª.**

## 1. Módulos afectados

| Carpeta | Módulo / componente | Cambio |
|---|---|---|
| backend | `membresias` | Nuevo módulo: listar pendientes y decidir |
| backend | `notificaciones` | Plantillas `membresia_aprobada` y `membresia_rechazada` (por la cola) |
| web | `src/paginas/admin/Solicitudes` | Nuevo |

Reutiliza: `OrganizacionGuard` y `RolOrganizacionGuard` (HU-02), cola de correos (HU-01), `AuditoriaService` (HU-06).

## 2. Cambios al modelo de datos

Sin tablas nuevas: `membresias` ya tiene `estado`, `decidido_por`, `decidido_en` y `motivo` (HU-01). Sin migración.

## 3. Endpoints

| Método | Ruta | Rol | Request → Response | Errores (`codigo`) |
|---|---|---|---|---|
| GET | `/api/v1/organizaciones/{id}/membresias?estado=pendiente` | admin. org | — → `[{ id, nombreCompleto, correoInstitucional, creadoEn }]`, de la más antigua a la más reciente | `NO_ENCONTRADO` 404 |
| POST | `/api/v1/membresias/{id}/decision` | admin. org | `{ decision: 'aprobar' \| 'rechazar', motivo? }` → `{ id, estado }` | `MEMBRESIA_YA_DECIDIDA` 409, `NO_ENCONTRADO` 404 |

Reglas de implementación:
- La decisión es un `UPDATE … WHERE id = ? AND estado = 'pendiente'` dentro de `enOrganizacion`. Si afecta 0 filas: si la membresía existe se responde `MEMBRESIA_YA_DECIDIDA`; si RLS la oculta (otra organización), `NO_ENCONTRADO` (CA-5, CA-6).
- En la misma transacción: auditoría (autor, fecha, decisión, motivo) y correo en la cola (CA-2, CA-3, CA-4). Si falla el correo, la decisión no se pierde: el worker reintenta.
- Al aprobar, si la persona no tiene `ultima_organizacion_id`, se fija esta organización.
- El rechazo es definitivo en v1: HU-07 lo respeta al intentar unirse otra vez.

Swagger actualizado: [ ]

## 4. Pantallas y voz

| Cliente | Pantalla | Pasos del flujo | Claves i18n nuevas |
|---|---|---|---|
| web | Solicitudes (tabla con Aprobar / Rechazar; diálogo con motivo opcional) | 1 | `membresias.lista.*`, `membresias.decision.*` |

Voz: no aplica (panel web; D-08 abierta).

## 5. Diagramas UML

- [ ] Estados: membresía `pendiente → aprobada | rechazada` (diagrama de estados del dominio).
- [ ] Casos de uso: "Decidir solicitud".

## 6. Estrategia de pruebas

| Criterio / amenaza | Tipo | Archivo de prueba |
|---|---|---|
| CA-1 lista ordenada | e2e | `backend/test/membresias/decision.e2e-spec.ts` |
| CA-2 / CA-3 aprobar y rechazar + correo en cola | e2e | mismo archivo |
| CA-4 auditoría | e2e | mismo archivo |
| CA-5 decisión concurrente (dos peticiones en paralelo) | e2e | mismo archivo |
| CA-6 A-13 | ataque e2e | `backend/test/ataques/a-13-membresias.e2e-spec.ts` |
| CA-7 un rechazado no accede a endpoints protegidos por `OrganizacionGuard` | e2e | `decision.e2e-spec.ts` |
| Pantalla | Vitest | `Solicitudes.test.tsx` |

## 7. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Un admin aprueba por error (no hay forma de revertir en v1) | Media | Bajo | Diálogo de confirmación; queda auditado |

Dependencias nuevas: ninguna.

## 8. Tareas propuestas (se copian a backlog.md al aprobar)

| Tarea | Horas | Responsable |
|---|---|---|
| Módulo `membresias`: listar y decidir (actualización condicional, auditoría, correo) | 4 | |
| Web: pantalla Solicitudes | 4 | |
| Pruebas (CA-1 a CA-7, ataque A-13, concurrencia) | 3 | |
| **Total** | **11** | |
