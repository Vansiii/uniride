# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-07

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

- **Dependencias (PB-01, SP131 a SP133):** rama `fix/dependencias-audit` desde `develop` en `backend`, `mobile` y raíz, sin push. `backend` con 0 vulnerabilidades. `mobile` en Expo SDK 58 (React Native 0.88.1): de 31 (6 altas) a 22 moderadas y 1 baja, dentro del propio `expo`. Regresión completa y APK de debug en verde; sin probar en teléfono. En Windows, compilar en nativo necesita rutas largas y CMake 3.31.6 (MEMORY, SP133). Esta rama no tiene el estado de HU-12 a HU-18: está en sus ramas y en sus PR.

## Próximo paso concreto

0. **Dependencias:** push y PR de `fix/dependencias-audit` en `backend`, `mobile` y raíz cuando el integrante lo diga. Al fusionar `mobile` con las ramas de HU-12 a HU-18, `package.json` y `package-lock.json` chocan: conservar las versiones del SDK 58, volver a agregar las dependencias de cada HU con `npx expo install` (maplibre incluido) y regenerar el lockfile. Probar en teléfono un dev build con SDK 58 (Keystore de HU-09). Al fusionar el PR de raíz con #19 a #22, conservar el HEARTBEAT más reciente y agregar esta línea.

1. **HU-08 y HU-09:** backend fusionado en `develop` (PR backend #8 y #9, 288 unitarias + 209 e2e). Móvil con PR abiertos: uniride-mobile#6 (SP92) y #7 (SP98); al fusionar el segundo hay conflictos aditivos en `cliente.ts`, `index.tsx`, `es-BO.json` y `respuestasApi.ts` (conservar ambos lados). Specs corregidas (`MODO_EMULADOR_DEV`).
2. **Sin verificar (requiere teléfono físico y dev build):** Rekognition y Play Integrity reales; módulos nativos de Face Liveness y Keystore con biometría (HU-09 CA-7) aún no instalados — `liveness.ts` y `keystore.ts` fallan de forma segura. Instalarlos exige confirmación de dependencia (AGENTS.md §14). Actualizar UML: secuencia de vinculación, clases (`Dispositivo`, `FirmaDispositivoGuard`) y despliegue (Play Integrity).
3. Siguiente: HU-12/HU-14, HU-13, HU-17/HU-18 (usan `@RequiereIdentidadVerificada()` y `@RequiereFirmaDispositivo()`; importar `FirmaDispositivoModule`).

## Bloqueos activos

- Sin teléfonos Android físicos confirmados aún (R-02, SP04): Play Integrity correrá con bypass simulado en desarrollo.

## Decisiones abiertas del Sprint 2

- **D-13 (Biometría en recarga):** RESUELTA en HU-13 mediante la llave biométrica de hardware de HU-09.
- **D-17 (Calificación en búsqueda):** RESUELTA en HU-18 con campo opcional e insignias sin estrellas ficticias.
- Abiertas para sprints futuros: D-08 (voz en web), D-10 (cola on-chain), D-15 (criterio de "invulnerable" con el docente).
