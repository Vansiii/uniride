# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-06

**Sprint actual:** Sprint 2 · 28/10 – 03/11/2026 (sprints de 1 semana, miércoles a martes). Las fechas ya vencieron con HU-14, HU-13, HU-17 y HU-18 pendientes.
**Foco:** HU-12 implementada y verificada, ramas subidas y PR pendientes de fusionar. Una HU pasa a la siguiente cuando llega a `develop`; el despliegue va después.

## Estado actual

- **Sprint 1 cerrado:** en `origin/develop` de los 5 repositorios.
- **HU-08 y HU-09:** fusionadas en `develop`. Falta en HU-09 lo real de Play Integrity (simulado en desarrollo) y la prueba de vida nativa de HU-08.
- **SP125 (Keystore nativo, HU-09):** commit `bf2c448` en `mobile`, `feat/HU-09-keystore-nativo`, PR pendiente. Probado en teléfono físico.
- **HU-12:** implementada, en PR.
  - `backend`, `feat/HU-12-creacion-billetera`: `7dfede4`, `fd7e892`, `996ec72`, `d3b758d`, `65d54ba`.
  - `mobile`, `feat/HU-12-creacion-billetera`: `dc9555a`, `842fdcd`, `aa35609`, `67b4e8d`, apilada sobre `bf2c448`.
  - Raíz, `feat/HU-12-creacion-billetera`: documentos; los punteros se actualizan con otro PR tras fusionar los submódulos.

## Próximo paso concreto

1. Otro integrante revisa y fusiona los PR a `develop`. En `mobile`, primero SP125 y después HU-12.
2. Tras el merge: confirmar con `git merge-base --is-ancestor`, actualizar punteros y marcar lo que corresponda.
3. Siguiente: HU-14 (depende de HU-12), luego HU-13 y HU-17/HU-18. HU-17 no depende de la billetera.

## Sin verificar

- Polygon Amoy y SP23: la billetera solo se probó contra Hardhat local.
- Enlace a Polygonscan en el teléfono, vista con datos a 412 dp, CI real, Play Integrity real, StrongBox, invalidación al registrar una huella nueva.

## Bloqueos activos

- Ninguno para subir HU-12. Esta PC tiene Node 22 y npm 10: usar Node 24 portable, solo en el PATH del proceso.
- `.env` local sin `WALLET_ENCRYPTION_KEY` ni `IDENTIDAD_SECRETO`: el backend no arranca hasta añadirlas.

## Decisiones abiertas

- Sin resolver para HU-09/HU-10: pedir huella al vincular y alias de llave por cuenta.
- D-08 (voz en web), D-10 (cola on-chain), D-15 (criterio de "invulnerable" con el docente).
