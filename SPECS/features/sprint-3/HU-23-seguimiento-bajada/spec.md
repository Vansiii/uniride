# HU-23 · Seguimiento y verificación de bajada — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-08)` · Épica: E6 Verificación de presencia · Prioridad: Must · PHU: 8 · Sprint: S3
> **Orden en S3: 4.ª.** Requiere HU-22; deja la reserva *Verificada* para HU-24.
> Requisito del docente que cubre: **2 — Verificación que no se pueda saltar**
> Amenazas que toca: **A-05** (repetir un código), **A-06** (código enviado lejos), **A-07** (GPS falso), **A-08** (API sin la app), **A-13** (otra organización)

## 1. Historia

**Como** sistema
**quiero** comparar las trayectorias del conductor y del pasajero y repetir el encuentro al bajar
**para** confirmar que viajaron juntos antes de liberar el pago.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | una reserva *Abordada* | dura el viaje | las apps del conductor y del pasajero envían su posición firmada cada 15 s, sin pedir huella cada vez, también con la pantalla apagada, y muestran «Compartiendo tu ubicación cada 15 s» |
| CA-2 | el teléfono sin señal durante el viaje | recupera la conexión | envía las posiciones guardadas con su hora original y el servidor las acepta |
| CA-3 | el pasajero llega a su destino | el conductor muestra el código de bajada y el pasajero lo escanea y confirma con biometría | se aplican las mismas reglas del abordaje (HU-22: código de 30 s y un uso, ambas firmas, integridad, ≤ 50 m, sin ubicación simulada) |
| CA-4 | una bajada aceptada y trayectorias en las que ≥ 80 % de los pares de puntos están a ≤ 100 m y ninguna tiene saltos imposibles | el servidor evalúa el viaje | la reserva pasa a *Verificada*; los dos ven «Viaje verificado» y el pago queda *Pendiente* (HU-24) |
| CA-5 | **ataque A-07:** una trayectoria con un salto de más de 150 km/h entre dos puntos seguidos | se evalúa | la reserva no se verifica y el pago no se libera |
| CA-6 | **ataque A-07:** trayectorias que se separan (menos del 80 % de los pares a ≤ 100 m) | se evalúa | la reserva no se verifica |
| CA-7 | **ataque A-07:** algún punto de cualquiera de las dos trayectorias marcado como ubicación simulada | se evalúa | la reserva no se verifica |
| CA-8 | **ataque A-08:** posiciones sin firma válida, de alguien que no participa en la reserva o con hora fuera del viaje | llegan al servidor | se rechazan y no cuentan |
| CA-9 | posiciones repetidas, con hora en el futuro o anteriores al abordaje | llegan al servidor | se ignoran sin error |
| CA-10 | menos de 4 pares de puntos entre abordaje y bajada | se evalúa | la reserva no se verifica («No hay suficientes datos del trayecto») |
| CA-11 | una reserva que no se verificó (CA-5 a CA-7, CA-10) | termina la evaluación | queda *Verificación fallida* con el motivo, el pago sigue en garantía y queda una alerta en auditoría (D-24) |
| CA-12 | una bajada aceptada | se siguen recibiendo posiciones de esa reserva | se rechazan; las apps dejan de enviarlas y lo indican |
| CA-13 | todas las reservas abordadas de un viaje verificadas | termina la última evaluación | el viaje pasa a *Verificado* (D-23) |
| CA-14 | **ataque A-13:** posiciones o bajada sobre una reserva de otra organización | llegan al servidor | se rechazan igual que una reserva inexistente |
| CA-15 | la evaluación | termina | queda registrada con fecha, reserva, porcentaje de coincidencia, velocidad máxima y resultado |

## 3. Reglas de negocio

- RN-1: **Una posición cada 15 s** por participante, entre el abordaje y la bajada de esa reserva.
- RN-2: **Par de puntos:** cada posición del pasajero se empareja con la del conductor más cercana en el tiempo, con a lo sumo 15 s de diferencia. Una posición del pasajero sin pareja cuenta como par no coincidente.
- RN-3: **Coincidencia:** ≥ 80 % de los pares a ≤ 100 m.
- RN-4: **Salto imposible:** entre dos posiciones seguidas de la misma persona, más de 150 km/h.
- RN-5: **Mínimo de datos:** al menos 4 pares (≈ 1 minuto de viaje).
- RN-6: **Ubicación simulada:** un solo punto marcado invalida la verificación de esa reserva.
- RN-7: **Bajada = encuentro de HU-22** (RN-1, RN-2, RN-4, RN-5 de esa spec), sin ventana horaria.
- RN-8: **Privacidad:** las posiciones solo se usan para verificar el viaje (y, más adelante, HU-25 y HU-28); no se muestran a terceros ni salen en logs.
- RN-9: **Cada pasajero tiene su propia bajada y su propia evaluación.** La verificación de un pasajero no depende de la de otro.
- RN-10: **Viaje *Verificado*** (D-23) cuando todas sus reservas abordadas terminaron su evaluación con éxito y no queda ninguna *Confirmada* sin abordar. Una *Verificación fallida* no impide que se paguen las demás.
- RN-11: **Verificación fallida** (D-24): el pasaje queda retenido en garantía, sin liberar ni reembolsar, con una alerta en auditoría. La resolución la define HU-20 (regla) o HU-26 (revisión del admin). Así un teléfono sin batería no regala ni quita el dinero.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Sin señal durante el viaje (CA-2) | Se guardan y se envían luego | `presencia.trayecto.sin_conexion` |
| Ubicación desactivada a mitad de viaje | Aviso permanente; los puntos faltantes cuentan como no coincidentes | `presencia.trayecto.activa_ubicacion` |
| Permiso de ubicación en segundo plano negado | Explica que sin él el viaje puede no verificarse | `presencia.trayecto.permiso_segundo_plano` |
| Batería del teléfono agotada | Faltan puntos; la evaluación decide con lo recibido | `presencia.trayecto.verificacion_fallida` |
| Salto imposible, separación o ubicación simulada | *Verificación fallida* con motivo | `presencia.trayecto.verificacion_fallida` |
| Pocos datos (CA-10) | *Verificación fallida* | `presencia.trayecto.datos_insuficientes` |
| Errores del encuentro de bajada | Los mismos de HU-22 §4 | `presencia.bajada.*` |
| Posición repetida o fuera del viaje | Se ignora | — |

## 5. Fuera de alcance de esta HU

- Liberar el pago → HU-24.
- Resolver una *Verificación fallida* (reembolso o revisión) → D-24 (HU-20 o HU-26).
- Mostrar el trayecto en un mapa en vivo o «¿dónde está mi conductor?» → HU-28.
- Detección de patrones de colusión entre viajes → HU-25.
- Plazo máximo de un viaje en curso.

## 6. Dependencias

- HU / PB: HU-22 (encuentro y estado *Abordada*), HU-09 (llave), HU-29 (biometría en la bajada).
- Decisiones resueltas el 08/11:
  - **D-22:** las posiciones se firman con la llave de trayecto de HU-22 RN-9.
  - **D-23:** RN-10.
  - **D-24:** RN-11.

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque A-05, A-06, A-07, A-08 y A-13 en verde.
- [ ] Viaje real con dos teléfonos Android físicos, también con la pantalla apagada.
- [ ] PR revisado por otro integrante.
- [ ] CI en verde (lint, pruebas, build).
- [ ] Correctitud · Eficiencia · Fiabilidad · Facilidad de uso · Mantenimiento · Seguridad e integridad · Portabilidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Esta spec refleja lo realmente construido.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-08 | Creación (borrador) | 2026-11-08 · Specs del Sprint 3 en borrador y decisiones D-22 a D-27 |
| 2026-11-08 | Aprobada por el PO | 2026-11-08 · Specs del Sprint 3 aprobadas |
