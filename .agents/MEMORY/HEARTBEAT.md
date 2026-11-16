# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-15 (Cierre de HU-20 · Cancelación con reembolso)

**Sprint actual:** Sprint 4 · Voz, cancelaciones y calidad (81 h estimadas).
**Foco:** HU-20 completada íntegramente (SP178..SP183). Siguiente historia: HU-27 · Reservar por voz.

## Estado actual

- **En `develop`:** Sprints 1, 2 y 3 completos con todos los PRs fusionados.
- **Ramas activas:** `feat/HU-20-cancelacion-reembolso` en raíz, `backend` y `mobile` (listas para revisión y PR).
- **Pendientes previos (no bloquean):** SP170 (viaje con 2 teléfonos en la calle); TalkBack en el teléfono; aceleración e2e backend en sesión aparte.

## Última sesión (15/11, HU-20 Completa)

- **SP178:** Migración `018_cancelaciones` (CHECK reservas, movimientos, trabajos y UNIQUE parcial reservas), función pura `politicaCancelacion` con pruebas y `EstadoViajeService.cancelar`/`expirar` con FOR UPDATE.
- **SP179:** `Cadena.reembolsarReserva`/`hashDeReembolso` (real y simulada) y worker `reembolsar_reserva` con reintentos e idempotencia.
- **SP180:** Endpoints `POST /reservas/:id/cancelar` y `POST /viajes/:id/cancelar` con firma biométrica y `@AccionSensible`, vista previa de cancelación y reembolso en `GET /reservas/:id`, plantilla `viaje_cancelado` y catálogo de acciones sensibles.
- **SP181:** `VencimientosService` con temporizador configurable y manual: expiración de reservas y viajes sin abordar pasados 15 min, resolución de reservas pendientes en viajes cancelados/expirados con correo (CA-19), y reembolso 100 % tras 24 h en verificación fallida (CA-9, D-29). 8 pruebas unitarias en verde.
- **SP182:** Pruebas e2e (`cancelar`, `cancelar-viaje`, `vencimientos`), suite de ataques A-08 (monto/política alterada), A-09 (doble reembolso), A-10 (conservación contable URC), A-13 (aislamiento org/usuario) y casos Hardhat de reembolso 100 % y 50/50.
- **SP183:** Mobile: pantalla `/cancelar` para reservas y viajes, vista previa de política (100% y 50/50), manejo de `POLITICA_CAMBIO`, compensación, biometría, botones en detalle de reserva y Mis viajes, soporte a `compensacion_cancelacion` y 6 pruebas Jest en verde.

## Próximo paso concreto

1. Crear PR de `feat/HU-20-cancelacion-reembolso` en `backend` y `mobile`, y actualizar punteros en el repo principal.
2. Continuar con **HU-27 · Reservar por voz** (SP184 a SP189).

## Sin verificar

- HU-24: el enlace al explorador del pago (historial y app) solo existe en Amoy: con Jest y pendiente del despliegue; en Hardhat el hash se verificó en la API y contra el recibo. `cancelada` en CA-3 llega con HU-20.
- HU-23: verificada (parte 3); faltan dos teléfonos moviéndose juntos (3b). Con el teléfono quieto bajo techo la velocidad entre puntos llegó a 82,9 km/h (límite 150): revisar con datos de la calle. Un lote del pasajero que llega en el mismo instante en que se confirma su bajada se guarda pero no se evalúa (límite aceptado en el plan). La liberación del pago la encola la bajada (HU-24, hecho en el backend).

- HU-19: reservar y «Mis viajes» vistos en el teléfono físico el 14/11; falta TalkBack. CA-12 «fallida» en el teléfono solo como pantalla. El bloqueo real se probó en Hardhat local, no en Amoy. Las reservas `pendiente` se confirman con el worker de 5 s; si la cola falla, queda la alerta `reserva.bloqueo.atascado` (5 intentos).
- HU-29: bloqueo del sistema tras intentos fallidos (`comun.biometria.bloqueada`) solo con Jest: el Infinix X669 no bloqueó tras 16 rechazos en el diálogo y desbloquear con patrón anula el bloqueo.
- HU-10 CA-9: la llave de trayecto deja de valer con el dispositivo desactivado (e2e `a-08-abordaje`); falta verlo en el teléfono.
- HU-22: CA-7 con Play Integrity real (simulada en desarrollo; con el despliegue). El encuentro se probó con un teléfono y la otra parte en un guion de firmas reales. La renovación del código tras un escaneo rechazado (sondeo de 3 s, `9e4ce34`) solo con Jest y e2e, sin teléfono. La posición del conductor se valida al emitir el código: al verificar puede tener hasta ≈60 s (decisión del plan). Ser conductor de un viaje y pasajero de otro a la vez comparte el alias de la llave de trayecto: va en HU-23 parte 2.
- HU-10: si la app se cierra entre el 201 y `confirmarLlave()`, el servidor queda con la llave nueva y el teléfono con la vieja; se recupera revinculando (riesgo aceptado en la revisión).
- HU-10 depende de la prueba de vida nativa de HU-08, todavía pendiente en la app: en el teléfono se usó la simulada de desarrollo.
- HU-10: `PRUEBA_VIDA_FALLIDA` y `CONFLICTO_CONCURRENTE` en la app solo con Jest (el backend los prueba en e2e); `ROSTRO_NO_COINCIDE` e `INTENTOS_AGOTADOS` vistos en el teléfono. Publicar con la llave anulada, solo con Jest (misma función que Billetera y Recarga, vistas en el teléfono).
- Play Integrity real: simulada en desarrollo. HU-22 CA-7 no se declara verificado sin un teléfono físico con atestación real.
- Polygon Amoy y SP23: billetera, saldo y escrow solo contra Hardhat local.
- HU-13 en Amoy: contrato sin desplegar, relayer sin fondos; una confirmación por transacción hasta SP129.
- StrongBox.
- HU-17, fecha vieja al volver otro día: solo con Jest. Voz de TalkBack: solo la confirma una persona.
- HU-18: OpenFreeMap sin garantía de servicio.

## Bloqueos activos

- **Producción no arranca hasta SP129** (firmante KMS del relayer y, desde HU-24, de la cuenta verificadora). Hacerlo al desplegar.
- Esta PC tiene Node 22 y npm 10: usar Node 24 portable, solo en el PATH del proceso y con un PATH corto.
- `.env` local sin `WALLET_ENCRYPTION_KEY` ni `IDENTIDAD_SECRETO`: el backend no arranca sin ellas.
- Compilar `mobile` en nativo en Windows: `LongPathsEnabled=1` y CMake 3.31.6 (MEMORY, SP133).

## Decisiones abiertas

- **Tarjeta anclada oscura (DESIGN_SYSTEM §3, «Tarjeta destacada»):** la tarjeta del viaje activo (N7, hecha en SP177) usa las tarjetas claras de Mis viajes, no el fondo `marcaProfundo`. Decidir si se cambia.

- **Billetera al volver de vincular:** sigue en «primero vincula este teléfono» hasta tocar actualizar (visto en SP144, ya era así antes de HU-29). Releer por foco abriría la huella sola si hay billetera. El usuario decidió dejarlo anotado.
- **Accesibilidad:** TalkBack no lee los `Aviso` que aparecen; falta probar mover el foco. Decidir en qué historia va.
- **Viajes que nunca salieron:** ninguna historia pasa un viaje a `expirado`; lo cubre HU-20 (S4) con la ventana de abordaje de HU-22 RN-3.
- **HU-18, «Elegir en el mapa» sin ubicación:** el pin empieza en el centro de Santa Cruz y se puede usar sin moverlo.
- **Organización suspendida:** ningún código la suspende; se resuelve en la historia que implemente la suspensión.
- **`app.super_admin` en viajes:** `publicar` y `mis-viajes` abren RLS filtrando por `conductorId`; una política por `conductor_id` sería más estrecha (`AGENTS.md` §14).
- **Sesión muerta en la app:** si el refresco falla, ninguna pantalla lleva a iniciar sesión.
- **HU-17, diferencias con el prototipo:** fecha en chips con hora escrita y origen/destino fuera de la tarjeta del mapa.
- Sin resolver para HU-09/HU-10: pedir huella al vincular y alias de llave por cuenta.
- D-08 (voz en web), D-15 (criterio de "invulnerable" con el docente).
