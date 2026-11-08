# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-08

**Sprint actual:** Sprint 3 · Viaje completo verificado y pagado (37 PHU con HU-10, Release 1.0).
**Foco:** specs de HU-10, HU-29, HU-19, HU-22, HU-23 y HU-24 **aprobadas por el PO (08/11)**; **planes aprobados (08/11)** y tareas SP134–SP176 en el backlog. D-22 a D-28 resueltas (delegadas por el integrante, 08/11). Siguiente fase: planes técnicos.

## Estado actual

- **Sprint 1 y Sprint 2 en `develop`** de los 5 repositorios: HU-08, HU-09 (con SP125 Keystore nativo), HU-12, HU-13, HU-14, HU-17, HU-18 y `fix/dependencias-audit` (Expo SDK 58) fusionados; comprobado con `git merge-base --is-ancestor` el 08/11 en `backend`, `mobile` y raíz. `backend` `develop` en `dd0b63f`.
- **Specs del Sprint 3** (`SPECS/features/sprint-3/`), aprobadas; `plan.md` aprobados (roadmap `plan aprobado`), en orden de dependencia: HU-10 (5) y HU-29 (3) → HU-19 (8) → HU-22 (8) → HU-23 (8) → HU-24 (5). Roadmap en `en spec`.
- **D-22 a D-27 resueltas** (MEMORY 08/11, «Resuelve D-22 a D-27»), reflejadas en las specs y en `ssd.md` §6 y §9:
  - D-22 llave de trayecto sin biometría, registrada en una petición F+B, solo para el código rotativo y las posiciones.
  - D-23 estado por reserva; el del viaje se deriva, sin transiciones nuevas.
  - D-24 verificación fallida retiene el escrow con alerta (resuelve HU-20/HU-26).
  - D-25 precio en múltiplos de 0,02 URC al publicar.
  - D-26 la búsqueda oculta los viajes propios.
  - D-27 cuenta suspendida no reserva ni recibe reservas nuevas.
  - D-28 HU-10 sube a S3: volver a vincular (huella nueva o teléfono nuevo) con prueba de vida contra el carnet; la llave sigue anulándose con cada huella nueva.
- Cambios sin commit en la raíz: specs de S3, `MEMORY.md`, `HEARTBEAT.md`, `roadmap.md`, `ssd.md`.

## Última sesión (08/11)

- Análisis completo del harness, documento técnico, `ssd.md`, `DESIGN_SYSTEM.md` §9–§10, contrato `EscrowUniRide`, `FirmaDispositivoGuard`, Prisma y módulo nativo de la llave.
- Hallazgo: la llave de HU-09 exige huella en cada firma (`setUserAuthenticationParameters(0, …)`), incompatible con el QR rotativo y las posiciones cada 15 s → D-22.
- Redactadas las specs, resueltas D-22 a D-28, PO aprobó las 6 specs; planes aprobados por el integrante con lo de §14, tareas SP134–SP176 en el backlog; PR de la raíz con todo.
- HU-10 sube a S3 (D-28): causa del callejón sin salida en `LlaveDispositivoModule.kt` (anulación reducida a «Actualiza la app») y en `DispositivosService` (rechaza con dispositivo activo, `UNIQUE(usuario_id)`).

## Próximo paso concreto

1. Implementar en orden, apilando ramas `feat/HU-xx-slug` desde `develop` en cada repositorio tocado: **HU-10 (SP134)** → HU-29 → HU-19 → HU-22 → HU-23 → HU-24.
2. Dependencias autorizadas: `expo-camera` (SP161) y `expo-task-manager` (SP168), con `npx expo install`.
3. Antes de HU-24 en Amoy: otorgar `ROL_OPERADOR`/`ROL_VERIFICADOR` (Ignition no lo hace) y fondear la cuenta verificadora.

## Sin verificar

- HU-10 depende de la prueba de vida nativa de HU-08, todavía pendiente en la app.
- Play Integrity real: simulada en desarrollo. HU-22 CA-7 no se declara verificado sin un teléfono físico con atestación real.
- Polygon Amoy y SP23: billetera, saldo y escrow solo contra Hardhat local.
- HU-13 en Amoy: contrato sin desplegar, relayer sin fondos; una confirmación por transacción hasta SP129.
- StrongBox; invalidación de la llave al registrar una huella nueva.
- Dev build con SDK 58 en teléfono físico (Keystore de HU-09).
- HU-17, fecha vieja al volver otro día: solo con Jest. Voz de TalkBack: solo la confirma una persona.
- HU-18: OpenFreeMap sin garantía de servicio.

## Bloqueos activos

- **Producción no arranca hasta SP129** (firmante KMS del relayer y, desde HU-24, de la cuenta verificadora). Hacerlo al desplegar.
- Esta PC tiene Node 22 y npm 10: usar Node 24 portable, solo en el PATH del proceso y con un PATH corto.
- `.env` local sin `WALLET_ENCRYPTION_KEY` ni `IDENTIDAD_SECRETO`: el backend no arranca sin ellas.
- Compilar `mobile` en nativo en Windows: `LongPathsEnabled=1` y CMake 3.31.6 (MEMORY, SP133).

## Decisiones abiertas

- **Accesibilidad:** TalkBack no lee los `Aviso` que aparecen; falta probar mover el foco. Decidir en qué historia va.
- **Viajes que nunca salieron:** ninguna historia pasa un viaje a `expirado`; lo cubre HU-20 (S4) con la ventana de abordaje de HU-22 RN-3.
- **HU-18, «Elegir en el mapa» sin ubicación:** el pin empieza en el centro de Santa Cruz y se puede usar sin moverlo.
- **Organización suspendida:** ningún código la suspende; se resuelve en la historia que implemente la suspensión.
- **`app.super_admin` en viajes:** `publicar` y `mis-viajes` abren RLS filtrando por `conductorId`; una política por `conductor_id` sería más estrecha (`AGENTS.md` §14).
- **Sesión muerta en la app:** si el refresco falla, ninguna pantalla lleva a iniciar sesión.
- **HU-17, diferencias con el prototipo:** fecha en chips con hora escrita y origen/destino fuera de la tarjeta del mapa.
- Sin resolver para HU-09/HU-10: pedir huella al vincular y alias de llave por cuenta.
- D-08 (voz en web), D-15 (criterio de "invulnerable" con el docente).
