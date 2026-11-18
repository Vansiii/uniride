# HU-33 · Métricas globales — Plan técnico

> Fase SDD: **Plan** (Diseño). Estado: `aprobado (2026-11-17, PO)` · Rama: `feat/HU-33-metricas-globales` (backend, web), **apilada sobre HU-32**
> Spec aprobada por el PO el 2026-11-17.

## 1. Módulos afectados

| Carpeta | Módulo / componente | Cambio |
|---|---|---|
| backend | `metricas` (creado en HU-32) | `plataforma-metricas.controller.ts`; el servicio reutiliza la misma consulta de HU-32 sin filtrar por organización y agrupando por ella |
| web | `paginas/Metricas.tsx`, `App.tsx` (`Protegida superAdmin`), menú | página nueva |
| mobile / contracts | — | sin cambios |

Reutiliza: `RolPlataformaGuard` (`@RolPlataforma('super_admin')`, ya usado en `organizaciones.controller.ts`), `prisma.comoSuperAdmin`, la consulta y definiciones de HU-32 (RN-2: una sola fuente de cálculo).

## 2. Cambios al modelo de datos

Ninguno. Las políticas RLS de `reservas`, `viajes` y `membresias` ya admiten `app.super_admin = 'true'`; no se cambian. La lectura va por `comoSuperAdmin` y devuelve solo agregados (RN-5). Sin migración. Requiere confirmación (§14): **no** (no se amplían permisos ni se escribe nada).

Resuelve la decisión abierta «`app.super_admin` en viajes»: el rol se usa solo en este endpoint de lectura, con consulta fija sin parámetros de organización; no se abre ninguna escritura.

Definiciones: igual que HU-32. Extra:
- **Organizaciones activas:** organizaciones con ≥ 1 membresía aprobada.
- **Fallidas o expiradas:** reservas en `verificacion_fallida` o `expirada` (estados de D-23) cuyo `actualizado_en` cae en el período.

## 3. Endpoints

| Método | Ruta | Rol | Firma | Request → Response | Errores |
|---|---|---|---|---|---|
| GET | `/plataforma/metricas` | super_admin | no | `?periodo=7d\|30d\|todo` → `{ periodo, global:{organizacionesActivas, miembrosActivos, viajesPagados, pasajeros, co2Kg, fallidasOExpiradas}, porOrganizacion:[{organizacionId, nombre, viajesPagados, miembrosActivos, co2Kg, sinActividad}] }` | 400, 401, 403 |

El total global es la suma de `porOrganizacion` calculada en el servidor desde las mismas filas (CA-3 por construcción y por prueba). Auditoría `plataforma.metricas.consultadas`. Swagger: [ ]

## 4. Pantallas

| Cliente | Pantalla | Pasos | Claves i18n |
|---|---|---|---|
| web | Métricas (`/plataforma/metricas`, solo super admin) | selector de período; 6 tarjetas globales; tabla por organización ordenable (orden en el cliente) con marca «Sin actividad» | `plataforma.metricas.{titulo,periodo.*,sin_actividad,vacio,error,...}` |

## 5. Diagramas UML

- [ ] Secuencia: super admin consulta métricas. [ ] Casos de uso: «Ver métricas globales».

## 6. Estrategia de pruebas

| Criterio / amenaza | Tipo | Archivo |
|---|---|---|
| CA-1, CA-2, CA-4, CA-5, CA-9 | integración con 2 organizaciones | `backend/test/metricas/plataforma.e2e-spec.ts` |
| CA-3 | integración: `global` = suma de `porOrganizacion`; cada organización coincide con su HU-32 | ídem |
| **A-13** (CA-6) | ataque: admin de organización → 403 en `/plataforma/metricas` | `test/ataques/a-13-metricas-globales.e2e-spec.ts` |
| **A-08** (CA-7) | ataque: miembro común / sin sesión | ídem |
| CA-8 | unitaria: la respuesta no contiene ids de personas ni correos | `plataforma-metricas.service.spec.ts` |
| Pantalla | Vitest (orden de tabla, vacío) | `web/src/paginas/Metricas.test.tsx` |

## 7. Riesgos

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| Se retrasa HU-32 y esta queda bloqueada | Media | Medio | Se implementa en el mismo PR de backend si HU-32 no está fusionada |
| Lectura global con rol de plataforma | Baja | Alto | Consulta fija, sin escritura, prueba de ataque y auditoría |

## 8. Tareas propuestas

| Tarea | Horas | Responsable |
|---|---|---|
| Backend: agrupar por organización sobre la consulta de HU-32, controlador, Swagger | 3 | por asignar |
| Backend: pruebas e2e y de ataque | 2 | por asignar |
| Web: página y tabla ordenable, textos | 3 | por asignar |
| Verificar y PR | 1 | por asignar |
