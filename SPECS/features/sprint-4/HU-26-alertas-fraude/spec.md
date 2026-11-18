# HU-26 · Alertas de fraude (solo lectura) — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-17)` · Épica: E6 Verificación de presencia · Prioridad: Should · PHU: 3 (reducida) · Sprint: S4 (hasta vie 20/11/2026)
> Requisito del docente que cubre: **1 — Multi-organización** y **2 — Verificación que no se salta** (hace visible lo que HU-25 detecta)
> Amenazas que toca: **A-13** (otra organización), **A-08** (API sin la app), **A-10 / A-07** (lo que se muestra)

## 1. Historia

**Como** administrador de una organización
**quiero** ver las alertas de fraude y los bloqueos vigentes de mi organización
**para** enterarme a tiempo y orientar a mis miembros.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | un administrador de la organización A con alertas de HU-25 en ella | abre «Alertas de fraude» en el panel web | ve la lista de las alertas de A, de la más reciente a la más antigua, con fecha, patrón, personas (nombre), cifras y fin del bloqueo si lo hubo |
| CA-2 | la misma pantalla | mira «Bloqueos vigentes» | ve los bloqueos de par y de cuenta que siguen vigentes, con las personas y la fecha de fin; los vencidos no aparecen |
| CA-3 | una organización sin alertas | abre la pantalla | ve «Sin alertas por ahora.» |
| CA-4 | más de 20 alertas | abre la pantalla | ve las 20 más recientes y puede pedir más (paginación) |
| CA-5 | un administrador filtra por patrón (viajes repetidos, sin desplazamiento, verificaciones fallidas) | aplica el filtro | solo ve ese patrón |
| CA-6 | **ataque A-13:** administrador de A | pide alertas con el id de la organización B, o cambia el id en la petición | se rechaza; nunca ve una alerta ni un bloqueo cuyo registro pertenezca solo a B |
| CA-7 | **ataque A-08:** un miembro común, un conductor o alguien sin sesión | llama a la API de alertas directamente | se rechaza (403 / 401) |
| CA-8 | **ataque A-08:** cualquier usuario, incluido el administrador | intenta levantar, editar o borrar una alerta o un bloqueo por la API | no existe tal acción; la API responde que no existe |
| CA-9 | cualquier alerta mostrada | se lee | no trae coordenadas, ni fotos, ni datos de identidad más allá del nombre (HU-25 RN-10) |
| CA-10 | un administrador | abre la pantalla | queda un registro de auditoría de la consulta con autor y fecha |

## 3. Reglas de negocio

- RN-1: **Solo lectura.** Levantar un bloqueo antes de tiempo sigue sin existir; vence solo (HU-25 RN-7). Es una decisión de alcance por el plazo, no un olvido.
- RN-2: Solo el rol **administrador de organización** activo en esa organización ve la pantalla. El super administrador no la ve en esta versión.
- RN-3: Una alerta se muestra solo en la organización que quedó registrada en ella (HU-25 CA-13). Un bloqueo de persona que involucra a dos organizaciones se muestra en cada una como «bloqueo de {persona}» sin decir cuál fue la otra.
- RN-4: Las personas se muestran con su nombre y rol en la reserva; nunca con carnet ni correo.
- RN-5: Página de 20; máximo 100 por petición.
- RN-6: Texto de cada patrón en es-BO: «Viajes repetidos», «Viaje sin desplazamiento», «Verificaciones fallidas repetidas».

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje (clave es-BO) |
|---|---|---|
| Sin alertas | Estado vacío | `fraude.alertas.vacio` |
| Falla la API | Mensaje y botón «Reintentar»; no se muestra una lista a medias | `fraude.alertas.error` |
| Persona eliminada o sin nombre | Se muestra «Persona sin nombre» | `fraude.alertas.persona_sin_nombre` |
| Organización de otro (CA-6) | 403 | `comun.errores.sin_permiso` |
| Administrador con membresía pendiente o suspendida | 403 | `comun.errores.sin_permiso` |

## 5. Fuera de alcance de esta HU

- Levantar o acortar un bloqueo, o marcar una alerta como «revisada» (requeriría cambiar la tabla de bloqueos, hoy solo de inserción; `AGENTS.md` §14).
- Avisos por correo o notificaciones al administrador.
- Vista en la app móvil.
- Alertas de otras fuentes distintas a HU-25.

## 6. Dependencias

- HU-25 (alertas `fraude.alerta` y `fraude.bloqueo` en auditoría, tabla de bloqueos), HU-03 (rol administrador en el panel web).
- Decisiones abiertas: ninguna. Decisión del PO: confirmar que **solo lectura** basta para la defensa.

## 7. Definition of Done

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del plan en verde; cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque A-13 y A-08 en verde (CA-6 a CA-8).
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
