# HU-28 · Consultas por voz — Plan técnico

> Fase SDD: **Plan** (Diseño). Cómo se construye lo que dice `spec.md`.
> Estado: `aprobado (2026-11-15, integrante autorizado)` · Rama: `feat/HU-28-consultas-por-voz` en raíz, `backend` y `mobile`, apilada sobre HU-27 y HU-20 (orden de fusión: HU-20, HU-27, HU-28).
> **Orden en S4: 3.ª.**
> **Requiere confirmación humana (`AGENTS.md` §14):** endpoint nuevo que usa la app (`GET /reservas/:id/conductor`); es aditivo, no rompe contratos existentes.

## 1. Módulos afectados

| Carpeta | Módulo / componente | Cambio |
|---|---|---|
| backend | `presencia` | `PresenciaService.distanciaConductor(usuarioId, organizacionId, reservaId)` y `GET /reservas/:id/conductor` |
| mobile | `src/voz/interprete.ts` | Intenciones `saldo`, `conductor`, `estado_viaje`, `cancelar`, `ayuda` y elección `el {n}` en la lista de cancelables |
| mobile | `src/voz/respuestas.ts` (nuevo) | Funciones puras que arman la frase de cada intención y estado (RN-5) con `formato.ts` |
| mobile | `src/voz/acciones.ts` (nuevo) | Ejecuta cada intención: consulta, navega y devuelve la frase para pantalla y voz |
| mobile | `app/ayuda.tsx` (nuevo) | Lista de comandos con ejemplo y alternativa táctil (DESIGN_SYSTEM §6, `ayuda.tsx`); entrada desde Perfil |
| mobile | `app/reserva/[id].tsx` | Con la reserva *Confirmada*: línea «Tu conductor está a … del punto de encuentro», que se consulta al abrir y al pedirla por voz |
| mobile | `i18n/es-BO.json` | `voz.saldo.*`, `voz.conductor.*`, `voz.viaje.*`, `voz.cancelar.*`, `voz.ayuda.*` |

Reutiliza: `useVoz`, `PanelVoz` y la repregunta de HU-27; `consultarSaldo` (HU-14), `mis-reservas` y `mis-viajes` con `viajeAnclado` (SP177, RN-3); la vista previa y la pantalla `cancelar.tsx` de HU-20; `presencia/geo.ts` (distancia); `OrganizacionGuard`.

## 2. Cambios al modelo de datos

Ninguno. La posición sale de lo que ya se guarda: `desafios_handshake.conductor_lat/lng/tomada_en` (código de abordaje o de bajada, HU-22/HU-23) y `puntos_gps` del conductor en ese viaje (HU-23).

## 3. Endpoints

| Método | Ruta | Rol | F/B | Request → Response | Errores (`codigo`) |
|---|---|---|---|---|---|
| GET | `/reservas/:id/conductor` | pasajero de la reserva | — (spec RN-6 corregida) | → `{ disponible: boolean, distanciaM: number \| null, enPuntoDeEncuentro: boolean, haceSegundos: number \| null }` | `RESERVA_NO_ENCONTRADA` (404: no existe, es de otra organización, no es suya o no está *Confirmada*), 401, 403 |

**Cálculo:** dentro de `enOrganizacion`, la reserva debe ser del usuario y estar `confirmada`; se toma la posición más reciente del conductor entre el último desafío del viaje y su último punto GPS en el viaje (2 consultas con `ORDER BY … DESC LIMIT 1`, índices existentes). Si tiene ≤ 60 s (RN-4): distancia al origen del viaje con Haversine, redondeada a decenas de metros; `enPuntoDeEncuentro` si ≤ 50 m. Si no: `disponible: false` y nulos. Nunca devuelve coordenadas ni el instante exacto; tampoco escribe en el log (HU-23 RN-8).

Swagger actualizado: [x]

## 4. Pantallas y voz

| Cliente | Pantalla | Pasos del flujo | Claves i18n nuevas |
|---|---|---|---|
| mobile | Billetera | «¿Cuál es mi saldo?» → Billetera + frase | `voz.saldo.*` |
| mobile | Detalle de la reserva / del viaje | «¿Dónde está mi conductor?», «¿Cómo va mi viaje?» → viaje del momento + frase | `voz.conductor.*`, `voz.viaje.*` |
| mobile | `cancelar.tsx` (HU-20) | «Cancela mi viaje» → 0, 1 o lista de cancelables → confirmación con huella | `voz.cancelar.*` |
| mobile | `ayuda.tsx` | «Ayúdame» → Ayuda + frase | `voz.ayuda.*` |

| Comando de voz | Acción | Alternativa táctil | ¿Pide biometría? |
|---|---|---|---|
| Saldo | Lee disponible y en garantía | Pestaña Billetera | No |
| Conductor | Distancia o estado | Tarjeta anclada → detalle | No |
| Estado del viaje | Estado y pasajeros (conductor) | Tarjeta anclada → detalle | No |
| Cancelar | Abre la confirmación de HU-20 | «Cancelar reserva» / «Cancelar viaje» | **Sí**, la de HU-20 |
| Ayuda | Abre Ayuda | Perfil › Ayuda | No |

**Cancelables (RN-7):** reservas propias `confirmada` de `mis-reservas` en la organización activa y viajes propios `publicado`/`reservado` de `mis-viajes`, ordenados por salida. Con 2 o más, el panel queda escuchando la elección («el primero», «el 2») o el toque; la elección fuera de rango repregunta. Nada se cancela sin la huella de la pantalla de HU-20.

## 5. Diagramas UML

- [x] Secuencia: «¿dónde está mi conductor?».
- [x] Casos de uso: consultas y cancelación por voz (extiende HU-20).

```mermaid
sequenceDiagram
  participant App
  participant API
  participant BD as PostgreSQL
  App->>App: interpretar → conductor; viaje del momento (mis-reservas)
  App->>API: GET /reservas/:id/conductor (sesión)
  API->>BD: reserva confirmada del usuario; último desafío y último punto del conductor
  API-->>App: { distanciaM: 300, enPuntoDeEncuentro: false }
  App-->>App: pantalla + «Tu conductor está a 300 metros del punto de encuentro.»
```

## 6. Estrategia de pruebas

| Criterio / amenaza | Tipo | Archivo de prueba |
|---|---|---|
| RN-1 todas las formas; CA-16 | Jest (función pura) | `mobile/src/__tests__/voz-interprete.test.ts` |
| RN-5 una frase por estado; montos y distancias | Jest (función pura) | `mobile/src/__tests__/voz-respuestas.test.ts` |
| CA-1, CA-2 saldo | Jest | `mobile/src/__tests__/voz-consultas.test.tsx` |
| CA-3, CA-4, CA-5, CA-6, CA-7 | Jest | `voz-consultas.test.tsx` |
| CA-8, CA-9, CA-10 | Jest | `mobile/src/__tests__/voz-cancelar.test.tsx` |
| CA-11 / **A-11** cancelar por voz sin huella: ninguna petición firmada | Jest de ataque (nombre con `A-11`) | `voz-cancelar.test.tsx` |
| CA-12 ayuda; CA-15 mismo texto en pantalla y voz | Jest | `voz-consultas.test.tsx` |
| Distancia: ≤ 60 s / 61 s, 50 / 51 m, redondeo, origen del desafío o del trayecto | unitaria + e2e | `backend/src/presencia/presencia.service.spec.ts`, `backend/test/presencia/distancia-conductor.e2e-spec.ts` |
| CA-13 / A-08 sin sesión, sesión vencida, sin membresía; respuesta sin coordenadas | ataque e2e | `backend/test/ataques/a-08-distancia-conductor.e2e-spec.ts` |
| CA-14 / A-13 reserva ajena, de otra organización o no confirmada | ataque e2e | `backend/test/ataques/a-13-presencia.e2e-spec.ts` (casos nuevos) |
| En el teléfono: las cinco intenciones con la voz real | manual (registrar en MEMORY) | — |

Metas de rendimiento: no aplica.

## 7. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Sin posición reciente casi siempre antes del abordaje (el conductor no abrió el código) | Alta | Bajo | CA-4 responde hora y origen; es lo que la spec acepta (RN-4) |
| Frases parecidas entre intenciones («mi viaje») | Media | Medio | Prioridad fija en el intérprete (cancelar > conductor > estado) y pruebas de cada forma |
| Depende de HU-20 y HU-27 sin fusionar | Alta | Medio | Rama apilada; orden de fusión HU-20, HU-27, HU-28 |

## 8. Tareas propuestas (se copian a backlog.md al aprobar)

| Tarea | Horas | Responsable |
|---|---|---|
| SP190 · Backend: `GET /reservas/:id/conductor` con pruebas y ataques A-08, A-13 | 3 | @[POR DEFINIR] |
| SP191 · Intérprete y respuestas de las intenciones nuevas con pruebas | 3 | @[POR DEFINIR] |
| SP192 · Acciones por voz: saldo, conductor, estado y ayuda (pantalla `ayuda.tsx`) | 3 | @[POR DEFINIR] |
| SP193 · «Cancela mi viaje»: cancelables, elección y confirmación de HU-20; prueba A-11 | 2 | @[POR DEFINIR] |
| SP194 · Prueba en el teléfono físico | 1 | @[POR DEFINIR] |
