# HU-32 · Panel de organización (reducido) — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-17)` · Épica: E7 Administración · Prioridad: Should · PHU: 3 (reducida de 5) · Sprint: S4 (hasta vie 20/11/2026)
> Requisito del docente que cubre: **1 — Multi-organización** (cada organización ve solo lo suyo)
> Amenazas que toca: **A-13** (otra organización)

## 1. Historia

**Como** administrador de una organización
**quiero** ver cuántos viajes, personas y kilos de CO₂ evitados tiene mi organización
**para** medir el impacto de UniRide en mi comunidad.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | un administrador de la organización A | abre «Resumen» en el panel web | ve 4 cifras de A: viajes pagados, miembros activos, pasajeros transportados y CO₂ evitado en kg |
| CA-2 | la organización A con 3 reservas *Pagadas* | se consulta | «viajes pagados» cuenta los viajes distintos con al menos una reserva *Pagada*; «pasajeros transportados» cuenta las reservas *Pagadas* |
| CA-3 | miembros de A aprobados, pendientes y rechazados | se consulta | «miembros activos» cuenta solo los aprobados |
| CA-4 | una reserva *Pagada* con distancia de ruta conocida | se consulta | el CO₂ evitado suma, por reserva, `distancia_km × 0,12` kg (RN-3), con 1 decimal |
| CA-5 | el administrador elige «últimos 7 días», «últimos 30 días» o «todo» | cambia el período | las cifras se recalculan solo con reservas pagadas en ese período; por defecto «últimos 30 días» |
| CA-6 | una organización nueva sin viajes | abre el resumen | ve las 4 cifras en 0 y el texto «Aún no hay viajes pagados.» |
| CA-7 | **ataque A-13:** administrador de A | pide el resumen con el id de B o cambia el id en la petición | se rechaza; nunca ve cifras de B ni una mezcla |
| CA-8 | **ataque A-08:** miembro común o sin sesión | llama a la API del resumen | se rechaza (403 / 401) |
| CA-9 | una persona que pertenece a A y B | viaja en una reserva de A | la reserva cuenta solo en A, no en B |

## 3. Reglas de negocio

- RN-1: Solo el **administrador de organización** activo ve el resumen. El super administrador (HU-33) queda fuera.
- RN-2: Cuenta solo reservas en estado *Pagada*: el viaje ocurrió y se verificó. Canceladas, expiradas o fallidas no cuentan.
- RN-3: **Factor de CO₂:** 0,12 kg por pasajero y por kilómetro (valor de referencia de un auto compacto; propuesta del equipo, no lo fija ningún documento). Se muestra con la leyenda «Estimado».
- RN-4: La distancia es la de la ruta del viaje cuando existe; si no, la distancia en línea recta entre origen y destino. Un viaje sin ninguna de las dos no suma CO₂ pero sí cuenta como viaje.
- RN-5: El período se mide por la fecha de pago de la reserva; los límites son inclusivos.
- RN-6: Solo cifras agregadas: ninguna persona, nombre ni viaje individual aparece en el resumen.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje (clave es-BO) |
|---|---|---|
| Sin viajes (CA-6) | Cifras en 0 y texto de vacío | `organizacion.resumen.vacio` |
| Falla la API | Mensaje y «Reintentar»; no cifras a medias | `organizacion.resumen.error` |
| Organización de otro (CA-7) | 403 | `comun.errores.sin_permiso` |
| Período inválido en la API | 400 | `comun.errores.parametro_invalido` |

## 5. Fuera de alcance de esta HU

- Gráficos, series por día, exportar, ranking de conductores, lista de viajes (reducción de 5 a 3 PHU: solo 4 cifras).
- Métricas globales de la plataforma → HU-33 (Reserva).
- Dinero movido o saldo de la organización.
- Vista en la app móvil.

## 6. Dependencias

- HU-24 (reservas *Pagadas*), HU-03 (rol administrador y miembros aprobados), HU-17 (origen y destino del viaje).
- Decisiones del PO: aprobar el factor de **0,12 kg/km** y el recorte a 4 cifras.
- Decisiones abiertas: ninguna.

## 7. Definition of Done

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del plan en verde, con valores calculados a mano para CO₂ y bordes del período; cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque A-13 y A-08 en verde (CA-7 a CA-9).
- [ ] PR revisado por otro integrante.
- [ ] CI en verde (lint, formato, pruebas, build) en `backend/` y `web/`.
- [ ] Documentada en Swagger.
- [ ] Esta spec refleja lo realmente construido.
- [ ] Aceptada por el PO.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-17 | Creación (borrador) | pendiente |
| 2026-11-17 | Aprobada por el PO | pendiente |
