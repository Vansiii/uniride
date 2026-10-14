# HU-02 · Reglas de afiliación — Plan técnico

> Fase SDD: **Plan** (Diseño). Cómo se construye lo que dice `spec.md`.
> Estado: `aprobado (2026-10-14)` · Rama: `feat/HU-02-reglas-afiliacion`
> **Orden en S1: 3.ª.** Construye los guards de organización que reutilizan HU-03, HU-07 y HU-11.

## 1. Módulos afectados

| Carpeta | Módulo / componente | Cambio |
|---|---|---|
| backend | `comun` | `OrganizacionGuard`: exige que la organización del token (`org`) tenga una membresía `aprobada` del usuario, deja `req.organizacionId` y ejecuta el handler dentro de `enOrganizacion`. `RolOrganizacionGuard` + `@RolOrganizacion('admin_organizacion')` |
| backend | `organizaciones` | Leer y guardar las reglas de afiliación |
| web | `src/paginas/admin/Afiliacion` | Nuevo |

Reutiliza: `PrismaService.enOrganizacion` (HU-01), `AuditoriaService` (HU-06).

## 2. Cambios al modelo de datos

| Tabla | Cambio | Restricciones | ¿`organizacion_id` + RLS? |
|---|---|---|---|
| `dominios_organizacion` | Nueva: organizacion_id, dominio (minúsculas, sin `@`) | `UNIQUE(dominio)` | Sí |
| `organizaciones` | Sin cambios (`modo_aprobacion` ya existe, `manual` por defecto) | — | — |
| Función SQL | `organizacion_por_dominio(p_dominio text) RETURNS uuid`, `SECURITY DEFINER`, solo para organizaciones `activa` | Devuelve solo el id | La usarán HU-05 y HU-07 sin saltarse RLS |

Migración: `003_dominios`. No borra datos.

## 3. Endpoints

| Método | Ruta | Rol | Request → Response | Errores (`codigo`) |
|---|---|---|---|---|
| GET | `/api/v1/organizaciones/{id}/afiliacion` | admin. org | — → `{ dominios[], modoAprobacion }` | `NO_ENCONTRADO` 404 |
| PUT | `/api/v1/organizaciones/{id}/afiliacion` | admin. org | `{ dominios[], modoAprobacion }` → `{ dominios[], modoAprobacion }` | `DOMINIO_INVALIDO` 400, `DOMINIO_NO_DISPONIBLE` 409, `MINIMO_UN_DOMINIO` 400 |

Reglas de implementación:
- Si `{id}` no es la organización activa del token, se responde 404 (no revela si existe).
- Se reemplaza la lista completa en una transacción: se normalizan los dominios (minúsculas, sin `@` ni espacios, sin repetidos), se validan el formato (nombre de host con al menos un punto) y la lista `DOMINIOS_PUBLICOS` (gmail.com, hotmail.com, outlook.com, yahoo.com, icloud.com), y la violación de `UNIQUE(dominio)` se traduce a `DOMINIO_NO_DISPONIBLE`.
- La auditoría guarda en `detalle` los valores anterior y nuevo (CA-8).

Swagger actualizado: [ ]

## 4. Pantallas y voz

| Cliente | Pantalla | Pasos del flujo | Claves i18n nuevas |
|---|---|---|---|
| web | Afiliación (lista de dominios con agregar/quitar, selector de modo, Guardar) | 1 | `organizaciones.afiliacion.*` |

Voz: no aplica (panel web; D-08 abierta).

## 5. Diagramas UML

- [ ] Clases: `DominioOrganizacion`.
- [ ] Secuencia: no aporta (CRUD simple).

## 6. Estrategia de pruebas

| Criterio / amenaza | Tipo | Archivo de prueba |
|---|---|---|
| CA-1 registrar dominios | e2e | `backend/test/organizaciones/afiliacion.e2e-spec.ts` |
| CA-2 dominio de otra organización (también en paralelo) | e2e | mismo archivo |
| CA-3 dominio público o inválido | unitaria + e2e | `afiliacion.service.spec.ts` |
| CA-4 / CA-5 efecto del modo de aprobación | e2e (se completa con HU-05) | `registro.e2e-spec.ts` |
| CA-6 mínimo un dominio | e2e | `afiliacion.e2e-spec.ts` |
| CA-7 A-13 | ataque e2e | `backend/test/ataques/a-13-afiliacion.e2e-spec.ts` |
| CA-8 auditoría con valores anterior y nuevo | e2e | `afiliacion.e2e-spec.ts` |
| Pantalla | Vitest | `Afiliacion.test.tsx` |

## 7. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| La función `SECURITY DEFINER` expone más de lo debido | Baja | Medio | Devuelve solo el id; prueba que no lista ni revela otros datos |

Dependencias nuevas: ninguna.

## 8. Tareas propuestas (se copian a backlog.md al aprobar)

| Tarea | Horas | Responsable |
|---|---|---|
| Migración `003`: dominios_organizacion y función `organizacion_por_dominio` | 2 | |
| `OrganizacionGuard` y `RolOrganizacionGuard` | 2 | |
| Servicio y controlador de afiliación con validaciones y auditoría | 3 | |
| Web: pantalla Afiliación | 3 | |
| Pruebas (CA-1 a CA-8, ataque A-13) | 3 | |
| **Total** | **13** | |
