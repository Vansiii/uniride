# PB-06 · Informe de pruebas de carga

Fecha: 2026-11-18T14:47:55.242Z
Código: principal `53a9e7b` · backend `6f35fdf`
Equipo: 13th Gen Intel(R) Core(TM) i5-13420H · 12 núcleos · 16 GB · win32 x64
Node: v22.18.0

| Prueba | Usuarios simultáneos | Peticiones | p50 | p95 | Máximo | Errores 5xx | Otros errores | Meta (p95) | Resultado |
|---|---|---|---|---|---|---|---|---|---|
| Búsqueda de viajes | 20 | 6727 | 85 ms | 122 ms | 281 ms | 0 | 0 | < 2000 ms | **cumple** |
| Verificación de abordaje | 10 | 30 | 118 ms | 141 ms | 152 ms | 0 | 0 | < 3000 ms | **cumple** |

## Cómo se midió

- **Búsqueda:** 20 usuarios simultáneos durante 30 s sobre 222 viajes publicados en 2 organizaciones; cada petición busca en otra hora y algunas con destino. 1795 de las 6727 respuestas salieron vacías (la hora o el destino no coincidía con un viaje): no son errores.
- **Abordaje:** 10 usuarios simultáneos en 3 rondas (30 abordajes); cada uno con su reserva confirmada y un código recién emitido (vive 30 s). Se mide el POST que valida en el servidor el desafío firmado, el GPS a ≤ 50 m y la integridad.

## Alcance y límites (RN-2, RN-3, RN-4)

- Medición **local**: un solo equipo, PostgreSQL en Docker. La nube (AWS) puede variar.
- El cliente de prueba y la API corren en el **mismo proceso**: el cliente consume parte de la CPU, así que las cifras son una cota pesimista del servidor.
- Las firmas y los desafíos los genera el guion de pruebas, no un teléfono. La integridad del dispositivo usa la simulación de desarrollo (`MODO_EMULADOR_DEV`); Rekognition y la cadena son simulados. Sin servicios externos reales.
- No se mide la red del teléfono, el mapa ni el panel web.

## Cómo repetirla (CA-6)

1. `docker compose up -d postgres hardhat` y `cd backend && npm ci && npx prisma migrate deploy`.
2. Desde la raíz: `node scripts/carga.mjs`.
3. Compara con esta tabla; las diferencias de unos cientos de ms entre equipos son normales.
## Hallazgo de la primera corrida

Antes de esta tabla, la primera corrida del abordaje con 10 usuarios simultáneos dio **5 de 10 respuestas 5xx**: un interbloqueo de PostgreSQL (40P01) entre el `FOR UPDATE` sobre `viajes` y los bloqueos de las claves foráneas. Se corrigió en backend (PR #30, `FOR NO KEY UPDATE`) con una prueba de regresión; la tabla de arriba es la corrida posterior al arreglo.
