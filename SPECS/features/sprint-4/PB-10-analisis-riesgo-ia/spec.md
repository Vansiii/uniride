# PB-10 · Análisis de riesgo de fraude con IA local — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, **sin tecnología**.
> Estado: `aprobada por PO (20/11/2026, Vansiii)` · Épica: E6 Antifraude · Prioridad: Should · PHU: 5 · Sprint: S4
> Requisito del docente que cubre: **2 — Verificación que no se pueda saltar** (refuerza la detección de colusión) y la exigencia del ingeniero del 20/11/2026: IA en medio local más allá de un chat o del reconocimiento de imagen.
> Amenazas que toca: **A-10** (colusión para simular viajes), **A-13** (otra organización), **A-08** (API sin la app). No toca dinero, escrow ni estados del viaje.

## 1. Historia

**Como** administrador de una organización
**quiero** que cada alerta de fraude venga analizada por una IA propia, con un nivel de riesgo, un puntaje y los motivos explicados en lenguaje claro
**para** revisar primero los casos más graves y entender por qué el sistema sospecha, sin leer cifras sueltas.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | una alerta nueva de HU-25 | pasa como máximo **2 min** con la IA propia disponible | la alerta tiene un análisis con riesgo (bajo, medio o alto), puntaje de 0 a 100, de 1 a 3 motivos y una recomendación, marcado como «IA local» |
| CA-2 | la IA propia apagada o sin responder en **30 s** | se analiza una alerta | la analiza el servicio de IA de respaldo y queda marcada como «IA de respaldo» |
| CA-3 | la IA propia y la de respaldo caídas | se analiza una alerta | la alerta se muestra igual que hoy con «Análisis pendiente»; se reintenta en el siguiente ciclo, hasta **3** intentos; después queda «Sin análisis» |
| CA-4 | una respuesta de la IA fuera de formato (riesgo desconocido, puntaje fuera de 0–100, más de 3 motivos, texto suelto) | llega | se descarta, no se muestra y cuenta como intento fallido |
| CA-5 | un administrador en «Alertas de fraude» | abre la pantalla | ve en cada alerta una insignia Alto / Medio / Bajo con el puntaje y puede ordenar por riesgo |
| CA-6 | un administrador | abre el detalle de una alerta analizada | ve los motivos, la recomendación, quién la analizó (IA local o de respaldo) y la fecha |
| CA-7 | **ataque A-10:** una IA que responde «riesgo alto, bloquear» o «riesgo bajo, levantar bloqueo» | se registra el análisis | ningún bloqueo se crea, levanta ni acorta, y ningún pago, reserva o viaje cambia; solo las reglas de HU-25 bloquean |
| CA-8 | **privacidad:** cualquier análisis | se envía a la IA, propia o de respaldo | solo viajan cifras y etiquetas seudónimas («persona A», «persona B»): ni nombres, correos, carnets, coordenadas ni identificadores reales |
| CA-9 | **ataque A-13:** administrador de la organización A | pide alertas o análisis de B, o cambia el id en la petición | se rechaza; las cifras del perfil se calculan solo con datos de la organización de la alerta |
| CA-10 | **ataque A-08:** un miembro común o alguien sin sesión | pide los análisis por la API | se rechaza (403 / 401); no existe acción para crear, editar o borrar un análisis |
| CA-11 | la misma alerta | dos procesos la analizan a la vez o el ciclo se repite | queda un solo análisis por alerta |

## 3. Reglas de negocio

- RN-1: **La IA solo prioriza y explica.** Nunca bloquea, suspende, cobra, reembolsa ni cambia estados (AGENTS.md §5.1 y §5.4). Los bloqueos siguen siendo los de HU-25 RN-5/RN-6.
- RN-2: **Orden de proveedores:** primero la IA propia (self-hosted); si falla o tarda más de **30 s**, la de respaldo; si también falla, se reintenta en el siguiente ciclo.
- RN-3: Si la IA propia falla, se salta durante **60 s** para no esperar el tiempo límite en cada alerta.
- RN-4: **Perfil numérico** de la alerta, calculado en la organización de la alerta: patrón; reservas del par en 7 y 30 días; distancia y duración promedio de esas reservas; verificaciones fallidas en 7 días de cada persona; promedio y cantidad de calificaciones recibidas y qué parte viene de la otra persona del par; días de antigüedad de cada cuenta; recargas y cobros en 30 días; alertas previas del par.
- RN-5: **Formato de la respuesta:** riesgo ∈ {bajo, medio, alto}; puntaje entero 0–100; 1 a 3 motivos de hasta **160** caracteres; recomendación de hasta **200** caracteres; en español.
- RN-6: **Un análisis por alerta**, como registro nuevo de auditoría ligado a la alerta; la alerta original no se modifica (AGENTS.md §12).
- RN-7: Se analizan como máximo **5** alertas por ciclo; las más antiguas primero.
- RN-8: Solo el administrador de la organización ve el análisis, igual que la alerta (HU-26 RN-2). El usuario afectado nunca lo ve (HU-25 RN-9).
- RN-9: El análisis muestra que es orientativo: «Sugerencia de IA: la decisión es del administrador».

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| IA propia y de respaldo caídas | La alerta sigue visible; se reintenta (CA-3) | `alertas.analisis.pendiente` |
| 3 intentos fallidos | Queda sin análisis; no se reintenta más | `alertas.analisis.sin_analisis` |
| Respuesta fuera de formato | Se descarta (CA-4) | — |
| Alertas anteriores a esta funcionalidad | Se analizan en los ciclos siguientes, 5 por ciclo | `alertas.analisis.pendiente` |
| Alerta de P-3 (una sola persona) | Perfil sin datos de par; solo los de la persona | — |
| Ciclo repetido o dos procesos | Un solo análisis (CA-11) | — |

## 5. Fuera de alcance

- Que la IA bloquee, levante bloqueos o sancione (RN-1).
- Detectar patrones nuevos sin regla previa: la IA solo analiza alertas que ya creó HU-25.
- Mostrar el análisis en la app móvil o al super administrador.
- Reentrenar o ajustar el modelo con las decisiones de los administradores.

## 6. Dependencias

- HU / PB: HU-25 (alertas y bloqueos), HU-26 (pantalla de alertas), HU-21 (calificaciones), HU-14 (recargas y cobros).
- Aprobado por Vansiii el 20/11/2026: servicio externo nuevo (IA propia en Kaggle, alcanzada por túnel), puerto 22 abierto en el EC2 para el túnel, y el análisis guardado como registro de auditoría (sin migración).
- Decisiones abiertas que la afectan: ninguna.

## 7. Definition of Done

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque A-10, A-13 y A-08 en verde.
- [ ] PR revisado por otro integrante.
- [ ] CI en verde (lint, pruebas, build) en `backend/` y `web/`.
- [ ] Correctitud · Eficiencia · Fiabilidad · Facilidad de uso · Mantenimiento · Seguridad e integridad · Portabilidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Esta spec refleja lo realmente construido.
- [ ] Aceptada por el PO.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-20 | Creación | «PB-10 análisis de riesgo con IA local» |
| 2026-11-20 | RN-2 y CA-2: tiempo límite de la IA local de 10 s a 30 s (qwen2.5:14b en T4) | «PB-10: tiempo límite 30 s y túnel a UniRide» |
