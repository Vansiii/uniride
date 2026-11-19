# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-18 (HUs de cierre del Sprint 4 implementadas y fusionadas)

**Sprint actual:** Sprint 4 · cierre (plazo viernes 20/11/2026).
**Foco:** HU-26, HU-32, HU-33, HU-21, HU-31 y PB-06 fusionadas en `develop` (backend, web, mobile y principal), CI verde, punteros actualizados. Queda lo que solo hacen personas: pruebas en teléfono, sesiones reales de HU-30, despliegue.

## Producción (desplegada el 18/11/2026)

- **Web y API:** `https://d27m7kukd6ob9b.cloudfront.net` (CloudFront → S3 para la web, `/api/*` → EC2 por HTTP). Cuenta AWS `543118008132`, región us-east-2, perfil CLI `1p-nuevo`. Recursos nuevos `uniride-*`; los `sw1p-*` no se tocan.
- **Backend:** EC2 `i-047af04117c2b6428` con Docker (api + PostgreSQL 17). Se usó Postgres en Docker y no RDS porque el master de RDS no puede crear la función con `SET app.super_admin` (migración 003). **Sin copias de seguridad automáticas.** Acceso por SSM, variables en SSM `/uniride/env`.
- **SP129 hecho (rama `feat/SP129-firmante-kms`, commit `0a393bb`, solo local):** relayer y verificador firman con AWS KMS. Falta push, PR y revisión de otro integrante (§14).
- **Contratos en Amoy:** UniCoin `0xc1bDdbD5bb16B140e85d3bd39C354EBe78052676`, EscrowUniRide `0xff578E2Ad9C24f489Bb00E0fd9C4d42ba1974703`. Relayer `0x11B3…1cAA`, verificador `0x330D…c867` (KMS).
- **Limitaciones aceptadas:** (1) **Atestación: Play Integrity descartado** (25 USD de Play Console y la app no se publica); PB-07 la reemplaza por Key Attestation del Keystore (backend `93496ef` y mobile `8cef0bc` en `feat/PB-07-atestacion-keystore`, sin PR). **Desplegado el 18/11 desde la rama local `deploy/produccion` (SP129 + PB-07, sin PR; imagen anterior en ECR `prod-sp129` para volver atrás).** `ATESTACION_FIRMA_SHA256` = huella del APK firmado con la llave propia (`~/.uniride-firma`, guardarla). Falta SP240: probar la vinculación en un teléfono físico con ese APK (`Downloads/uniride.apk`). Compilar la app: `mobile/compilar-android/README.md`. (2) **SES en sandbox:** solo llega a correos verificados (hoy `teamkillers591@gmail.com`); la cuenta de consola de UniRide no es accesible desde la consola, solo por CLI. (3) **App móvil:** APK compilado en Docker/Linux (en Windows falla el NDK).
- Secretos de despliegue en `%TEMP%\uniride-secretos.env` (guardar fuera; incluye la llave de la cuenta desplegadora). Cambiar la contraseña del super admin `admin@uniride.local`.

## Estado actual

- **18/11:** HU-26 (alertas de fraude en web), HU-32 (resumen de organización, CO₂ = km × 0,12), HU-33 (métricas de plataforma), HU-21 (calificación mutua, migración 020 con RLS y `promedio_calificacion`), HU-31 (apariencia: tema, texto y alto contraste; 52 archivos migrados a `crearEstilos`) y PB-06 (carga local: búsqueda p95 122 ms, abordaje p95 141 ms, 0 errores 5xx; informe en `SPECS/features/sprint-4/PB-06-pruebas-carga/`). PB-06 halló y corrigió un interbloqueo real en abordajes simultáneos (`FOR NO KEY UPDATE`, backend PR #30; **pide revisión de otro integrante**, AGENTS.md §14).
- **Pendientes de personas:** SP232 (HU-31 en teléfono con TalkBack), SP194 (voz en teléfono), 5 sesiones reales de HU-30 (informe en blanco, no inventado), filas manuales de PB-05 (A-03, A-04, A-07), despliegue y SP129.
- **Hueco funcional:** el conductor no tiene en la app un acceso para calificar a sus pasajeros (API y pantalla lo soportan).
- **Local:** `registro.e2e-spec` CA-3 falla en la base local por una placa `1234ABC` de datos UAGRM; en CI pasa.

## Última sesión (17/11, HU-28 implementación)

- **Hecho:**
  - SP190 (Backend): `GET /reservas/:id/conductor` con cálculo Haversine redondeado a decenas de metros, límite 60 s, umbral 50 m, suites de ataque A-08 y A-13. Commit `6aaf7b2`.
  - SP191 (Mobile): Intérprete y respuestas puras para `saldo`, `conductor`, `estado_viaje`, `cancelar`, `ayuda` y `elegir`. 96 pruebas Jest pasando. Commit `c3368b6`.
  - SP192 / SP193 (Mobile): Acciones por voz (`acciones.ts`), pantalla `ayuda.tsx`, integración en `useVoz.ts`, detalle de reserva con distancia del conductor en tiempo real, cancelación por voz con huella y prueba de ataque A-11 (`voz-cancelar.test.tsx` y `voz-consultas.test.tsx`). Commit `70fca15`.
- **En curso / Próximo:**
  - SP194: Prueba en el teléfono Android físico (Infinix X669) con comandos de voz reales en español boliviano (`es-BO`).
  - Siguiente historia del Sprint 4: **HU-25** (Detección de anomalías, 10 h).

## Próximo paso concreto

1. **SP194:** Prueba en teléfono físico de las 5 intenciones de voz de HU-28.
2. Preparar inicio de **HU-25** (Detección de anomalías / fraude de colusión en carpooling).

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

- SP129 resuelto en la rama `feat/SP129-firmante-kms`; pendiente fusionarla en `develop`.
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
