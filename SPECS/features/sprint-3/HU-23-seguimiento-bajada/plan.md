# HU-23 · Seguimiento y verificación de bajada — Plan técnico

> Fase SDD: **Plan** (Diseño). Cómo se construye lo que dice `spec.md`.
> Estado: `aprobado (2026-11-08, integrante autorizado)` · Rama: `feat/HU-23-seguimiento-bajada` en `backend`, `mobile` y raíz, apilada sobre HU-22.
> **Orden en S3: 5.ª.**
> **Requiere confirmación humana (`AGENTS.md` §14):** capa de trayecto, estados `verificada` / `verificacion_fallida` / `verificado`, tabla nueva con RLS y una **dependencia nueva**: `expo-task-manager` (oficial de Expo, MIT) para la ubicación con la pantalla apagada. Cambia `app.json` (permisos de Android).

## 1. Módulos afectados

| Carpeta | Módulo / componente | Cambio |
|---|---|---|
| backend | `presencia/posiciones` | `PosicionesService` y controlador: recibe lotes firmados con la llave de trayecto |
| backend | `presencia/trayecto.ts` (nuevo) | `evaluarTrayecto(pasajero[], conductor[])`, función pura: pares, coincidencia, velocidad máxima, simulada, resultado y motivo |
| backend | `presencia/presencia.service.ts` | Bajada: el mismo encuentro de HU-22 con `tipo = 'bajada'` (método común, ver «Decisiones de diseño»), luego evalúa y deja la reserva `verificada` o `verificacion_fallida`. La liberación de HU-24 se encola en esa transacción desde HU-24 (SP172) |
| backend | `viajes/estado-viaje.service.ts` | `en_curso → verificado` |
| mobile | `src/viajes/seguimiento.ts` (nuevo) | Tarea en segundo plano: `Location.startLocationUpdatesAsync` cada 15 s con servicio en primer plano y notificación; cola en memoria; lotes firmados con `firmarTrayecto` |
| mobile | `src/app/viaje-activo/[id].tsx` (nuevo) | «En viaje a {destino}», indicador «Compartiendo tu ubicación cada 15 s», acción «Verificar bajada» (conductor, reutiliza «Mostrar código») / «Escanear QR de bajada» (pasajero, reutiliza el escáner), resultado «Viaje verificado» |
| mobile | `app.json` | Plugin de `expo-location` con `isAndroidBackgroundLocationEnabled` e `isAndroidForegroundServiceEnabled` |

Reutiliza: todo el encuentro de HU-22 (`desafios_handshake`, `pruebas_presencia`, `FirmaTrayectoGuard`, `geo.ts`), `@AccionSensible`, `EstadoViajeService`, `AuditoriaService`.

## 2. Cambios al modelo de datos

| Tabla | Cambio | Restricciones | ¿`organizacion_id` + RLS? |
|---|---|---|---|
| `puntos_gps` | Nueva: `id`, `organizacion_id`, `viaje_id`, `usuario_id`, `lat`, `lng`, `precision_m`, `tomada_en`, `simulada`, `recibido_en` | `UNIQUE(viaje_id, usuario_id, tomada_en)` (los repetidos se ignoran con `ON CONFLICT DO NOTHING`, CA-9) | Sí |
| `reservas` | Agrega `evaluacion JSONB NULL` (pares, coincidencia, velocidad máxima, motivo) | — | (ya con RLS) |

Migración: `016_puntos_gps`. No borra ni transforma datos. Se guarda la posición del conductor una sola vez por viaje (sirve a todas sus reservas). La firma de cada lote se verifica al recibirlo; no se guarda por punto. Cambia de `ssd.md` §6: `puntos_gps` es del viaje y del usuario, no de la reserva.

Retención: sin borrado automático en v1 (ponytail: borrar puntos de viajes pagados hace más de N días cuando haya política de datos).

## 3. Endpoints

| Método | Ruta | Rol | Firma | Request → Response | Errores (`codigo`) |
|---|---|---|---|---|---|
| POST | `/api/v1/viajes/:id/posiciones` | conductor del viaje | llave de trayecto | `{ puntos: [{ lat, lng, precisionM, tomadaEn, simulada }] }` (1–60) → 202 `{ aceptados, ignorados }` | `VIAJE_NO_EN_CURSO` 409, `FIRMA_TRAYECTO_INVALIDA` 401 |
| POST | `/api/v1/reservas/:id/posiciones` | pasajero de la reserva | llave de trayecto | igual | `RESERVA_NO_ABORDADA` 409 (también después de la bajada, CA-12), `FIRMA_TRAYECTO_INVALIDA` 401 |
| POST | `/api/v1/viajes/:id/desafios` | conductor | llave de trayecto | `tipo: "bajada"` (de HU-22), sin ventana horaria | igual que HU-22 |
| POST | `/api/v1/reservas/:id/bajada` | pasajero | F + B (`@AccionSensible`) | `{ nonce, posicion, tokenIntegridad }` → 200 `{ estado: "verificada" \| "verificacion_fallida", motivo? }` | los de HU-22 + `RESERVA_NO_ABORDADA` 409 |

Un punto se ignora (CA-9) si `tomadaEn` es anterior al abordaje de esa persona o posterior a `now + 30 s`. Un punto con `simulada = true` sí se guarda: la evaluación lo necesita para invalidar (RN-6).

### Evaluación (`evaluarTrayecto`, RN-2 a RN-6)

1. Intervalo: del abordaje aceptado a la bajada aceptada de la reserva.
2. Velocidad: entre puntos seguidos de cada traza, distancia / tiempo > 150 km/h → `salto_imposible`.
3. Cualquier `simulada` → `ubicacion_simulada`.
4. Pares: a cada punto del pasajero, el del conductor más cercano en tiempo con |Δt| ≤ 15 s. Sin pareja = no coincidente.
5. `pares < 4` → `datos_insuficientes`; coincidentes (≤ 100 m) / puntos del pasajero < 0,80 → `trayectos_separados`.
6. Si no hay motivo: `verificada`.

La bajada rechazada por el encuentro (código, distancia, integridad) no evalúa ni cambia la reserva: se puede volver a escanear. La evaluación solo corre con la bajada aceptada y es definitiva. Una `verificacion_fallida` deja el escrow intacto y registra la alerta `presencia.verificacion_fallida` en auditoría (D-24).

### Decisiones de diseño (14/11, al empezar el backend)

- **La bajada reutiliza el encuentro del abordaje dentro de `PresenciaService`**, no en un `BajadaService` aparte: consumir el código, validar reserva, posición, distancia e integridad y calcular el hash pasan a un método común con el `tipo` (`abordaje` / `bajada`). Cada uno conserva su transacción final. Se descartó un servicio nuevo porque duplicaba la validación de A-05, A-06 y A-07 (lo que `copias` de `verificar.py` frena).
- **Un código de bajada no sirve para abordar y viceversa:** el consumo filtra por `tipo`. El de bajada no tiene ventana horaria (RN-7) pero exige el viaje `en_curso`; si no, `VIAJE_NO_EN_CURSO` 409.
- **Estado previo de cada encuentro:** abordaje exige `confirmada`; bajada, `abordada` (si no, `RESERVA_NO_ABORDADA` 409). Bajada repetida sobre una reserva ya evaluada responde su estado con `yaVerificado`, sin otra prueba ni otra evaluación.
- **La evaluación corre en la transacción de la bajada aceptada**: `UPDATE reservas … WHERE estado = 'abordada'` con el resultado y `evaluacion`; dos bajadas a la vez, gana una. `evaluarTrayecto` es una función pura en `trayecto.ts` (sin base), con las pruebas de borde.
- **Orden de los motivos** cuando hay varios: `ubicacion_simulada`, `salto_imposible`, `datos_insuficientes`, `trayectos_separados`. El primero que aplica es el que se guarda; `evaluacion` guarda igual porcentaje, pares y velocidad máxima.
- **Intervalo del conductor:** del abordaje aceptado de esa reserva a su bajada, ±15 s para emparejar los bordes (RN-2).
- **Posiciones del conductor** solo mientras el viaje está `en_curso` y tiene al menos una reserva `abordada` (RN-8: sin pasajeros a bordo no hay nada que verificar); si no, `VIAJE_NO_EN_CURSO` 409. Las del pasajero, solo con su reserva `abordada` (CA-12).
- **Se ignora sin error** (CA-9) el punto con `tomadaEn` anterior al primer abordaje aceptado (pasajero: el suyo; conductor: el primero del viaje) o posterior a `now + 30 s`, y el repetido (`createMany` con `skipDuplicates`). La respuesta cuenta `aceptados` e `ignorados`.
- **La llave de trayecto decide quién envía:** la del conductor (`reservaId` nulo) solo para `/viajes/:id/posiciones` de su viaje; la del pasajero solo para `/reservas/:id/posiciones` de esa reserva. Cualquier otra combinación es `FIRMA_TRAYECTO_INVALIDA` 401, igual que una llave de otra organización (A-13, sin oráculo).
- **Viaje `verificado` (D-23, RN-10)** en `EstadoViajeService.recalcular`: `en_curso → verificado` con alguna reserva `verificada`/`pagada` y ninguna `pendiente`, `confirmada`, `abordada` o `verificacion_fallida`. Una fallida deja el viaje `en_curso` (lo resuelve D-24) sin frenar el pago de las demás, que es por reserva.
- **La liberación del pago no se encola aquí:** queda en HU-24 (SP172), que la agrega a la transacción de la bajada verificada. HU-23 deja la reserva `verificada` y su `hash_prueba` de bajada.
- **Límite conocido:** un lote del pasajero que pasa la comprobación de estado en el mismo instante en que se confirma su bajada se guarda pero no entra en la evaluación (ponytail: sin candado; agregar `FOR SHARE` de la reserva si las pruebas reales lo muestran).
- **El abordaje devuelve `llaveTrayectoId`** (agregado al contrato de HU-22, compatible): el pasajero lo necesita para firmar sus posiciones (`X-Llave-Trayecto-Id`). También al volver a escanear ya abordada y cuando otro escaneo simultáneo ganó: la llave de esa petición queda vigente.
- **La bajada repetida no necesita código nuevo:** si la reserva ya se evaluó, responde su resultado antes de mirar el código. Con un solo pasajero el viaje ya está `verificado` y el conductor no puede emitir otro; la app reintenta con el mismo.
- **Velocidad redondeada a 0,1 km/h antes de decidir:** se guarda y se decide con el mismo valor (150 exactos daban 150,0000001 en coma flotante).
- **Alias de la llave de trayecto en el teléfono** (anotado en HU-22): ser conductor de un viaje y pasajero de otro a la vez comparte el alias `uniride.llave.trayecto`. En el servidor no choca (una vigente por persona y viaje); se resuelve en la parte del cliente.

### Consultas (sin N+1)

| Endpoint | Consultas |
|---|---|
| `POST /viajes/:id/posiciones` | guard: 1 llave + dispositivo · 1 consulta: el primer abordaje aceptado de un viaje suyo, en curso y con alguna reserva abordada · 1 `INSERT … ON CONFLICT DO NOTHING` del lote |
| `POST /reservas/:id/posiciones` | guard · 1 reserva con su prueba de abordaje aceptada · 1 `INSERT` del lote |
| `POST /viajes/:id/desafios` (`bajada`) | las de HU-22, con el estado del viaje en la misma consulta |
| `POST /reservas/:id/bajada` | Tx 1 como el abordaje · Tx 2: 1 `SELECT` de la hora de abordaje · 1 `SELECT` de los puntos de las dos personas en el intervalo (`usuario_id IN (…)`, ordenado) · `UPDATE` reserva · `INSERT` prueba · `recalcular` (3 sentencias) · auditoría |

Índice: `UNIQUE(viaje_id, usuario_id, tomada_en)` sirve a la vez para ignorar repetidos y para el rango de la evaluación. La evaluación es en memoria sobre ≤ unos cientos de puntos (240 en una hora por persona).

### Amenazas y su prueba de ataque

| Amenaza | Qué la frena | Prueba |
|---|---|---|
| A-05 | Código de bajada de un uso y 30 s, consumido por `tipo` | `a-05-repeticion-handshake.e2e-spec.ts`: segundo uso del código de bajada y código de abordaje usado para bajar → `CODIGO_INVALIDO` |
| A-06 | ≤ 50 m entre las posiciones del desafío de bajada | `a-06-qr-lejos.e2e-spec.ts`: bajada a 60 m → 422 y la reserva sigue `abordada` |
| A-07 | `evaluarTrayecto`: saltos > 150 km/h, punto simulado, separación, pocos datos | `trayecto.spec.ts` (bordes) y `a-07-trayecto.e2e-spec.ts`: trazas falsas enviadas por la API → `verificacion_fallida` con su motivo |
| A-08 | `FirmaTrayectoGuard` + la llave del rol correcto; bajada `@AccionSensible` | `a-08-posiciones.e2e-spec.ts`: sin firma, firma alterada, llave del pasajero en la ruta del conductor y al revés, llave de otra reserva, persona ajena; bajada sin huella en `a-08-acciones-sensibles` |
| A-13 | `organizacion_id` + RLS en `puntos_gps`; todo en `enOrganizacion` | `a-13-presencia.e2e-spec.ts`: posiciones y bajada sobre una reserva de otra organización = inexistente; el rol de la API no ve puntos ajenos |

Swagger actualizado: [x] (14/11: bajada, posiciones del conductor y del pasajero con sus errores; `tipo: bajada` en desafíos; `llaveTrayectoId` en el abordaje; posiciones justificadas sin huella en el catálogo de acciones sensibles)

## 4. Pantallas y voz

| Cliente | Pantalla | Pasos del flujo | Claves i18n nuevas |
|---|---|---|---|
| mobile | Viaje en curso (indicador, permisos, estado sin conexión) | — | `presencia.trayecto.*` |
| mobile | Bajada: conductor «Mostrar código», pasajero «Escanear QR de bajada» → resultado «Viaje verificado» o motivo | 1 (automático tras el escaneo) | `presencia.bajada.*` |

Sin comandos de voz (HU-28).

## 5. Diagramas UML

- [ ] Secuencia: seguimiento y bajada (actualiza `ssd.md` §9).
- [ ] Actividad: `evaluarTrayecto`.
- [ ] Clases: `PuntoGps`.

```mermaid
sequenceDiagram
  participant C as App conductor
  participant P as App pasajero
  participant API
  loop cada 15 s (segundo plano)
    C->>API: POST /viajes/:id/posiciones (llave de trayecto)
    P->>API: POST /reservas/:id/posiciones (llave de trayecto)
  end
  C->>API: POST /viajes/:id/desafios {tipo: bajada}
  P->>API: POST /reservas/:id/bajada (F+B)
  API->>API: encuentro HU-22 + evaluarTrayecto
  API->>API: tx: reserva verificada + liberación encolada (HU-24) + viaje recalculado
  API-->>P: verificada
```

## 6. Estrategia de pruebas

| Criterio / amenaza | Tipo | Archivo de prueba |
|---|---|---|
| CA-4, CA-5, CA-6, CA-7, CA-10 (79 % vs 80 %, 150 vs 151 km/h, 3 vs 4 pares, Δt 15 vs 16 s, un punto simulado) | unitaria | `backend/src/presencia/trayecto.spec.ts` |
| CA-1, CA-2 lote con horas antiguas, CA-9, CA-12 | e2e | `backend/test/presencia/posiciones.e2e-spec.ts` |
| CA-3, CA-11, CA-13, CA-15 | e2e | `backend/test/presencia/bajada.e2e-spec.ts` |
| A-07 trazas falsas por API | ataque e2e | `backend/test/ataques/a-07-trayecto.e2e-spec.ts` |
| CA-8 / A-08 sin firma, llave ajena, persona ajena | ataque e2e | `backend/test/ataques/a-08-posiciones.e2e-spec.ts` |
| A-05, A-06 en la bajada | ataque e2e | `a-05-repeticion-handshake.e2e-spec.ts`, `a-06-qr-lejos.e2e-spec.ts` (casos de bajada) |
| CA-14 / A-13 | ataque e2e | `a-13-presencia.e2e-spec.ts` |
| Mobile: cola, lotes, reintento sin conexión, parar tras la bajada | Jest | `mobile/src/__tests__/seguimiento.test.ts` |
| Viaje real con dos teléfonos y pantalla apagada | manual en teléfonos físicos | checklist en MEMORY |

Metas de rendimiento: la bajada responde < 3 s (la evaluación es en memoria sobre ≤ unos cientos de puntos).

## 7b. Con qué se cruza

- **HU-22:** el encuentro se vuelve común a abordaje y bajada (mismo método); sus pruebas e2e y de ataque deben seguir en verde sin cambios. El DTO de desafíos acepta `bajada`.
- **HU-19:** «Mis viajes» y los pasajeros del conductor muestran `verificada` y `verificacion_fallida`; `recalcular` gana `en_curso → verificado`.
- **HU-29:** la bajada entra al catálogo de acciones sensibles (`a-11-catalogo-sensible`, `a-08-acciones-sensibles`).
- **HU-24:** encola la liberación en la transacción de la bajada verificada y usa su `hash_prueba`.
- **HU-20 / HU-26 (D-24):** resuelven la `verificacion_fallida`; el viaje queda `en_curso` mientras tanto.
- **HU-25 / HU-28:** leerán `puntos_gps` (RN-8: solo para verificar y esas historias).

## 7. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Android corta la ubicación en segundo plano (ahorro de batería del fabricante) | Alta | Alto | Servicio en primer plano con notificación; los puntos faltantes cuentan como no coincidentes; probar en el Infinix |
| La cola en memoria se pierde si el sistema mata la app | Media | Medio | ponytail: cola en memoria; persistirla si las pruebas en el teléfono muestran pérdidas |
| Falsos rechazos por GPS ruidoso | Media | Medio | Umbrales de la spec (100 m, 80 %); revisar con los datos de las pruebas reales antes de la demo |

## 8. Tareas propuestas (se copian a backlog.md al aprobar)

| Tarea | Horas | Responsable |
|---|---|---|
| SP163 · Migración `016_puntos_gps` y `reservas.evaluacion` | 1 | @[POR DEFINIR] |
| SP164 · `evaluarTrayecto` con pruebas de borde | 3 | @[POR DEFINIR] |
| SP165 · Endpoints de posiciones (lotes, filtros, idempotencia) | 3 | @[POR DEFINIR] |
| SP166 · Bajada: encuentro, evaluación, estados y alerta | 3 | @[POR DEFINIR] |
| SP167 · Pruebas e2e y de ataque A-05, A-06, A-07, A-08, A-13 | 4 | @[POR DEFINIR] |
| SP168 · Mobile: seguimiento en segundo plano con `expo-task-manager` (dependencia autorizada el 08/11) y permisos | 5 | @[POR DEFINIR] |
| SP169 · Mobile: viaje en curso y bajada | 3 | @[POR DEFINIR] |
| SP170 · Viaje real con dos teléfonos (pantalla apagada, sin señal) | 2 | @[POR DEFINIR] |
