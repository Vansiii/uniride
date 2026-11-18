# HU-22 · Verificación de abordaje — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-08)` · Épica: E6 Verificación de presencia · Prioridad: Must · PHU: 8 · Sprint: S3
> **Orden en S3: 3.ª.** Requiere HU-19 y HU-09; HU-23 repite este encuentro al bajar.
> Requisito del docente que cubre: **2 — Verificación que no se pueda saltar**
> Amenazas que toca: **A-03** (emulador, root o app modificada), **A-04** (teléfono ajeno), **A-05** (repetir un código capturado), **A-06** (enviar foto del código a alguien lejos), **A-07** (GPS falso), **A-08** (API sin la app), **A-13** (otra organización)

## 1. Historia

**Como** conductor y pasajero de un viaje reservado
**queremos** probar que nos encontramos en el mismo lugar
**para** iniciar el viaje con una prueba válida, sin la cual el pago nunca se libera.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | un conductor con al menos una reserva confirmada, dentro de la ventana de abordaje (RN-3) | abre «Mostrar código» y confirma con biometría una sola vez | ve un código QR de un solo uso que vence en 30 s y se renueva solo antes de vencer, sin pedir otra huella, junto a la lista de pasajeros con su estado |
| CA-2 | el pasajero con reserva confirmada en ese viaje, a ≤ 50 m del conductor | escanea el código y confirma con biometría | el servidor comprueba el código, ambas firmas, la integridad del teléfono del pasajero y la distancia; la reserva pasa a *Abordada*, el viaje a *En curso* y los dos ven «Abordaje verificado» en menos de 3 s |
| CA-3 | **ataque A-05:** un código ya usado por otro pasajero o en otro intento | se envía de nuevo | se rechaza («Ese código ya no sirve») |
| CA-4 | **ataque A-05:** un código emitido hace más de 30 s | se envía | se rechaza («Ese código ya no sirve») |
| CA-5 | **ataque A-06:** la foto del código enviada a alguien que está a más de 50 m del conductor | escanea y confirma | se rechaza indicando la distancia; el código queda consumido |
| CA-6 | **ataque A-07:** el teléfono del pasajero o del conductor informa una ubicación simulada | se intenta verificar | se rechaza («No pudimos confirmar tu ubicación») |
| CA-7 | **ataque A-03:** la integridad del teléfono del pasajero no es válida (emulador, root o app modificada) | se intenta verificar | se rechaza («Este teléfono no puede verificar viajes») sin detalle técnico |
| CA-8 | **ataque A-08:** un código con la firma del conductor alterada o falsificada, o un escaneo sin la firma biométrica válida del pasajero | llega al servidor | se rechaza |
| CA-9 | un pasajero sin reserva en ese viaje, o con una reserva no confirmada | escanea el código | se rechaza («No tienes una reserva en este viaje») |
| CA-10 | **ataque A-13:** un código de un viaje de otra organización | se escanea | se rechaza igual que un código inválido |
| CA-11 | fuera de la ventana de abordaje | el conductor pide un código | no se emite y la app indica desde cuándo o hasta cuándo se puede abordar |
| CA-12 | una posición con precisión peor que 50 m o tomada hace más de 30 s | se intenta verificar | se rechaza pidiendo mejor señal |
| CA-13 | cualquier intento, aceptado o rechazado | termina | queda registrado con fecha, reserva, participantes, distancia y resultado; las posiciones solo se usan para verificar |
| CA-14 | una reserva ya *Abordada* | el pasajero vuelve a escanear | se responde que el abordaje ya está verificado, sin crear otra prueba |

## 3. Reglas de negocio

- RN-1: **Código de un solo uso con 30 s de vida**, emitido por el servidor y firmado por el teléfono del conductor. Cada escaneo, aceptado o rechazado, lo consume; el conductor ya tiene el siguiente en pantalla.
- RN-2: **Distancia ≤ 50 m** entre las posiciones de conductor y pasajero tomadas en el mismo encuentro.
- RN-3: **Ventana de abordaje:** desde 30 min antes hasta 15 min después de la hora de salida. Pasado ese plazo sin abordaje, la reserva expira (lo resuelve HU-20).
- RN-4: **Posiciones válidas:** precisión informada ≤ 50 m, tomadas hace ≤ 30 s y sin marca de ubicación simulada.
- RN-5: **Integridad del teléfono** del pasajero comprobada en el servidor en cada escaneo, ligada a ese código. La del conductor, al abrir «Mostrar código».
- RN-6: **Biometría:** una huella del conductor al abrir «Mostrar código» y una del pasajero por escaneo (HU-29 RN-1). Renovar el código no pide huella (D-22).
- RN-7: **Cada pasajero hace su propio abordaje.** El viaje pasa a *En curso* con el primer abordaje verificado; los demás pasajeros pueden abordar mientras dure la ventana.
- RN-8: El servidor decide; el teléfono solo aporta pruebas firmadas (`AGENTS.md` §5.1). El estado no se puede fijar desde el cliente.
- RN-9: **Llave de trayecto** (D-22): una segunda llave del teléfono, no exportable y sin biometría, que firma el código rotativo y las posiciones. El conductor la registra al abrir «Mostrar código» y el pasajero al abordar, siempre dentro de una petición confirmada con biometría. Vale solo para ese viaje o esa reserva y deja de aceptarse al terminar.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Código vencido o ya usado (CA-3, CA-4) | Rechazo; volver a escanear | `presencia.abordaje.codigo_invalido` |
| Distancia > 50 m (CA-5) | Rechazo | `presencia.abordaje.distancia` |
| Ubicación simulada (CA-6) | Rechazo | `presencia.abordaje.ubicacion_simulada` |
| Integridad fallida (CA-7) | Rechazo sin detalle | `presencia.abordaje.integridad` |
| Sin reserva confirmada (CA-9) | Rechazo | `presencia.abordaje.sin_reserva` |
| Fuera de la ventana (CA-11) | Sin código | `presencia.abordaje.fuera_de_ventana` |
| Señal GPS débil o vieja (CA-12) | Rechazo | `presencia.abordaje.senal_gps` |
| Ubicación desactivada (conductor) | El aviso reemplaza el código | `presencia.abordaje.activa_ubicacion` |
| Permiso de cámara negado (pasajero) | Explica cómo darlo | `presencia.abordaje.permiso_camara` |
| Sin conexión | Nada se da por verificado; reintentar | `presencia.abordaje.sin_conexion` |
| Servicio de integridad caído | Rechazo temporal, estado intacto; reintentar | `presencia.abordaje.servicio_no_disponible` |
| Abordaje ya verificado (CA-14) | Respuesta idempotente | `presencia.abordaje.ya_verificado` |

## 5. Fuera de alcance de esta HU

- Seguimiento durante el viaje y verificación de bajada → HU-23.
- Expiración y reembolso por no abordar a tiempo → HU-20.
- Verificar sin conexión a internet.
- «¿Dónde está mi conductor?» → HU-28.

## 6. Dependencias

- HU / PB: HU-19 (reserva confirmada), HU-09 (llave y atestación), HU-29 (biometría).
- Decisiones resueltas el 08/11: **D-22** (RN-9) y **D-23** (estado *Abordada* por reserva; el viaje pasa a *En curso* con el primero, RN-7).
- Riesgo: Play Integrity real: en desarrollo es simulada; CA-7 solo se declara verificado en un teléfono físico con la atestación real (`AGENTS.md` §6).

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque A-03, A-04, A-05, A-06, A-07, A-08 y A-13 en verde.
- [ ] Probado con dos teléfonos Android físicos; verificación < 3 s medida.
- [ ] PR revisado por otro integrante.
- [ ] CI en verde (lint, pruebas, build).
- [ ] Correctitud · Eficiencia (< 3 s) · Fiabilidad · Facilidad de uso (paso 4 del flujo principal) · Mantenimiento · Seguridad e integridad · Portabilidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Esta spec refleja lo realmente construido.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-08 | Creación (borrador) | 2026-11-08 · Specs del Sprint 3 en borrador y decisiones D-22 a D-27 |
| 2026-11-08 | Aprobada por el PO | 2026-11-08 · Specs del Sprint 3 aprobadas |
