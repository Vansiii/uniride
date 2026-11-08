# HU-22 · Verificación de abordaje — Plan técnico

> Fase SDD: **Plan** (Diseño). Cómo se construye lo que dice `spec.md`.
> Estado: `aprobado (2026-11-08, integrante autorizado)` · Rama: `feat/HU-22-verificacion-abordaje` en `backend`, `mobile` y raíz, apilada sobre HU-19.
> **Orden en S3: 4.ª.**
> **Requiere confirmación humana (`AGENTS.md` §14):** capa de verificación nueva (encuentro y llave de trayecto, D-22), estados `abordada` / `en_curso`, tres tablas con RLS y una **dependencia nueva**: `expo-camera` (oficial de Expo, MIT) para escanear el QR.

## 1. Módulos afectados

| Carpeta | Módulo / componente | Cambio |
|---|---|---|
| backend | `presencia` (nuevo) | `LlavesTrayectoService`, `DesafiosService`, `AbordajeService`, `geo.ts` (Haversine), controladores |
| backend | `comun/firma-dispositivo.guard.ts` | Se extrae la verificación (cabeceras, ventana, mensaje canónico, nonce) a `verificarFirmaPeticion(llavePem, …)`; la reutilizan `FirmaDispositivoGuard` y el nuevo `FirmaTrayectoGuard` |
| backend | `comun/firma-trayecto.guard.ts` (nuevo) | Cabeceras `X-Llave-Trayecto-Id`, `X-Timestamp`, `X-Nonce`, `X-Firma`; la llave debe ser del usuario, estar vigente y su `dispositivo_id` seguir activo (HU-10 CA-9) |
| backend | `viajes/estado-viaje.service.ts` (HU-19) | `reservado → en_curso` |
| mobile | `modules/llave-dispositivo` | `crearLlaveTrayecto()` y `firmarTrayecto()`: alias `uniride.llave.trayecto`, P-256 en hardware, **sin** autenticación de usuario; se reemplaza en cada viaje |
| mobile | `src/dispositivo/firma.ts` | `cabecerasFirmaTrayecto(...)` |
| mobile | `src/app/abordaje/mostrar/[viajeId].tsx` (nuevo) | Conductor: pantalla completa con QR, cuenta regresiva y pasajeros (`DESIGN_SYSTEM.md` §10.4) |
| mobile | `src/app/abordaje/escanear/[reservaId].tsx` (nuevo) | Pasajero: cámara con marco, placa del vehículo, resultado con vibración (`expo-haptics`, ya instalado) |
| mobile | `src/viajes/ubicacion.ts` | `posicionParaEncuentro()`: posición fresca con `accuracy`, `timestamp` y `mocked` de `expo-location` |

Reutiliza: `PlayIntegrityService.verificar(token, nonce)` con el `X-Nonce` de la misma petición firmada como nonce de integridad (sin ida y vuelta extra), `normalizarLlavePublica`, `RegistroNonces`, `qrcode` (ya en backend: el QR se dibuja en el servidor, sin librería de QR en el móvil), `@AccionSensible`, `enOrganizacion`.

## 2. Cambios al modelo de datos

| Tabla | Cambio | Restricciones | ¿`organizacion_id` + RLS? |
|---|---|---|---|
| `llaves_trayecto` | Nueva: `id`, `organizacion_id`, `viaje_id`, `reserva_id` (nulo para el conductor), `usuario_id`, `dispositivo_id`, `llave_publica`, `creado_en`, `revocada_en` | Única parcial `(viaje_id, usuario_id) WHERE revocada_en IS NULL` | Sí |
| `desafios_handshake` | Nueva: `id`, `organizacion_id`, `viaje_id`, `tipo` (`abordaje`/`bajada`), `nonce`, `conductor_lat`, `conductor_lng`, `conductor_precision_m`, `conductor_tomada_en`, `vence_en`, `usado_en`, `reserva_id` | `UNIQUE(nonce)`; vence 30 s | Sí |
| `pruebas_presencia` | Nueva: `id`, `organizacion_id`, `reserva_id`, `desafio_id`, `tipo`, `pasajero_lat`, `pasajero_lng`, `pasajero_precision_m`, `distancia_m`, `veredicto_integridad`, `resultado` (`aceptada`/`rechazada`), `motivo`, `hash_prueba`, `creado_en` | Única parcial `(reserva_id, tipo) WHERE resultado = 'aceptada'` | Sí |

Migración: `015_presencia`. No borra ni transforma datos. Cambia de `ssd.md` §6: el desafío es del **viaje** (un QR sirve a cualquier pasajero, un uso cada uno), no de la reserva.

`hash_prueba` = SHA-256 de la serialización canónica de `{ reservaId, tipo, nonce, conductor: {lat, lng, tomadaEn}, pasajero: {lat, lng, tomadaEn}, distanciaM, veredicto }`; HU-24 lo usa.

## 3. Endpoints

| Método | Ruta | Rol | Firma | Request → Response | Errores (`codigo`) |
|---|---|---|---|---|---|
| POST | `/api/v1/viajes/:id/llave-trayecto` | conductor del viaje | F + B (`@AccionSensible`) | `{ llavePublicaPem, tokenIntegridad }` → 201 `{ llaveTrayectoId }` | `FUERA_DE_VENTANA` 409, `SIN_RESERVAS` 409, `DISPOSITIVO_NO_INTEGRO` 422, `LLAVE_INVALIDA` 400 |
| POST | `/api/v1/viajes/:id/desafios` | conductor del viaje | llave de trayecto | `{ tipo, posicion: {lat, lng, precisionM, tomadaEn, simulada} }` → 201 `{ nonce, venceEn, qrImagenBase64, pasajeros: [...] }` | `FUERA_DE_VENTANA` 409, `SENAL_GPS` 422, `UBICACION_SIMULADA` 422, `FIRMA_TRAYECTO_INVALIDA` 401 |
| POST | `/api/v1/reservas/:id/abordaje` | pasajero de la reserva | F + B (`@AccionSensible`) | `{ nonce, posicion, tokenIntegridad, llavePublicaTrayectoPem }` → 200 `{ estado: "abordada" }` | `CODIGO_INVALIDO` 409, `DISTANCIA` 422 (con `distanciaM`), `UBICACION_SIMULADA` 422, `SENAL_GPS` 422, `DISPOSITIVO_NO_INTEGRO` 422, `SIN_RESERVA` 409, `SERVICIO_NO_DISPONIBLE` 503 |

QR: `uniride://encuentro/<nonce>`. El nonce son 32 bytes aleatorios; el QR no lleva datos personales. La app del conductor pide uno nuevo cada 25 s y apenas un escaneo lo consume (lo ve en `pasajeros`).

### Abordaje (orden; la primera transacción se confirma siempre)

1. **Tx 1 — consumir:** `UPDATE desafios_handshake SET usado_en = now(), reserva_id = $r WHERE nonce = $n AND usado_en IS NULL AND vence_en > now() AND viaje_id = <viaje de la reserva> RETURNING *`. Sin fila → `CODIGO_INVALIDO` (CA-3, CA-4, CA-10). Así el código queda gastado aunque luego se rechace (spec RN-1).
2. Reserva `confirmada` del usuario (CA-9); ya `abordada` → 200 idempotente (CA-14).
3. Posiciones: precisión ≤ 50 m, `tomadaEn` ≤ 30 s, `simulada = false` en las dos (CA-6, CA-12). Distancia Haversine ≤ 50 m (CA-5).
4. Integridad del pasajero con `X-Nonce` (CA-7).
5. **Tx 2:** `pruebas_presencia` aceptada + reserva `abordada` + `llaves_trayecto` del pasajero + `EstadoViajeService.recalcular` + auditoría. Cada rechazo también deja su `pruebas_presencia` rechazada (CA-13).

Ventana (RN-3) en `llave-trayecto` y `desafios` de tipo `abordaje`: `fecha_hora_salida − 30 min ≤ now ≤ fecha_hora_salida + 15 min`.

Swagger actualizado: [ ]

## 4. Pantallas y voz

| Cliente | Pantalla | Pasos del flujo | Claves i18n nuevas |
|---|---|---|---|
| mobile | Conductor «Mostrar código» (huella una vez al entrar) | 1 | `presencia.abordaje.*` |
| mobile | Pasajero «Escanear QR» → huella → resultado | paso 4 del flujo principal | `presencia.abordaje.*` |

Sin comandos de voz en esta historia (HU-28 agrega «¿dónde está mi conductor?»).

## 5. Diagramas UML

- [ ] Secuencia: abordaje (actualiza `ssd.md` §9).
- [ ] Clases: `LlaveTrayecto`, `DesafioHandshake`, `PruebaPresencia`.
- [ ] Despliegue: Play Integrity en la ruta del abordaje.

```mermaid
sequenceDiagram
  participant C as App conductor
  participant P as App pasajero
  participant API
  C->>API: POST /viajes/:id/llave-trayecto (F+B, integridad)
  loop cada 25 s
    C->>API: POST /viajes/:id/desafios (llave de trayecto, GPS)
    API-->>C: nonce + QR
  end
  P->>P: escanea QR
  P->>API: POST /reservas/:id/abordaje (F+B, GPS, integridad, llave de trayecto)
  API->>API: consume nonce, distancia ≤ 50 m, sin simulada, integridad
  API-->>P: abordada
  API-->>C: (siguiente desafío) pasajero verificado
```

## 6. Estrategia de pruebas

| Criterio / amenaza | Tipo | Archivo de prueba |
|---|---|---|
| CA-1, CA-11 ventana y llave del conductor | e2e | `backend/test/presencia/abordaje.e2e-spec.ts` |
| CA-2, CA-13, CA-14 | e2e | `abordaje.e2e-spec.ts` |
| CA-3, CA-4 / A-05 reuso y vencimiento | ataque e2e | `backend/test/ataques/a-05-repeticion-handshake.e2e-spec.ts` |
| CA-5 / A-06 QR enviado lejos | ataque e2e | `backend/test/ataques/a-06-qr-lejos.e2e-spec.ts` |
| CA-6, CA-12 / A-07 ubicación simulada y señal | ataque e2e | `backend/test/ataques/a-07-abordaje.e2e-spec.ts` |
| CA-7 / A-03 integridad | ataque e2e (integridad simulada en modo no íntegro) | `backend/test/ataques/a-03-abordaje.e2e-spec.ts` |
| CA-8 / A-08 firma del conductor falsa, llave de trayecto ajena o de un dispositivo inactivo | ataque e2e | `backend/test/ataques/a-08-abordaje.e2e-spec.ts` |
| CA-9, CA-10 / A-13 | ataque e2e | `backend/test/ataques/a-13-presencia.e2e-spec.ts` |
| Haversine y ventana | unitaria | `backend/src/presencia/geo.spec.ts` |
| Mobile: QR rotativo, escaneo y resultados | Jest (cámara simulada) | `mobile/src/__tests__/abordaje.test.tsx` |
| Abordaje real < 3 s con dos teléfonos | manual en teléfonos físicos | checklist en MEMORY |

Meta de rendimiento: **abordaje < 3 s** (medido en e2e sin integridad real y en el teléfono).

## 7. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Play Integrity real no conectada | Alta | Alto | Simulada solo en desarrollo; CA-7 no se declara verificado sin teléfono físico con integridad real |
| GPS impreciso bajo techo | Media | Medio | Mensaje para pedir mejor señal; 50 m de precisión |
| La llamada a Play Integrity se acerca a los 3 s | Media | Medio | Una sola llamada en la petición; medir en el teléfono |

## 8. Tareas propuestas (se copian a backlog.md al aprobar)

| Tarea | Horas | Responsable |
|---|---|---|
| SP154 · Migración `015_presencia` (3 tablas, RLS) y modelos | 2 | @[POR DEFINIR] |
| SP155 · Extraer `verificarFirmaPeticion` y crear `FirmaTrayectoGuard` | 2 | @[POR DEFINIR] |
| SP156 · Llave de trayecto del conductor y desafíos con QR | 3 | @[POR DEFINIR] |
| SP157 · Abordaje: consumo, validaciones, integridad, prueba con hash, estados | 4 | @[POR DEFINIR] |
| SP158 · Pruebas e2e y de ataque A-03, A-05, A-06, A-07, A-08, A-13 | 4 | @[POR DEFINIR] |
| SP159 · Módulo nativo: llave de trayecto sin biometría; `cabecerasFirmaTrayecto` | 2 | @[POR DEFINIR] |
| SP160 · Mobile: «Mostrar código» del conductor | 3 | @[POR DEFINIR] |
| SP161 · Mobile: «Escanear QR» con `expo-camera` (dependencia autorizada el 08/11) y resultados | 4 | @[POR DEFINIR] |
| SP162 · Prueba con dos teléfonos físicos y medición < 3 s | 1 | @[POR DEFINIR] |
