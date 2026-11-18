# HU-33 · Métricas globales — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-17)` · Épica: E7 Administración · Prioridad: Could · PHU: 3 · Sprint: S4 (hasta vie 20/11/2026)
> Requisito del docente que cubre: **1 — Multi-organización** (vista de toda la plataforma)
> Amenazas que toca: **A-13** (aislamiento), **A-08** (API sin la app)
> Orden: **después de HU-32** (reutiliza su cálculo).

## 1. Historia

**Como** super administrador de UniRide
**quiero** ver métricas de toda la plataforma y de cada organización
**para** supervisar su uso y detectar organizaciones sin actividad.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | un super administrador | abre «Métricas» en el panel web | ve las cifras globales: organizaciones activas, miembros activos, viajes pagados, pasajeros transportados, CO₂ evitado (kg) y reservas fallidas o expiradas |
| CA-2 | la misma pantalla | mira la tabla | ve una fila por organización con sus viajes pagados, miembros activos y CO₂ evitado, ordenable por cada columna |
| CA-3 | el total global | se compara con la suma de la tabla | **coincide** (cada reserva *Pagada* cuenta en una sola organización) |
| CA-4 | elige «últimos 7 días», «últimos 30 días» o «todo» | cambia el período | cifras y tabla se recalculan; por defecto «últimos 30 días» |
| CA-5 | una organización sin actividad en el período | se consulta | aparece con 0 y se marca «Sin actividad» |
| CA-6 | **ataque A-13:** un administrador de organización | llama a la API de métricas globales | se rechaza (403); solo ve lo suyo en HU-32 |
| CA-7 | **ataque A-08:** sin sesión, o con sesión de miembro común | llama a la API | se rechaza (401 / 403) |
| CA-8 | las métricas | se leen | son solo cifras agregadas: ninguna persona, correo, ni viaje individual |
| CA-9 | no hay organizaciones o no hay viajes | abre la pantalla | cifras en 0 y «Aún no hay actividad en la plataforma.» |
| CA-10 | la consulta | se hace | queda un registro de auditoría con autor y fecha |

## 3. Reglas de negocio

- RN-1: Solo el rol **super administrador** accede.
- RN-2: **Mismas definiciones que HU-32** (solo reservas *Pagadas*, factor 0,12 kg/km, período por fecha de pago, límites inclusivos). Una sola fuente de cálculo para que las cifras de una organización coincidan en HU-32 y HU-33.
- RN-3: «Organizaciones activas»: las que tienen al menos un miembro aprobado.
- RN-4: «Fallidas o expiradas»: reservas en *Verificación fallida* o *Expirado* en el período.
- RN-5: La lectura global es una excepción controlada al aislamiento por organización (`app.super_admin`); no puede escribir nada y solo devuelve agregados.
- RN-6: Mismos textos es-BO y estilo del panel de HU-32.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje (clave es-BO) |
|---|---|---|
| Sin actividad (CA-9) | Ceros y texto de vacío | `plataforma.metricas.vacio` |
| Falla la API | «Reintentar»; no cifras a medias | `plataforma.metricas.error` |
| Sin permiso (CA-6, CA-7) | 403 / 401 | `comun.errores.sin_permiso` |
| Período inválido | 400 | `comun.errores.parametro_invalido` |

## 5. Fuera de alcance de esta HU

- Gráficos, series por día, exportar y comparar períodos.
- Dinero, saldos y tarifas de la plataforma.
- Alertas de fraude de otras organizaciones.
- Métricas en tiempo real o en la app móvil.

## 6. Dependencias

- HU-32 (cálculo y definiciones), HU-24 (reservas *Pagadas*), HU-01 (rol super administrador).
- Decisiones abiertas: «`app.super_admin` en viajes» (HEARTBEAT): esta HU lee agregados con ese rol; el plan debe resolverlo sin ampliar permisos de escritura (`AGENTS.md` §14).

## 7. Definition of Done

- [ ] Todos los criterios cumplidos.
- [ ] Pruebas del plan en verde, con dos organizaciones y suma global = suma de la tabla; cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque A-13 y A-08 en verde.
- [ ] PR revisado; CI en verde en `backend/` y `web/`.
- [ ] Documentada en Swagger; spec refleja lo construido.
- [ ] Aceptada por el PO.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-17 | Creación (borrador) | pendiente |
| 2026-11-17 | Aprobada por el PO | pendiente |
