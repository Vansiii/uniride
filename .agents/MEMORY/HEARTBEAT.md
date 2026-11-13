# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-12

**Sprint actual:** Sprint 3 · Viaje completo verificado y pagado (37 PHU con HU-10, Release 1.0).
**Foco:** HU-19 implementada y verificada en `feat/HU-19-reserva-escrow` (backend, mobile y raíz), **sin commits ni PR todavía**. Sigue HU-22.

## Estado actual

- **Sprint 1 y 2 en `develop`**; HU-10 y HU-29 también (punteros actualizados en la raíz, PR #29).
- **HU-19 hecha en el árbol de trabajo** de las tres ramas `feat/HU-19-reserva-escrow` (creadas desde `develop`): SP145–SP153 marcadas en el backlog.
  - Backend: migración `014_reservas`, `ReservasService`, worker por `operacion`, `Cadena.bloquearReserva` (real con permit y simulada), `EstadoViajeService`, RN-11 y RN-12. 521 unitarias (cobertura 91,5 %) y 640 e2e en verde; lint, formato y build.
  - Contratos: **sin cambios**. Prueba real contra `EscrowUniRide` en Hardhat local: `backend/test/blockchain/escrow-hardhat.e2e-spec.ts` (con `HARDHAT_RPC_URL`).
  - Mobile: «Reservar y pagar» en el detalle, pantalla `reserva/[id]`, pestaña «Mis viajes» y «Tu próximo viaje» en Inicio. 439 pruebas, lint, formato, tipos y export de Android.
- **HU-10 y HU-29**: fusionadas; queda la revisión de otro integrante (ver «Sin verificar»).

## Última sesión (12/11)

- HU-19 completa en backend y app; cambios al plan registrados en `plan.md` §9 y `MEMORY.md`.
- Entorno: `node_modules` de `backend` reinstalado con npm 11; PostgreSQL de UniRide en el puerto **5434** (el 5433 lo ocupa `mekano-postgres-1`); `contracts/artifacts` recompilado.

## Próximo paso concreto

1. **HU-19:** que otra persona revise el código; commits `HU-19 SP145…SP153: …` en `backend`, `mobile` y la raíz, PR en ese orden (backend → mobile → raíz) y luego el puntero. Probar reservar en el teléfono físico (SP151/SP152) y actualizar los UML.
2. Después, en orden: HU-22 → HU-23 → HU-24. Dependencias autorizadas: `expo-camera` (SP161) y `expo-task-manager` (SP168).

## Sin verificar

- HU-19: reservar y «Mis viajes» solo con Jest y contra el backend de pruebas; falta el teléfono físico y TalkBack. El bloqueo real se probó en Hardhat local, no en Amoy. Las reservas `pendiente` se confirman con el worker de 5 s; si la cola falla, queda la alerta `reserva.bloqueo.atascado` (5 intentos).
- HU-29: bloqueo del sistema tras intentos fallidos (`comun.biometria.bloqueada`) solo con Jest: el Infinix X669 no bloqueó tras 16 rechazos en el diálogo y desbloquear con patrón anula el bloqueo.
- HU-10 CA-9 (llaves de trayecto) depende de HU-22.
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
