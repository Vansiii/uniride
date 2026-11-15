# HU-27 · Reservar por voz — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-15)` · Épica: E7 Interfaz y voz · Prioridad: Must · PHU: 5 · Sprint: S4
> **Orden en S4: 2.ª.** Requiere HU-18, HU-19 y HU-29; construye el botón y el panel de voz que reutiliza HU-28.
> Requisito del docente que cubre: **4 — Interfaz muy navegable e intuitiva, con comandos de voz**
> Amenazas que toca: **A-11** (mover dinero con un comando de voz)

## 1. Historia

**Como** pasajero
**quiero** decir «busca un viaje a la UAGRM a las 7» y «reserva el primero»
**para** encontrar y reservar un viaje sin escribir.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | un pasajero verificado en una pantalla con el botón de voz (RN-1) | toca «Hablar con UniRide» | se abre el panel de voz con «Te escucho…», la transcripción en vivo y un ejemplo de comando |
| CA-2 | el panel escuchando | dice «busca un viaje a la UAGRM a las 7» | el panel muestra la interpretación («Entendí: viaje a UAGRM, hoy a las 07:00», RN-4) y abre los resultados de Buscar con origen en su ubicación, esa hora y solo los viajes cuyo destino coincide (RN-3), en menos de 2 s desde la interpretación |
| CA-3 | resultados mostrados por voz | termina la búsqueda | la app lee en voz alta cuántos viajes hay y el primero («Encontré 3 viajes. El primero sale a las 07:10 a UAGRM por 12,00 URC.»), y lo mismo se ve en pantalla |
| CA-4 | ningún viaje coincide con el destino a esa hora | termina la búsqueda | lo dice («No encontré viajes a UAGRM a esa hora») y muestra el estado vacío de Buscar con la sugerencia de otra hora |
| CA-5 | una lista de resultados en pantalla (por voz o por toque) | dice «reserva el primero», «reserva el 2» o «reserva el segundo» | abre la confirmación de reserva de ese viaje (HU-19) con el resumen y el monto, lee «Viaje de las 07:10 a UAGRM, 12,00 URC. Confirma con tu huella.» y abre el diálogo biométrico |
| CA-6 | **ataque A-11:** la confirmación abierta por voz | la persona no pone la huella, la cancela o dice «sí», «confirma» o «reserva» otra vez | no se reserva nada; solo la huella del dueño completa la reserva, igual que por toque |
| CA-7 | la huella confirmada en una reserva iniciada por voz | responde el servidor | el resultado es el mismo de HU-19 (incluidos saldo insuficiente con «Recargar saldo» y «Ya no quedan asientos») y se muestra y se lee |
| CA-8 | un comando sin hora («busca un viaje a la UAGRM») o sin destino («busca un viaje a las 7») | se interpreta | la app repregunta solo el dato que falta («¿A qué hora quieres salir?» / «¿A dónde quieres ir?») y sigue escuchando; no completa ni adivina |
| CA-9 | algo que no se reconoce como comando, o un número de viaje que no existe («reserva el quinto» con 3 resultados) | se interpreta | repregunta concreta («No entendí. Puedes decir: busca un viaje a la UAGRM a las 7» / «Hay 3 viajes. ¿Cuál quieres?»); tras **2** fallos seguidos ofrece «Hazlo con el teclado», que lleva a la alternativa táctil |
| CA-10 | «reserva el primero» sin una lista de resultados en pantalla | se interpreta | responde «Primero busca un viaje» y no abre ninguna confirmación |
| CA-11 | la primera vez que toca el botón | el sistema pide el permiso de micrófono | antes se explica en una línea para qué se usa; si lo niega, el panel lo explica con «Abrir ajustes» y la búsqueda táctil sigue disponible |
| CA-12 | la ubicación del teléfono desactivada o sin permiso | dice un comando de búsqueda | lo indica y lleva a Buscar con destino y hora ya puestos para elegir el origen a mano |
| CA-13 | el reconocimiento de voz del teléfono no disponible (sin servicio o sin conexión) | toca el botón | lo dice («La voz no está disponible ahora. Usa la búsqueda.») sin romper la pantalla |
| CA-14 | el flujo completo por voz | se cuentan los pasos | buscar (1), elegir y abrir la confirmación (2) y poner la huella (3): **≤ 4 pasos** |

## 3. Reglas de negocio

- RN-1: **Dónde está la voz:** botón «Hablar con UniRide» en el encabezado de las pantallas raíz (Buscar, Mis viajes, Billetera, Perfil) y del detalle de viaje y de reserva, siempre en el mismo lugar; además, dentro del campo de destino de Buscar (DESIGN_SYSTEM §8.10). Se activa solo al tocarlo: no hay palabra de activación ni escucha permanente.
- RN-2: **Comandos de esta HU** (español; mayúsculas, tildes y palabras de relleno no importan):

  | Intención | Formas aceptadas (ejemplos que deben reconocerse) |
  |---|---|
  | Buscar | «busca/buscar/quiero un viaje a {destino} a las {hora}», «llévame a {destino} a las {hora}», «viaje a {destino} a las {hora}»; destino y hora en cualquier orden; «hoy» o «mañana» opcional |
  | Reservar | «reserva/reservar/quiero el {n}», con {n} ordinal («primero» a «décimo») o número («el 2») |

- RN-3: **Destino:** coincide un viaje cuyo nombre de destino contiene todas las palabras dichas para el destino, sin artículos ni preposiciones («la», «el», «al», «de»), sin distinguir mayúsculas ni tildes («a la UAGRM» → «uagrm»). El origen es la ubicación actual (HU-18: ≤ 1 km y ± 30 min). La búsqueda y este filtro por destino los aplica el servidor (filtro opcional nuevo de la búsqueda de HU-18, que no cambia su resultado sin destino); la búsqueda táctil no lo usa.
- RN-4: **Hora:** «a las 7», «7 y media», «7:30», «19 horas», «de la mañana/tarde/noche». Sin «mañana/tarde/noche» y con una hora de 1 a 12, se toma **la próxima ocurrencia** de esa hora desde 30 min antes de ahora (a las 06:00, «a las 7» = hoy 07:00; a las 10:00 = hoy 19:00; a las 20:00 = mañana 07:00). La interpretación con día y hora en 24 h se muestra antes de buscar, así la persona corrige diciéndolo de nuevo. «Mañana» suelto (sin «de la») es el día siguiente; «de la mañana» es antes del mediodía («mañana a las 7 de la mañana» = mañana 07:00). «Hoy» o «mañana» con una hora de 1 a 12 sin franja toma esa hora en ese día si todavía no pasó, y si no, la de la tarde o noche.
- RN-5: **Orden de los resultados:** el mismo de HU-18 (por hora de salida); «el primero» es el primero visible en esa lista.
- RN-6: **La voz navega y prepara, nunca confirma** (`constitution.md` Art. 5.2, HU-29 RN-6): cada comando abre la misma pantalla que su alternativa táctil y la reserva solo la completa la huella. Las palabras «sí», «confirma» o «reserva» no tienen efecto en la confirmación.
- RN-7: **Ante duda, repregunta** (Art. 5.3): falta un dato, no se reconoce o el número no existe → repregunta concreta; 2 fallos seguidos → «Hazlo con el teclado».
- RN-8: **Mismo texto en pantalla y en voz:** una o dos frases, con el dato primero (DESIGN_SYSTEM §13.6). Todos los textos y repreguntas en `es-BO`. Si el teléfono está en silencio o no puede hablar, la respuesta igual se muestra.
- RN-9: **Privacidad:** el audio no se guarda ni se envía a UniRide; al servidor solo llega la búsqueda o la reserva, como por toque. El texto reconocido no se registra en logs.
- RN-10: **Solo móvil.** El panel web no tiene voz (D-08 sigue abierta).

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Falta la hora (CA-8) | Repregunta | `voz.buscar.falta_hora` |
| Falta el destino (CA-8) | Repregunta | `voz.buscar.falta_destino` |
| No se reconoce (CA-9) | Repregunta con ejemplo | `voz.comun.no_entendi` |
| Número fuera de la lista (CA-9) | Repregunta con el total | `voz.reservar.numero_invalido` |
| Dos fallos seguidos (CA-9) | Ofrece el teclado | `voz.comun.usar_teclado` |
| «Reserva» sin resultados (CA-10) | No abre la confirmación | `voz.reservar.sin_resultados` |
| Sin resultados (CA-4) | Estado vacío | `voz.buscar.sin_resultados` |
| Permiso de micrófono negado (CA-11) | Explica y ofrece ajustes | `voz.permiso.microfono` |
| Sin ubicación (CA-12) | Buscar con destino y hora puestos | `voz.buscar.sin_ubicacion` |
| Reconocimiento no disponible (CA-13) | Aviso | `voz.comun.no_disponible` |
| Silencio de más de 5 s | Cierra la escucha sin acción | `voz.comun.no_te_escuche` |
| Errores de la reserva | Los de HU-19 §4, leídos en voz alta | `reservas.confirmar.*` |

## 5. Fuera de alcance de esta HU

- Saldo, estado del viaje, cancelar y ayuda por voz → HU-28.
- Publicar un viaje por voz.
- Voz en el panel web → D-08.
- Palabra de activación o escucha en segundo plano.
- Reconocer destinos por apodo o sinónimo («la U») o buscar por cercanía al destino.
- Lectura de pantalla con TalkBack (pendiente de accesibilidad en HEARTBEAT).

## 6. Dependencias

- HU / PB: HU-18 (búsqueda), HU-19 (confirmación de reserva), HU-29 (biometría; HU-29 CA-4 ya exige el mismo diálogo para la voz), PB-03 (`BotonVoz`, `PanelVoz`).
- Decisiones abiertas que la afectan: **D-08** (voz en web; esta HU cubre solo móvil).
- **D-30** (resuelta el 15/11): se usan librerías existentes, no un módulo propio: `expo-speech` (oficial de Expo, lectura en voz alta) y `expo-speech-recognition` (comunidad, reconocimiento de Android); ambas MIT y con versión 58 para el SDK 58. Usan el reconocedor del dispositivo, sin servicio externo nuevo. La versión exacta y su instalación se fijan en el plan (`AGENTS.md` §14).

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde (intérprete de comandos con todas las formas de RN-2 y RN-4, y la confirmación por voz).
- [ ] Prueba de ataque A-11 en verde: la voz no completa ninguna reserva sin huella.
- [ ] Probado en un teléfono Android físico, con ruido de fondo moderado.
- [ ] PR revisado por otro integrante.
- [ ] CI en verde (lint, pruebas, build).
- [ ] Correctitud · Eficiencia (resultados < 2 s) · Fiabilidad · Facilidad de uso (≤ 4 pasos) · Mantenimiento · Seguridad e integridad · Portabilidad.
- [ ] Desplegada en AWS y documentada en Swagger (si cambia la API).
- [ ] Esta spec refleja lo realmente construido.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-15 | Creación (borrador) | 2026-11-15 · Specs del Sprint 4 en borrador y decisiones D-29 a D-31 |
| 2026-11-15 | Aprobada por el PO | 2026-11-15 · Specs del Sprint 4 aprobadas |
