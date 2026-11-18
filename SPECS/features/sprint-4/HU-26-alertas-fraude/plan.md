# HU-26 · Alertas de fraude (solo lectura) — Plan técnico

> Fase SDD: **Plan** (Diseño). Estado: `aprobado (2026-11-17, PO)` · Rama: `feat/HU-26-alertas-fraude` (backend, web)
> Spec aprobada por el PO el 2026-11-17.

## 1. Módulos afectados

| Carpeta | Módulo / componente | Cambio |
|---|---|---|
| backend | `fraude` | `alertas.controller.ts` + `alertas.service.ts` (nuevos, solo lectura) |
| web | `paginas/admin/AlertasFraude.tsx`, `App.tsx`, `api/cliente.ts`, `componentes/Estructura*` | página nueva, ruta y enlace de menú |
| mobile / contracts | — | sin cambios |

Reutiliza: `OrganizacionGuard` + `RolOrganizacion('admin_organizacion')` (como `membresias.controller.ts`), `prisma.enOrganizacion`, `AuditoriaService`, `Protegida deOrganizacion` y los estados de `componentes/Estados` del web. Las alertas ya existen: HU-25 las escribe en `registros_auditoria` (`fraude.alerta`, `fraude.bloqueo`) con `organizacion_id`, cifras y sin coordenadas.

## 2. Cambios al modelo de datos

Ninguno. La política de lectura de `registros_auditoria` ya filtra por `app.organizacion_id` (RLS, A-13); al consultar dentro de `enOrganizacion` la base misma impide ver otra organización. Sin migración, sin cambio de RLS.

Bloqueos vigentes: se obtienen de los registros `fraude.bloqueo` de la organización cuyo `detalle.hasta` > ahora, no de `bloqueos_preventivos` (esa tabla es de la persona y sin RLS; leerla mostraría bloqueos originados en otra organización, RN-3).

## 3. Endpoints

| Método | Ruta | Rol | Firma / biometría | Request → Response | Errores |
|---|---|---|---|---|---|
| GET | `/organizacion/alertas-fraude` | admin_organizacion | no (JWT, como Solicitudes) | `?patron=&limite=20&antes=<iso>` → `{ alertas: [{id, creadoEn, patron, personas:[{nombre, rol}], cantidad?, distanciaM?, minutos?, bloqueoHasta?}], siguiente }` | 401, 403 `NO_AUTORIZADO`, 400 parámetro |
| GET | `/organizacion/bloqueos-vigentes` | admin_organizacion | no | → `{ bloqueos: [{id, tipo, patron, personas, hasta}] }` | 401, 403 |

Paginación por cursor (`antes`), `limite` máx. 100 (RN-5). Nombres: se resuelven con una consulta a `usuarios` por los ids guardados en `detalle.personas` (solo `nombreCompleto`; nunca correo ni carnet, RN-4). Cada consulta registra `fraude.alertas.consultadas` en auditoría (CA-10). No hay POST/PUT/DELETE (CA-8). Swagger actualizado: [ ]

## 4. Pantallas

| Cliente | Pantalla | Pasos | Claves i18n nuevas |
|---|---|---|---|
| web | Alertas de fraude (`/organizacion/alertas`) | tabla de bloqueos vigentes arriba; lista de alertas abajo, filtro por patrón, «Cargar más» | `fraude.alertas.{titulo,vacio,error,persona_sin_nombre,patron.*,bloqueo_hasta,cargar_mas}` |

Sin voz.

## 5. Diagramas UML

- [ ] Secuencia: administrador consulta alertas (web → API → auditoría con RLS).
- [ ] Casos de uso: agregar «Revisar alertas de fraude» al administrador de organización.
- [ ] Paquetes: `fraude` expone `AlertasController`.

## 6. Estrategia de pruebas

| Criterio / amenaza | Tipo | Archivo de prueba |
|---|---|---|
| CA-1, CA-2, CA-3, CA-5 | integración (servicio con datos sembrados por HU-25) | `backend/test/fraude/alertas.e2e-spec.ts` |
| CA-4 | integración (25 alertas → 20 + cursor) | ídem |
| CA-9 | unitaria: la respuesta no tiene `lat`, `lng` ni correo | `alertas.service.spec.ts` |
| CA-10 | integración | ídem |
| **A-13** (CA-6) | ataque: admin de A pide con token/organización de B; sembrar alerta en B y comprobar 0 filas | `backend/test/ataques/a-13-alertas.e2e-spec.ts` |
| **A-08** (CA-7, CA-8) | ataque: miembro común y sin sesión → 403/401; `POST/PATCH/DELETE` → 404 | `backend/test/ataques/a-08-alertas.e2e-spec.ts` |
| Pantalla (CA-1…CA-5) | Vitest + Testing Library | `web/src/paginas/admin/AlertasFraude.test.tsx` |

Metas de rendimiento: no aplica. Las dos pruebas de ataque se agregan a la suite PB-05 (`scripts/amenazas.json`).

## 7. Riesgos

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| El detalle de las alertas antiguas no trae algún campo | Baja | Bajo | La pantalla muestra solo lo que haya; prueba con alertas reales de HU-25 |
| Filtrar por `detalle->>'patron'` lento con muchos registros | Baja | Bajo | Hay `idx(organizacion_id)`; v1 sin índice nuevo (`ponytail:` si pasa de ~10 000 alertas, índice por `accion`, `creado_en`) |

Requiere confirmación humana (§14): **no** (sin migración ni cambios a RLS, contratos ni estados).

## 8. Tareas propuestas

| Tarea | Horas | Responsable |
|---|---|---|
| Backend: servicio y controlador de alertas y bloqueos vigentes + Swagger | 3 | por asignar |
| Backend: pruebas e2e y de ataque A-13 / A-08 | 2 | por asignar |
| Web: página, ruta, menú, textos es-BO | 3 | por asignar |
| Web: pruebas de la página | 1 | por asignar |
| Verificar (lint, formato, pruebas, build) y PR | 1 | por asignar |
