# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-14

**Sprint actual:** Sprint 3 · Viaje completo verificado y pagado (37 PHU con HU-10, Release 1.0).
**Foco:** HU-22, backend (SP154–SP158) y mobile (SP159–SP161) en `feat/HU-22-verificacion-abordaje`; sigue la parte 3 (verificar), que empieza con la build nativa.

## Estado actual

- **En `develop`:** Sprint 1 y 2, HU-10 y HU-29 (PR #27, #28, punteros #29) y **HU-19** (raíz #30, backend #18, mobile #18; fusionada el 13/11).
- **HU-22:** ramas `feat/HU-22-verificacion-abordaje` creadas el 14/11 desde `develop` en la raíz (`d62238f`), `backend` (`c341be0`) y `mobile` (`508eebc`). Ya no van apiladas: HU-19 está fusionada. Spec y plan aprobados el 08/11; SP154–SP162 en el backlog.
- **Pendientes de HU-19 (no bloquean HU-22):** ver «Próximo paso» 2.

## Última sesión (14/11, HU-22 mobile)

- **Mobile `feat/HU-22-verificacion-abordaje`** (`4af8952`, `df2e995`, `d5d5af5`, sin push): llave de trayecto nativa sin biometría (`crearLlaveTrayecto`, `firmarTrayecto`), `cabecerasFirmaTrayecto`, «Mostrar código» del conductor (una huella, QR cada 25 s, sondeo de 3 s a los pasajeros) y «Escanear QR» del pasajero con `expo-camera` 58.0.14. Accesos desde «Mis viajes» y la reserva confirmada.
- El token de integridad va atado al `X-Nonce` de la misma petición (`OpcionesFirma.nonce`). Decisiones del cliente en `plan.md` §3.
- **Verificado:** `verificar.py mobile --rapido` en verde (466 pruebas; `abordaje.test.tsx` con 21).
- `.expo/types/router.d.ts` estaba viejo (sin las rutas de HU-19) y daba 6 errores de tipos: se borró; Metro lo regenera.
- **Backend** (sesión anterior): `verificar.py backend` en verde y prueba real en `.harness/evidencias/HU-22/api-real.txt`.

## Próximo paso concreto

1. **HU-22 parte 3, verificar:** primero `expo run:android` para compilar el Kotlin nuevo (no se compiló); luego `verificaciones.md` por criterio y por riesgo, la mirada de las dos pantallas y `verificar.py --cambiados --todo`. Después la 3b con dos teléfonos (SP162, < 3 s).
2. **Pedido del usuario (14/11):** acelerar las e2e del backend (≈5 min) con lo que ya funcionó en la plantilla; hacerlo en una sesión aparte, sin debilitar pruebas.
3. **HU-19, pendiente si nadie lo hizo:** revisión de código por otro integrante, reservar y «Mis viajes» en el teléfono físico (SP151/SP152) y TalkBack, y UML del plan.
4. Después: HU-23 → HU-24. Dependencia autorizada: `expo-task-manager` (SP168).

## Sin verificar

- HU-19: reservar y «Mis viajes» solo con Jest y contra el backend de pruebas; falta el teléfono físico y TalkBack. El bloqueo real se probó en Hardhat local, no en Amoy. Las reservas `pendiente` se confirman con el worker de 5 s; si la cola falla, queda la alerta `reserva.bloqueo.atascado` (5 intentos).
- HU-29: bloqueo del sistema tras intentos fallidos (`comun.biometria.bloqueada`) solo con Jest: el Infinix X669 no bloqueó tras 16 rechazos en el diálogo y desbloquear con patrón anula el bloqueo.
- HU-10 CA-9: la llave de trayecto deja de valer con el dispositivo desactivado (e2e `a-08-abordaje`); falta verlo en el teléfono.
- HU-22: el Kotlin de la llave de trayecto sin compilar y las dos pantallas sin ver en teléfono ni web. CA-7 con Play Integrity real y el abordaje < 3 s en dos teléfonos (SP162). Un escaneo rechazado gasta el código y el conductor no lo ve hasta la renovación (≤ 25 s). Diagramas UML del plan §5 sin actualizar.
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
