# HU-32 · Panel de organización (reducido) — Plan técnico

> Fase SDD: **Plan** (Diseño). Estado: `aprobado (2026-11-17, PO)` · Rama: `feat/HU-32-panel-organizacion` (backend, web)
> Spec aprobada por el PO el 2026-11-17. **Orden: antes de HU-33**, que reutiliza este cálculo.

## 1. Módulos afectados

| Carpeta | Módulo / componente | Cambio |
|---|---|---|
| backend | `metricas` (módulo nuevo) | `metricas.sql.ts` (consulta única compartida con HU-33), `metricas.service.ts`, `organizacion-metricas.controller.ts` |
| web | `paginas/admin/Resumen.tsx`, `App.tsx`, `api/cliente.ts`, menú | página nueva |
| mobile / contracts | — | sin cambios |

Reutiliza: `OrganizacionGuard` + `RolOrganizacion`, `enOrganizacion`, `AuditoriaService`.

## 2. Cambios al modelo de datos

Ninguno. Todo se calcula con consultas de agregación sobre tablas existentes; con RLS, `enOrganizacion` limita a la organización activa (A-13).

Definiciones (RN-2…RN-5 de la spec):
- **Reserva pagada y su fecha:** `reservas.estado = 'pagada'`; la fecha de pago es el `creadoEn` del movimiento `liberacion_viaje` de esa reserva (`movimientos_billetera.reserva_id`). No se usa `reservas.actualizado_en`: puede cambiar por otros motivos (p. ej. HU-25 toca la reserva).
- **Distancia:** línea recta (Haversine, en SQL) entre origen y destino del viaje, porque el viaje no guarda la ruta. La spec lo permite (RN-4); la cifra se rotula «Estimado».
- **CO₂ (kg)** = Σ por reserva pagada `distancia_km × 0,12`, redondeado a 1 decimal al final (no por fila).
- **Miembros activos:** `membresias.estado = 'aprobada'` de la organización.
- **Viajes pagados:** `count(distinct viaje_id)` de reservas pagadas en el período; **pasajeros:** `count(*)` de esas reservas.

Migración: ninguna. Requiere confirmación (§14): **no**. Sin dependencias nuevas.

## 3. Endpoints

| Método | Ruta | Rol | Firma | Request → Response | Errores |
|---|---|---|---|---|---|
| GET | `/organizacion/resumen` | admin_organizacion | no | `?periodo=7d\|30d\|todo` (def. `30d`) → `{ periodo, viajesPagados, miembrosActivos, pasajeros, co2Kg }` | 400 `PARAMETRO_INVALIDO`, 401, 403 |

La organización sale del token y de la membresía, nunca del cuerpo ni de la URL (CA-7). Registra `organizacion.resumen.consultado` en auditoría. Swagger: [ ]

## 4. Pantallas

| Cliente | Pantalla | Pasos | Claves i18n |
|---|---|---|---|
| web | Resumen (`/organizacion/resumen`) | selector de período (3 chips) y 4 tarjetas con cifra; estado vacío «Aún no hay viajes pagados.» | `organizacion.resumen.{titulo,periodo.*,viajes,miembros,pasajeros,co2,estimado,vacio,error}` |

## 5. Diagramas UML

- [ ] Secuencia: administrador pide el resumen.
- [ ] Paquetes: nuevo módulo `metricas`. Casos de uso: «Ver resumen de organización».

## 6. Estrategia de pruebas

| Criterio / amenaza | Tipo | Archivo |
|---|---|---|
| CA-2, CA-3, CA-9 | integración con 2 organizaciones sembradas | `backend/test/metricas/resumen.e2e-spec.ts` |
| CA-4 | unitaria: 2 reservas con distancias conocidas (p. ej. 10 km y 5 km → 1,8 kg) y borde de redondeo | `metricas.service.spec.ts` |
| CA-5 | integración: reservas en los bordes de 7 y 30 días, límites inclusivos | ídem |
| CA-6 | integración (organización vacía → ceros) | ídem |
| **A-13** (CA-7) | ataque: admin de A, con `?organizacion=B` o token de B, ve 0 de B | `test/ataques/a-13-metricas.e2e-spec.ts` |
| **A-08** (CA-8) | ataque: miembro común / sin sesión | `test/ataques/a-08-metricas.e2e-spec.ts` |
| Pantalla | Vitest | `web/src/paginas/admin/Resumen.test.tsx` |

## 7. Riesgos

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| Fecha de pago sin movimiento (reservas viejas) | Baja | Medio | Las reservas pagadas siempre pasan por `liberacion_viaje`; prueba con datos de HU-24 |
| Haversine en SQL con coordenadas Decimal | Baja | Bajo | `::float8` y prueba con distancias conocidas |
| Consulta lenta | Baja | Bajo | Una sola consulta agregada; PB-06 la puede medir |

## 8. Tareas propuestas

| Tarea | Horas | Responsable |
|---|---|---|
| Backend: consulta de agregación (compartida con HU-33) + servicio + controlador + Swagger | 4 | por asignar |
| Backend: pruebas unitarias, e2e y de ataque | 2 | por asignar |
| Web: página, ruta, textos | 2 | por asignar |
| Verificar y PR | 1 | por asignar |
