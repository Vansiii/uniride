# PB-11 · Modelo de riesgo propio, anillos de colusión y retroalimentación — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, **sin tecnología**.
> Estado: `aprobada por PO (21/11/2026, Vansiii)` · Épica: E6 Antifraude · Prioridad: Should · PHU: 8 · Sprint: S4
> Requisito del docente que cubre: **2 — Verificación que no se pueda saltar** (detección de colusión) y la exigencia del ingeniero del 20/11/2026: IA propia en medio local, más allá de un chat. Amplía PB-10, que hoy solo redacta en prosa las cifras de una alerta.
> Amenazas que toca: **A-10** (colusión para simular viajes), **A-13** (otra organización), **A-08** (API sin la app). No toca dinero, escrow ni estados del viaje.

## 1. Historia

**Como** administrador de una organización
**quiero** que un modelo propio, que aprende cómo viaja normalmente mi organización, puntúe el riesgo de cada par de personas, encuentre grupos que solo viajan entre sí y mejore con mis decisiones
**para** encontrar fraudes que las reglas fijas no ven, confiar en un puntaje que se puede medir y explicar, y saber qué tan seguido acierta.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | una organización con al menos **20** pares con viajes pagados en 30 días | pasa el entrenamiento diario | existe un modelo de esa organización con fecha, cantidad de pares usados y versión |
| CA-2 | una organización con menos de 20 pares | pasa el entrenamiento diario | no se entrena modelo; las alertas siguen con las reglas de HU-25 y el puntaje de PB-10 marcado «estimado» |
| CA-3 | un modelo vigente y un par cuyo puntaje es **≥ 80** | se evalúan los pares del día | se crea una alerta «Comportamiento atípico» con el puntaje y los 3 factores que más lo apartan de lo normal; no se repite para el mismo par en **7 días** |
| CA-4 | un grupo de **3 o más** personas donde cada una tiene al menos **2** compañeros frecuentes dentro del grupo, hizo al menos el **80 %** de sus viajes pagados de 30 días dentro del grupo y el grupo suma **6 o más** viajes internos | se evalúan los grupos del día | se crea una alerta «Anillo de colusión» con el tamaño del grupo, los viajes internos y la proporción; no se repite para el mismo grupo en 7 días |
| CA-5 | cualquier alerta (de reglas, del modelo o de anillo) con modelo vigente | se analiza | su puntaje y su riesgo (bajo < 40, medio 40–69, alto ≥ 70) salen del modelo, no de la IA de lenguaje; se marca «Modelo propio» |
| CA-6 | una alerta analizada | se envía a la IA de lenguaje | recibe el puntaje del modelo, los factores principales y el percentil de cada cifra dentro de la organización; cada motivo menciona un factor o percentil recibido, si no la respuesta se descarta (como PB-10 CA-4) |
| CA-7 | un administrador en el detalle de una alerta | la ve | ve el puntaje, el origen (reglas, modelo o anillo), los factores con su percentil («8 viajes en 7 días · percentil 99 de tu organización») y la explicación |
| CA-8 | un administrador en el detalle de una alerta | marca «Fraude confirmado» o «Falso positivo», con nota opcional de hasta **200** caracteres | queda registrado con autor y fecha; puede cambiarlo y se conserva el historial; rige la última decisión |
| CA-9 | pares marcados «Fraude confirmado» | se reentrena el modelo | esos pares no se usan como comportamiento normal |
| CA-10 | un administrador en «Alertas de fraude» | abre la sección «Desempeño» | ve por origen (reglas, modelo, anillo) cuántas alertas hay, cuántas confirmadas y cuántas falsos positivos, y la precisión (confirmadas ÷ decididas); sin decisiones se muestra «Sin datos» |
| CA-11 | un conjunto de escenarios simulados con viajes normales y de colusión (par repetido, sin desplazamiento, cuentas nuevas que solo se califican entre sí, anillo de 3–5 cuentas) | se evalúa el modelo en las pruebas automáticas | el área bajo la curva ROC es **≥ 0,85** y detecta al menos el **80 %** de los pares de colusión con a lo sumo **10 %** de falsas alarmas; la suite falla si baja de ahí |
| CA-12 | **ataque A-10:** una alerta del modelo o de anillo, una decisión «Falso positivo» o una IA que responde «bloquear» | se registra | ningún bloqueo se crea, levanta ni acorta, y ningún pago, reserva o viaje cambia; solo las reglas de HU-25 bloquean |
| CA-13 | **ataque A-13:** administrador de la organización A | pide alertas, desempeño o decide sobre una alerta de B, o cambia el id en la petición | se rechaza; el modelo de A se entrena y evalúa solo con datos de A |
| CA-14 | **ataque A-08:** un miembro común o alguien sin sesión | pide el desempeño o envía una decisión por la API | se rechaza (403 / 401) |
| CA-15 | **privacidad:** cualquier análisis | se envía a la IA de lenguaje | solo viajan cifras, percentiles y etiquetas seudónimas («persona A», «grupo de 4»), como PB-10 CA-8 |
| CA-16 | el entrenamiento o la evaluación diaria | se repite o corre en dos procesos a la vez | queda un solo modelo por organización y día y no se duplican alertas |

## 3. Reglas de negocio

- RN-1: **El modelo, los anillos y las decisiones solo priorizan y explican.** Nunca bloquean, suspenden, cobran, reembolsan ni cambian estados (AGENTS.md §5.1 y §5.4). Los bloqueos siguen siendo los de HU-25 RN-5/RN-6.
- RN-2: **Modelo propio:** corre en el servidor de UniRide, sin servicios externos; uno por organización; aprende qué es normal sin necesitar ejemplos de fraude; se reentrena cada **24 h** con los pares de los últimos **30 días**; mínimo **20** pares.
- RN-3: **Cifras de cada par** (las que usa el modelo): viajes pagados en 7 y 30 días; distancia y duración promedio; qué parte de los viajes de cada persona es con la otra; qué parte de las calificaciones recibidas viene de la otra; antigüedad de la cuenta más nueva; cobros sin recargas en 30 días; verificaciones fallidas en 7 días.
- RN-4: **Puntaje 0–100**, reproducible: el mismo modelo con las mismas cifras da el mismo puntaje. Umbral de alerta del modelo: **≥ 80**. Riesgo: bajo < 40, medio 40–69, alto ≥ 70.
- RN-5: **Factores:** las 3 cifras que más se apartan de lo normal de la organización, con su percentil.
- RN-6: **Anillo:** ≥ 3 personas; cada una con ≥ 2 **compañeros frecuentes** dentro del grupo (un compañero es frecuente si el par suma ≥ 20 % de los viajes pagados de 30 días de cada uno); ≥ 80 % de los viajes de cada una dentro del grupo; ≥ 6 viajes internos. Se toma el grupo máximo que cumple. Un auto compartido habitual (un conductor con pasajeros fijos que no viajan entre sí) no es anillo: sus pasajeros tienen un solo compañero frecuente.
- RN-7: **La IA de lenguaje (PB-10) solo redacta** los motivos y la recomendación a partir del puntaje, los factores y los percentiles; sin modelo vigente, se mantiene el comportamiento de PB-10 con el puntaje marcado «estimado».
- RN-8: **Decisiones:** «Fraude confirmado» o «Falso positivo», nota ≤ 200 caracteres, auditadas con autor y fecha (AGENTS.md §12); rige la última. Solo el administrador de la organización.
- RN-9: **Precisión por origen** = confirmadas ÷ (confirmadas + falsos positivos).
- RN-10: El usuario afectado nunca ve puntajes, factores, anillos ni decisiones (HU-25 RN-9). Se muestra «Sugerencia: la decisión es del administrador».

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Organización con < 20 pares | Sin modelo; puntaje de PB-10 «estimado» (CA-2) | `alertas.modelo.sin_datos` |
| Falla el entrenamiento | Se conserva el modelo anterior; se reintenta al día siguiente; queda en auditoría | — |
| Modelo con más de 3 días | Se sigue usando y se muestra la fecha | `alertas.modelo.desactualizado` |
| Persona en dos anillos | Una alerta por grupo máximo | — |
| Decisión sobre una alerta ya decidida | Se registra la nueva; rige la última | — |
| Alerta de P-3 (una persona) | Puntaje del modelo con las cifras de la persona en su par más frecuente; si no tiene pares, «estimado» | — |

## 5. Fuera de alcance

- Que el modelo, los anillos o las decisiones bloqueen o sancionen (RN-1).
- Cambios en la IA local de Kaggle o en el respaldo (Groq): solo cambia lo que se les envía.
- Analizar la traza GPS del trayecto contra la ruta por calles.
- Mostrar puntajes o alertas en la app móvil o al super administrador.
- Ajustar los umbrales de HU-25 con el modelo.

## 6. Dependencias

- HU / PB: PB-10 (análisis con IA), HU-25 (alertas y bloqueos), HU-26 (pantalla de alertas), HU-21 (calificaciones), HU-14 (recargas y cobros).
- Sin servicios externos nuevos ni cambios de infraestructura.
- Decisiones abiertas que la afectan: ninguna.

## 7. Definition of Done

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde, incluida la evaluación con escenarios simulados (CA-11); cobertura de backend ≥ 70 %.
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
| 2026-11-21 | Creación | — |
| 2026-11-21 | RN-6 y CA-4: compañeros frecuentes (≥ 20 %) y ≥ 2 por persona. Sin eso, toda la organización (un solo grupo conexo) y cualquier auto compartido habitual eran «anillo» | «PB-11: definición de anillo» |
