# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-02

**Sprint actual:** Sprint 2 · 28/10 – 03/11/2026 (sprints de 1 semana, miércoles a martes).
**Foco:** Fase de especificación del Sprint 2 completada al 100 %. Listo para iniciar implementación.

## Estado actual

- **Sprint 1 cerrado:** Las 8 historias de S1 (HU-06, HU-01, HU-02, HU-05, HU-03, HU-07, HU-34, HU-11) y el rediseño UI (PB-03) están en `origin/develop` de los 5 repositorios.
- **Sprint 2 (100 % especificado y planificado):**
  - **HU-08 (Verificación de identidad):** Spec y Plan aprobados. Hash HMAC-SHA256 para el carnet (A-02, Ley 164), sin SEGIP, colección Rekognition para evitar caras duplicadas, mock local. Tareas SP88–SP92.
  - **HU-09 (Vinculación de dispositivo):** Spec y Plan aprobados. ECDSA P-256 en Android Keystore, Play Integrity, firma de peticiones sensibles, prevención de replay (A-03, A-04, A-08). Tareas SP93–SP98.
  - **HU-12 (Creación de billetera):** Spec y Plan aprobados. Polygon Amoy + Relayer gasless. Custodia en modo dual sin costo base ($0 USD en local y nube con advertencia explícita en plan). Tareas SP99–SP103.
  - **HU-14 (Saldo e historial):** Spec y Plan aprobados. Libro mayor inmutable `movimientos_billetera`, desglose de saldo disponible vs escrow y conciliación contable. Tareas SP104–SP108.
  - **HU-13 (Recarga de saldo):** Spec y Plan aprobados. QR simulado (10–500 Bs), acuñación on-chain idempotente (A-09). D-13 resuelta con la firma de dispositivo de HU-09. Tareas SP109–SP114.
  - **HU-17 (Publicar viaje):** Spec y Plan aprobados. Máquina de estados oficial, cupos limitados por auto de HU-11, anti-solapamiento y RLS multi-organización (A-13). Tareas SP115–SP119.
  - **HU-18 (Buscar viajes):** Spec y Plan aprobados. Filtro geoespacial Haversine ≤ 1 km y ventana ± 30 min. D-17 resuelta mostrando insignias «Conductor verificado» y «Nuevo». Tareas SP120–SP123.

## Próximo paso concreto

1. **Iniciar implementación del Sprint 2 por orden de dependencia técnica:**
   - **Paso 1:** HU-08 (SP88–SP92) — Modelo Prisma `006_identidades`, `RekognitionService` y endpoints de verificación.
   - **Paso 2:** HU-09 (SP93–SP98) — Modelo Prisma `007_dispositivos`, `PlayIntegrityService` y `FirmaDispositivoGuard`.
   - **Paso 3:** HU-12 (SP99–SP103) y HU-14 (SP104–SP108) — Billetera Polygon Amoy y libro mayor.
   - **Paso 4:** HU-13 (SP109–SP114) — Recargas QR y acuñación con relayer.
   - **Paso 5:** HU-17 (SP115–SP119) y HU-18 (SP120–SP123) — Publicación y búsqueda de viajes.

## Bloqueos activos

- Sin teléfonos Android físicos confirmados aún (R-02, SP04): Play Integrity correrá con bypass simulado en desarrollo.

## Decisiones abiertas del Sprint 2

- **D-13 (Biometría en recarga):** RESUELTA en HU-13 mediante la llave biométrica de hardware de HU-09.
- **D-17 (Calificación en búsqueda):** RESUELTA en HU-18 con campo opcional e insignias sin estrellas ficticias.
- Abiertas para sprints futuros: D-08 (voz en web), D-10 (cola on-chain), D-15 (criterio de "invulnerable" con el docente).
