# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-07

**Sprint actual:** Sprint 2 · 28/10 – 03/11/2026 (sprints de 1 semana, miércoles a martes). Las fechas ya vencieron con HU-13, HU-17 y HU-18 pendientes.
**Foco:** HU-14 verificada, sin commit del último arreglo y sin subir. Una HU pasa a la siguiente cuando llega a `develop`; el despliegue va después.

## Estado actual

- **Sprint 1 cerrado:** en `origin/develop` de los 5 repositorios.
- **HU-08 y HU-09:** fusionadas en `develop`. Falta en HU-09 lo real de Play Integrity (simulado en desarrollo) y la prueba de vida nativa de HU-08.
- **SP125 (Keystore nativo, HU-09):** `mobile`, `feat/HU-09-keystore-nativo`, en origin, sin fusionar en `develop` (comprobado el 07/11).
- **HU-12:** implementada, en origin, sin fusionar en `develop` en `backend` ni en `mobile` (comprobado el 07/11).
- **HU-14:** implementada y verificada, apilada sobre HU-12, sin push.
  - `backend`, `feat/HU-14-saldo-historial`: `a94e23e`, `64e527b`, `00e41b1`, `4c12609` y **cambios sin commit** (el caché de `/saldo` se invalida con un movimiento confirmado, con pruebas).
  - `mobile`, `feat/HU-14-saldo-historial`: `6fe9dfa`, `8638ea0`. Sin cambios en esta sesión.
  - Raíz, `feat/HU-14-saldo-historial`: documentos sin commit.

## Última sesión (07/11, modo estándar)

- Pruebas pendientes hechas: escrow real en Hardhat, web a 360 y 412, huellas con el integrante. Resultados en `MEMORY.md`.
- Defecto hallado y corregido: tras bloquear, `/saldo` daba total 165 y disponible 150 durante 15 s, en vez de 150 y 135.
- Hallazgo para HU-19, sin corregir: ver "Decisiones abiertas".

## Próximo paso concreto

1. Con confirmación del integrante: commit del arreglo en `backend` y de los documentos en la raíz.
2. `/code-review` en una sesión nueva, antes de subir.
3. Push de las ramas de HU-14 y PR a `develop`.
4. Otro integrante revisa y fusiona en orden: en `mobile`, SP125, HU-12 y HU-14; en `backend`, HU-12 y HU-14.
5. Tras el merge: confirmar con `git merge-base --is-ancestor`, actualizar punteros y marcar lo que corresponda.
6. Siguiente, en orden (decisión del integrante, 07/11): primero subir y fusionar HU-14 en una sesión nueva; luego **HU-13**, que depende de HU-12, SP125 y el libro de HU-14, y antes de implementarla alinear su plan (lista abajo); después HU-17 y HU-18.

## Antes de implementar HU-13

- `ssd.md` §8 dice `POST /billetera/recargas` con firma y `/simular-pago` para el rol simulador; el plan dice `POST /recargas` sin firma y `/confirmar` con firma. Definir cuál queda.
- `ssd.md` §10 pide `trabajos_onchain` y un worker; el plan acuña dentro de la petición. Definir cuál queda (D-10).
- Rutas: `src/app/recargar.tsx` y `src/__tests__/`, no `app/billetera/…` ni `mobile/test/…`.
- `qrcode` es una dependencia nueva: pedir autorización (`AGENTS.md` §14).
- El movimiento nace `pendiente` y `confirmado` exige `hash_tx`: crearlo antes de acuñar, para que un corte no acredite sin asiento.
- Agregar el botón Recargar en Billetera y en el historial vacío, y el aviso de recarga pendiente.

## Sin verificar

- Polygon Amoy y SP23: billetera, saldo y escrow solo se probaron contra Hardhat local.
- El enlace a Polygonscan se vio y se abrió con la URL de Amoy agregada por un proxy de prueba, con un hash que no existe en esa red.
- CI real, Play Integrity real, StrongBox, invalidación al registrar una huella nueva.
- Escrow desde el backend: la prueba llamó al contrato y escribió los asientos por su cuenta. El flujo real llega con HU-19.
- La pestaña Billetera con datos en web: sin Keystore no hay firma, muestra "vincula este teléfono". Con datos solo se vio en el teléfono, a 360 y 412 dp.

## Bloqueos activos

- Ninguno para subir HU-14. Esta PC tiene Node 22 y npm 10: usar Node 24 portable, solo en el PATH del proceso y con un PATH corto (con el largo, npm no encuentra `prisma`).
- `.env` local sin `WALLET_ENCRYPTION_KEY` ni `IDENTIDAD_SECRETO`: el backend no arranca hasta añadirlas.

## Decisiones abiertas

- **Para HU-19, reembolso 50/50 de un monto con centavos impares:** `reembolsar` reparte 6,175 URC de 12,35 y el libro solo guarda 2 decimales. La diferencia con la cadena queda permanente y agrega filas de auditoría en cada lectura real. Decidir antes de HU-19: redondear en el contrato o limitar los montos. Cambiar el contrato requiere autorización (`AGENTS.md` §14).
- Sin resolver para HU-09/HU-10: pedir huella al vincular y alias de llave por cuenta.
- D-08 (voz en web), D-10 (cola on-chain), D-15 (criterio de "invulnerable" con el docente).
