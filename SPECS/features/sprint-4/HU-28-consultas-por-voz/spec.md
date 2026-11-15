# HU-28 · Consultas por voz — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-15)` · Épica: E7 Interfaz y voz · Prioridad: Must · PHU: 5 · Sprint: S4
> **Orden en S4: 3.ª.** Requiere HU-27 (botón y panel de voz), HU-14 (saldo), HU-20 (cancelar) y HU-22/HU-23 (estado y posición del conductor).
> Requisito del docente que cubre: **4 — Interfaz muy navegable e intuitiva, con comandos de voz**
> Amenazas que toca: **A-08** (API sin la app), **A-11** (mover dinero con un comando de voz), **A-13** (otra organización)

## 1. Historia

**Como** usuario verificado
**quiero** preguntar por voz mi saldo, dónde está mi conductor o el estado de mi viaje, pedir ayuda y cancelar mi viaje
**para** usar la app con las manos ocupadas.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | un usuario con billetera | dice «¿cuál es mi saldo?» | se abre Billetera y la app muestra y lee «Tienes 50,00 URC disponibles y 12,00 en garantía.» con los mismos valores de HU-14 |
| CA-2 | un usuario sin billetera todavía | pregunta su saldo | responde «Aún no tienes billetera.» y abre Billetera, que explica cómo obtenerla |
| CA-3 | un pasajero con su reserva del momento (RN-3) *Confirmada* y una posición del conductor de hace ≤ 60 s (RN-4) | dice «¿dónde está mi conductor?» | se abre el detalle de la reserva y se muestra y lee «Tu conductor está a 300 metros del punto de encuentro.»; si está a ≤ 50 m, «Tu conductor ya está en el punto de encuentro.» |
| CA-4 | esa reserva sin posición reciente del conductor | pregunta dónde está | responde «Aún no tenemos la ubicación de tu conductor. Tu viaje sale a las 07:00 desde {origen}.» |
| CA-5 | una reserva *Abordada*, *Verificada*, *Pagada*, *Cancelada*, *Expirada* o en *Verificación fallida* | pregunta dónde está su conductor o «¿cómo va mi viaje?» | responde el estado con una frase por estado (RN-5), sin ubicación |
| CA-6 | un conductor con su viaje del momento | dice «¿cómo va mi viaje?» | responde el estado del viaje y sus pasajeros («Tu viaje de las 07:00 tiene 2 pasajeros confirmados y 1 a bordo.») y abre ese viaje |
| CA-7 | ningún viaje del momento | pregunta por su viaje o su conductor | responde con su próxima reserva o viaje («Tu próximo viaje sale mañana a las 07:00 a UAGRM.») o «No tienes viajes próximos.» |
| CA-8 | exactamente una reserva o un viaje propio que se puede cancelar (HU-20) | dice «cancela mi viaje» | abre la confirmación de cancelación de HU-20 con la vista previa del reembolso, la lee («Si cancelas ahora te devolvemos 12,00 URC. Confirma con tu huella.») y abre el diálogo biométrico |
| CA-9 | dos o más cancelables | dice «cancela mi viaje» | los lista en pantalla y en voz («Tienes 2 viajes: el primero a las 07:00 a UAGRM, el segundo a las 18:00 a Equipetrol. ¿Cuál cancelo?») y acepta «el primero»/«el 2» o el toque; luego sigue como CA-8 |
| CA-10 | nada que se pueda cancelar | dice «cancela mi viaje» | responde «No tienes viajes que se puedan cancelar.» sin abrir nada |
| CA-11 | **ataque A-11:** la confirmación de cancelación abierta por voz | la persona dice «sí», «confirma» o no pone la huella | no se cancela nada; solo la huella del dueño completa la cancelación |
| CA-12 | cualquier pantalla con el botón de voz | dice «ayúdame» o «¿qué puedo decir?» | se abre Ayuda con cada comando, un ejemplo y su alternativa táctil, y lee «Puedes pedirme: buscar un viaje, reservar, tu saldo, dónde está tu conductor, cómo va tu viaje o cancelar tu viaje.» |
| CA-13 | **ataque A-08:** una consulta de la posición del conductor sin sesión, con sesión vencida o de una persona sin membresía aprobada | llega al servidor | responde 401 o 403 y no revela nada; con sesión válida solo responde la distancia de RN-6, nunca coordenadas |
| CA-14 | **ataque A-13:** un pasajero que no tiene reserva en ese viaje, la reserva de otro, o una de otra organización | pide la posición del conductor | responde «no encontrado», igual que si no existiera |
| CA-15 | cualquier respuesta de esta HU | se entrega | el mismo texto se ve en el panel de voz y en la pantalla destino, y se lee en voz alta; sin voz del teléfono, solo se muestra |
| CA-16 | un comando que no se reconoce | se interpreta | se comporta como HU-27 CA-9 (repregunta y, tras 2 fallos, teclado) |

## 3. Reglas de negocio

- RN-1: **Comandos de esta HU** (se suman a los de HU-27, con el mismo botón y panel; mayúsculas, tildes y relleno no importan):

  | Intención | Formas aceptadas (ejemplos que deben reconocerse) | Pantalla | Alternativa táctil |
  |---|---|---|---|
  | Saldo | «¿cuál es mi saldo?», «¿cuánto saldo tengo?», «mi saldo» | Billetera | Pestaña Billetera |
  | Conductor | «¿dónde está mi conductor?», «¿dónde viene mi conductor?» | Detalle de la reserva | Tarjeta del viaje anclado |
  | Estado del viaje | «¿cómo va mi viaje?», «estado de mi viaje» | Detalle de la reserva o del viaje | Tarjeta del viaje anclado |
  | Cancelar | «cancela mi viaje», «cancelar mi reserva», «cancela el viaje» | Confirmación de HU-20 | Botón «Cancelar reserva» / «Cancelar viaje» |
  | Ayuda | «ayúdame», «ayuda», «¿qué puedo decir?» | Ayuda | Ícono de ayuda en Perfil |

- RN-2: **La voz nunca autoriza** (A-11, HU-29 RN-6): consultar no pide huella (HU-29 RN-2); cancelar abre la confirmación de HU-20 y solo la huella la completa.
- RN-3: **Viaje del momento:** el mismo criterio del viaje anclado de «Buscar» y «Mis viajes» (SP177): primero un viaje en curso (el que conduce, luego la reserva a bordo); si no, la reserva *Confirmada* o el viaje *Reservado* desde 30 min antes hasta 1 h después de la salida, el que sale primero. Sin viaje del momento se usa la próxima reserva o viaje futuro.
- RN-4: **Posición del conductor:** la última que el servidor ya recibe del teléfono del conductor (al mostrar el código de abordaje, HU-22, o durante el trayecto, HU-23), si tiene **60 s o menos**. No se agrega ningún envío nuevo de ubicación.
- RN-5: **Respuestas por estado de la reserva:** *Confirmada* → CA-3/CA-4; *Abordada* → «Estás a bordo. Tu ubicación se comparte cada 15 s.»; *Verificada* → «Tu viaje quedó verificado. El pago al conductor está en camino.»; *Pagada* → «Tu viaje terminó y quedó pagado.»; *Cancelada* → «Tu reserva está cancelada.» con el reembolso; *Expirada* → «Tu reserva venció porque no se verificó el abordaje. Te devolvimos {monto} URC.»; *Verificación fallida* → «No pudimos verificar tu viaje. Tu dinero sigue en garantía.» (o «Te devolvimos {monto} URC.» tras HU-20 RN-11).
- RN-6: **Privacidad de la ubicación** (HU-23 RN-8): al pasajero solo se le da la **distancia del conductor al punto de encuentro**, redondeada a decenas de metros (o km con un decimal desde 1 km), nunca coordenadas; solo a quien tiene una reserva *Confirmada* de ese viaje, con su sesión, como el detalle de la reserva (HU-19). No pide la firma del teléfono: la llave del teléfono exige huella en cada firma y una consulta no la pide (HU-29 RN-2). El conductor no recibe la posición de nadie.
- RN-7: **Cancelables** (para CA-8 a CA-10): reservas propias *Confirmadas* y viajes propios *Publicados* o *Reservados* sin abordajes (HU-20 RN-1, RN-4), de la organización activa.
- RN-8: **Mismo texto en pantalla y en voz**, una o dos frases, dato primero, en `es-BO` (HU-27 RN-8). Montos con `formato.ts` (coma decimal).
- RN-9: Privacidad, botón, permisos y fallas del reconocimiento: las de HU-27 (RN-1, RN-7, RN-9, CA-11, CA-13). Solo móvil (D-08).

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Sin billetera (CA-2) | Abre Billetera | `voz.saldo.sin_billetera` |
| Conductor sin posición reciente (CA-4) | Hora y origen | `voz.conductor.sin_ubicacion` |
| Sin viajes (CA-7) | Lo dice | `voz.viaje.sin_viajes` |
| Nada cancelable (CA-10) | Lo dice | `voz.cancelar.nada` |
| Elección fuera de la lista (CA-9) | Repregunta con el total | `voz.cancelar.numero_invalido` |
| Saldo con la red caída | Muestra el último saldo conocido como HU-14 | `billetera.saldo.*` |
| Sin conexión | No inventa datos: lo dice y no abre la confirmación | `comun.errores.sin_conexion` |
| Errores de la cancelación | Los de HU-20 §4, leídos | `reservas.cancelar.*` |

## 5. Fuera de alcance de esta HU

- Mostrar el conductor en un mapa en vivo o compartir la ubicación antes de que muestre el código.
- Consultar el historial de movimientos por voz.
- Recargar o retirar por voz.
- Voz en el panel web → D-08.

## 6. Dependencias

- HU / PB: HU-27 (botón, panel, intérprete y repreguntas), HU-14 (saldo disponible y en garantía), HU-20 (cancelación y vista previa), HU-22 y HU-23 (posición del conductor), HU-29 (biometría).
- Decisiones abiertas que la afectan: **D-08** (solo móvil).
- Requiere confirmación humana en el plan si cambia un contrato de API usado por la app (`AGENTS.md` §14): la consulta de la distancia del conductor es nueva.

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde (todas las formas de RN-1 en el intérprete; respuestas por estado de RN-5); cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque A-08, A-11 y A-13 en verde.
- [ ] Probado en un teléfono Android físico.
- [ ] PR revisado por otro integrante.
- [ ] CI en verde (lint, pruebas, build).
- [ ] Correctitud · Eficiencia · Fiabilidad · Facilidad de uso · Mantenimiento · Seguridad e integridad · Portabilidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Esta spec refleja lo realmente construido.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-15 | Creación (borrador) | 2026-11-15 · Specs del Sprint 4 en borrador y decisiones D-29 a D-31 |
| 2026-11-15 | Aprobada por el PO | 2026-11-15 · Specs del Sprint 4 aprobadas |
| 2026-11-15 | CA-13 y RN-6: la consulta de la distancia del conductor no exige la firma del teléfono (exigiría huella, contra HU-29 RN-2); la protegen la sesión, la membresía y ser pasajero de la reserva | 2026-11-15 · Corrección de HU-28 CA-13 antes del plan |
