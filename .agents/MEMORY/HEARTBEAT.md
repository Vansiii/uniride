# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-14

**Sprint actual:** Sprint 3 · Viaje completo verificado y pagado (37 PHU con HU-10, Release 1.0).
**Foco:** HU-22, backend terminado (SP154–SP158) en `feat/HU-22-verificacion-abordaje`; sigue mobile (SP159–SP161).

## Estado actual

- **En `develop`:** Sprint 1 y 2, HU-10 y HU-29 (PR #27, #28, punteros #29) y **HU-19** (raíz #30, backend #18, mobile #18; fusionada el 13/11).
- **HU-22:** ramas `feat/HU-22-verificacion-abordaje` creadas el 14/11 desde `develop` en la raíz (`d62238f`), `backend` (`c341be0`) y `mobile` (`508eebc`). Ya no van apiladas: HU-19 está fusionada. Spec y plan aprobados el 08/11; SP154–SP162 en el backlog.
- **Pendientes de HU-19 (no bloquean HU-22):** ver «Próximo paso» 2.

## Última sesión (14/11, HU-22 backend)

- **Backend `feat/HU-22-verificacion-abordaje`** (`d6203a2`…`8efbfe2`, sin push): migración `015_presencia` (`llaves_trayecto`, `desafios_handshake`, `pruebas_presencia`, RLS y GRANT sin DELETE); `verificarFirmaPeticion` compartida y `FirmaTrayectoGuard`; módulo `presencia` con `POST /viajes/:id/llave-trayecto` (F+B, integridad), `POST /viajes/:id/desafios` (llave de trayecto, QR de 30 s) y `POST /reservas/:id/abordaje` (F+B); `EstadoViajeService` pasa `reservado → en_curso`.
- Decisiones de diseño en `plan.md` §3 (el código se gasta sin filtrar por viaje y otro viaje da `SIN_RESERVA`; la llave se valida antes de gastar el código; Play Integrity al final). Contrato para la app: abordaje responde `{ estado, yaVerificado }`; los errores en `plan.md` §3 y Swagger.
- **Verificado:** `verificar.py backend` en verde (lint, formato, pruebas, e2e 692, build). Prueba real contra el backend de `entorno.py` (`.harness/evidencias/HU-22/api-real.txt`): llave 201, código 201 (30 s, sin huella), abordaje 200 en 96 ms, repetición idempotente, GPS simulado 422, otra llave 401; viaje `en_curso`.
- Las e2e de concurrencia (A-09 recarga y reserva, creación de billetera) fallaron una vez por «Unable to start a transaction» con la PC cargada (otro PostgreSQL arriba y 1,6 GB libres); aisladas y en la corrida siguiente pasaron.
- La semilla de `entorno.py` falló por la FK de HU-19 en `movimientos_billetera.reserva_id`: ahora crea una organización, un viaje y una reserva reales.

## Próximo paso concreto

1. **HU-22 parte 2, mobile:** SP159 (llave de trayecto nativa sin biometría y `cabecerasFirmaTrayecto`) → SP160 «Mostrar código» → SP161 «Escanear QR» con `expo-camera` (autorizada). Luego parte 3 (verificar) y 3b con dos teléfonos (SP162, < 3 s).
2. **Pedido del usuario (14/11):** acelerar las e2e del backend (≈5 min) con lo que ya funcionó en la plantilla; hacerlo en una sesión aparte, sin debilitar pruebas.
3. **HU-19, pendiente si nadie lo hizo:** revisión de código por otro integrante, reservar y «Mis viajes» en el teléfono físico (SP151/SP152) y TalkBack, y UML del plan.
4. Después: HU-23 → HU-24. Dependencia autorizada: `expo-task-manager` (SP168).

## Sin verificar

- HU-19: reservar y «Mis viajes» solo con Jest y contra el backend de pruebas; falta el teléfono físico y TalkBack. El bloqueo real se probó en Hardhat local, no en Amoy. Las reservas `pendiente` se confirman con el worker de 5 s; si la cola falla, queda la alerta `reserva.bloqueo.atascado` (5 intentos).
- HU-29: bloqueo del sistema tras intentos fallidos (`comun.biometria.bloqueada`) solo con Jest: el Infinix X669 no bloqueó tras 16 rechazos en el diálogo y desbloquear con patrón anula el bloqueo.
- HU-10 CA-9: la llave de trayecto deja de valer con el dispositivo desactivado (e2e `a-08-abordaje`); falta verlo en el teléfono.
- HU-22: CA-7 con Play Integrity real y el abordaje < 3 s en dos teléfonos (SP162). Diagramas UML del plan §5 sin actualizar.
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
