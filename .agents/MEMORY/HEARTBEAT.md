# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-19 (mobile #31: trayecto por calles con OSRM, mapa de la reserva y panel de voz)

**Sprint actual:** Sprint 4 · cierre (plazo viernes 20/11/2026).
**Foco:** HU-26, HU-32, HU-33, HU-21, HU-31 y PB-06 fusionadas en `develop` (backend, web, mobile y principal), CI verde, punteros actualizados. Queda lo que solo hacen personas: pruebas en teléfono, sesiones reales de HU-30, despliegue.

## Producción (migrada el 19/11/2026 a otra cuenta)

> Referencia completa de la producción y cómo operarla: `SPECS/ssd.md` §13.1 y §13.2.

- **Migración 19/11:** la cuenta `543118008132` (us-east-2, perfil `1p-nuevo`) quedó sin consola (SCP de la organización); solo funciona la CLI. Se migró a la cuenta `012875038716` (us-east-1, perfil `uniride-nueva`, usuario IAM `uniride-admin`). En esa cuenta hay recursos ajenos (EC2, `zoonosis-*`, EIP `elasticidad-precio`): no se tocan.
- **Web y API (nueva):** `https://54-84-94-49.sslip.io` (API en `/api/v1`). CloudFront no se pudo crear (la cuenta exige verificación con AWS Support): se volvió al diseño D-02, con **Caddy** en el EC2 (HTTPS de Let's Encrypt, sirve `/opt/web` y hace de proxy de `/api/*` → `api:3000`).
- **EC2 nuevo:** `i-05b763d4d152d8eb9`, t3.small, EIP `54.84.94.49`, SG `sg-0b60c91dae631866f` (80/443 públicos), rol `uniride-ec2`. Contenedores `postgres`, `api` (imagen ECR `uniride-backend:prod`) y `caddy` en la red `uniride`. La base se restauró con `pg_dumpall` del 20/11 01:10 UTC (61 usuarios, 20 migraciones).
- **KMS nuevas:** `alias/uniride-relayer` → `0x9CC30BDf6A265B358e43192A074474a8F1f165F2`, `alias/uniride-verificador` → `0xE9D432639A7e64D9e67bcF1f6eBea123B72Bf6B8`, `alias/uniride-s3`. Roles otorgados a las nuevas y revocados a las viejas el 20/11 con la cuenta de despliegue `0xB4C6…2a1c`; 0,1 POL a cada una.
- **APK nuevo (20/11):** compilado desde `mobile` `develop` (`afe42bc`) con `https://54-84-94-49.sslip.io/api/v1` y la llave de firma de siempre; la huella coincide con `ATESTACION_FIRMA_SHA256`. Está en `Downloads/UniRide/apk-nuevo/uniride.apk` (fuera del repo). No incluye el trabajo sin commitear de `mobile` en `feat/HU-08-liveness-nativo`. Falta instalarlo y probar en el teléfono.
- **20/11, backend #37 desplegado** (imagen `prod-hu08` = `prod`; volver atrás con `prod-kmsfix`): `AWS_REKOGNITION_*` en SSM con el usuario `uniride-rekognition` (AmazonRekognitionFullAccess + política `liveness-sts` con `sts:GetFederationToken`). EC2 viejo `i-047af04117c2b6428` **detenido**.
- **Buckets nuevos:** `uniride-sensible-012875038716` (SSE-KMS) y `uniride-web-012875038716`.
- *Lo que sigue es la instalación anterior en `543118008132` (EC2 detenido el 20/11; CloudFront y S3 siguen ahí):*
- **Web y API (vieja):** `https://d27m7kukd6ob9b.cloudfront.net` (CloudFront → S3 para la web, `/api/*` → EC2 por HTTP). Recursos nuevos `uniride-*`; los `sw1p-*` no se tocan.
- **Backend:** EC2 `i-047af04117c2b6428` con Docker (api + PostgreSQL 17). Se usó Postgres en Docker y no RDS porque el master de RDS no puede crear la función con `SET app.super_admin` (migración 003). **Sin copias de seguridad automáticas.** Acceso por SSM, variables en SSM `/uniride/env`.
- **SP129 hecho y fusionado (backend #32, revisado por dos integrantes):** relayer y verificador firman con AWS KMS.
- **Contratos en Amoy:** UniCoin `0xc1bDdbD5bb16B140e85d3bd39C354EBe78052676`, EscrowUniRide `0xff578E2Ad9C24f489Bb00E0fd9C4d42ba1974703`. Relayer `0x11B3…1cAA`, verificador `0x330D…c867` (KMS).
- **Limitaciones aceptadas:** (1) **Atestación: Play Integrity descartado** (25 USD de Play Console y la app no se publica); PB-07 la reemplaza por Key Attestation del Keystore (backend `93496ef` y mobile `8cef0bc` en `feat/PB-07-atestacion-keystore`, sin PR). **Desplegado el 18/11 (SP129 + PB-07, fusionados en `develop` con backend #32 y #33, mobile #29; imagen anterior en ECR `prod-sp129` para volver atrás).** `ATESTACION_FIRMA_SHA256` = huella del APK firmado con la llave propia (llave y secretos guardados por el equipo fuera del repo). Falta SP240: probar la vinculación en un teléfono físico con ese APK (`Downloads/uniride.apk`). Compilar la app: `mobile/compilar-android/README.md`. (2) **Correo: Brevo desde el 19/11 (PB-08, backend #34; imagen anterior en ECR `prod-pb07`).** `CORREO_MODO=brevo` y `BREVO_*` en SSM `/uniride/env`; remitente `teamkillers591@gmail.com`, sin sandbox, 300 correos/día. SES queda como alternativa (`CORREO_MODO=ses`). (3) **App móvil:** APK compilado en Docker/Linux (en Windows falla el NDK). (4) **Rekognition Face Liveness:** No disponible en us-east-2 (daba 503); rama backend `fix/HU-08-rekognition-credenciales-dedicadas` desacopla credenciales a us-east-1 (`AWS_REKOGNITION_*`) para operar con cuenta secundaria. Requiere deploy y configurar variables en SSM `/uniride/env`.
- **Web, rediseño PB-03 (web #15, desplegado el 18/11):** despliegue actual de la web: `npm run build` en `web/` (rama `develop`), `aws s3 sync dist s3://uniride-web-012875038716 --delete --profile uniride-nueva` y en el EC2 (SSM) `aws s3 sync s3://uniride-web-012875038716 /opt/web --delete` (Caddy ya manda `index.html` sin caché). Volver atrás: recompilar el commit `94d8b0f` de `web/` y repetir.
- **Desplegar la API:** subir la imagen a ECR `uniride-backend` con una etiqueta `prod-<algo>`, y en el EC2 (SSM) `bash /opt/desplegar-api.sh <etiqueta>` (por defecto `prod`): refresca `/opt/uniride.env` desde SSM y recrea solo el contenedor `api`. Volver atrás: `bash /opt/desplegar-api.sh prod-kmsfix`.
- Secretos de despliegue en `%TEMP%\uniride-secretos.env` (guardar fuera; incluye la llave de la cuenta desplegadora). Cambiar la contraseña del super admin `admin@uniride.local`.

## Estado actual

- **18/11:** HU-26 (alertas de fraude en web), HU-32 (resumen de organización, CO₂ = km × 0,12), HU-33 (métricas de plataforma), HU-21 (calificación mutua, migración 020 con RLS y `promedio_calificacion`), HU-31 (apariencia: tema, texto y alto contraste; 52 archivos migrados a `crearEstilos`) y PB-06 (carga local: búsqueda p95 122 ms, abordaje p95 141 ms, 0 errores 5xx; informe en `SPECS/features/sprint-4/PB-06-pruebas-carga/`). PB-06 halló y corrigió un interbloqueo real en abordajes simultáneos (`FOR NO KEY UPDATE`, backend PR #30; **pide revisión de otro integrante**, AGENTS.md §14).
- **18/11, rediseño del panel web (PB-03, web #15):** barra lateral de marca, bandas de marca, componentes de reporte (`web/src/componentes/Datos.tsx`), Inicio por rol, Resumen y Métricas con gráficos y CSV, resúmenes y búsqueda en Organizaciones, Solicitudes y Alertas. Sin cambios en la API. **Decisión pendiente del equipo:** la barra lateral oscura sigue DESIGN_SYSTEM §8.11, pero la revisión del 07/11 (§3.1) pedía barra clara; si se aprueba, actualizar §3.1. La equivalencia en árboles usa 21 kg de CO₂ por árbol al año (referencia nueva). Sin verificar: ancho menor a 500 px, Afiliación e Iniciar sesión, y una sesión real en producción.
- **19/11, mobile #30 (fusionado sin revisión de otro integrante, autorizado por Vansiii; conviene revisarlo):** (1) el `fetch` global de Expo (expo/fetch) rechaza partes `{ uri }` en `FormData` y la app lo mostraba como «sin conexión» al registrar el vehículo o verificar identidad: ahora la foto va con sus bytes (`parteArchivo` en `cliente.ts`, prueba `multipart-expo-fetch.test.ts`). (2) `expo-image-picker` con `microphonePermission: false` quitaba `RECORD_AUDIO` del manifiesto: Android negaba el micrófono sin diálogo; el panel de voz ahora lo vuelve a pedir y solo manda a Ajustes si está bloqueado. (3) `Campo` con borde `bordeCampo` y fondo `superficie` (DESIGN_SYSTEM §8.4). **Falta recompilar el APK** y probar en teléfono la subida de fotos y el diálogo del micrófono. Compilación local: `npx expo prebuild --clean` (la carpeta `android/` vieja conserva el bloqueo).
- **19/11, mobile #31 (fusionado sin revisión de otro integrante, autorizado por Vansiii):** `MapaRuta` dibuja el trayecto por calles con OSRM (servidor público de demostración, aprobado; MEMORY 19/11) con tiempo y distancia, y línea punteada «Ruta aproximada» si falla. La reserva muestra mapa, vehículo con placa y distancia del conductor cada 15 s. Panel de voz rediseñado (ondas con el nivel de la voz, tocar para terminar, sugerencias, eco, «Preguntar otra cosa») y arreglos en `useVoz` (ya no queda «escuchando» si Android cierra sin resultado final). Solo JavaScript: falta probarlo en el teléfono.
- **Hallazgo por revisar (PB-07, AGENTS.md §14):** una revisión automática señala que `LlaveDispositivoModule.kt` atesta una llave temporal (`ALIAS_ATESTACION`) y no la llave del dispositivo que se registra: la atestación prueba el hardware, pero no ata esa llave a la cadena. Propuesta: `setAttestationChallenge` en la llave del dispositivo y comparar en el servidor la llave pública de la hoja con la registrada. Requiere decisión del equipo.
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
