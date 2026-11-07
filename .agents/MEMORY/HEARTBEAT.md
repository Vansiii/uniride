# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-07

**Sprint actual:** Sprint 2 · 28/10 – 03/11/2026 (sprints de 1 semana, miércoles a martes). Las fechas ya vencieron con HU-13, HU-17 y HU-18 pendientes.
**Foco:** HU-14 en origin: faltan sus PR y que se fusionen. Una HU pasa a la siguiente cuando llega a `develop`; el despliegue va después.

## Estado actual

- **Sprint 1 cerrado:** en `origin/develop` de los 5 repositorios.
- **HU-08 y HU-09:** fusionadas en `develop`. Falta en HU-09 lo real de Play Integrity (simulado en desarrollo) y la prueba de vida nativa de HU-08.
- **SP125 (Keystore nativo, HU-09):** `mobile`, `feat/HU-09-keystore-nativo`, en origin, sin fusionar en `develop` (comprobado el 07/11).
- **HU-12:** implementada, en origin, sin fusionar en `develop` en `backend` ni en `mobile` (comprobado el 07/11).
- **HU-14:** implementada, verificada y revisada, apilada sobre HU-12, en origin con la rama `feat/HU-14-saldo-historial` en `backend` (`a53df7c`), `mobile` (`db42801`) y raíz. Sin PR: `gh` no está instalado en esta PC.

## Última sesión (07/11, modo estándar)

- `/code-review` de la rama: 10 hallazgos. Dos corregidos en `mobile`; el resto ya estaba decidido o queda abajo para HU-13. Detalle en `MEMORY.md`.
- Suites repetidas en Node 24: backend 395 unitarias y 318 e2e; mobile 247.

## Próximo paso concreto

1. El integrante abre los PR de HU-14 a `develop`, después de los de SP125 y HU-12 de los que depende.
2. Otro integrante revisa y fusiona en orden: en `mobile`, SP125, HU-12 y HU-14; en `backend`, HU-12 y HU-14.
3. Tras el merge: confirmar con `git merge-base --is-ancestor`, actualizar punteros y marcar lo que corresponda.
4. Siguiente, en orden (decisión del integrante, 07/11): **HU-13**, que depende de HU-12, SP125 y el libro de HU-14, y antes de implementarla alinear su plan (lista abajo); después HU-17 y HU-18.

## Antes de implementar HU-13

- Libro mayor, primer uso (revisión de HU-14): definir si una clave repetida con otra billetera, tipo o monto debe fallar en vez de devolver el original (hoy `a-09-libro-mayor.e2e-spec.ts` exige lo segundo); rechazar `monto` con más de 2 decimales; definir si `fallido` es final; y qué pasa con la conciliación si un `pendiente` se atasca.

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

- HU-13 no puede fusionarse antes que HU-12 y HU-14: esos PR dependen de otro integrante. Esta PC tiene Node 22 y npm 10: usar Node 24 portable, solo en el PATH del proceso y con un PATH corto (con el largo, npm no encuentra `prisma`).
- `.env` local sin `WALLET_ENCRYPTION_KEY` ni `IDENTIDAD_SECRETO`: el backend no arranca hasta añadirlas.

## Decisiones abiertas

- **Para HU-19, reembolso 50/50 de un monto con centavos impares:** `reembolsar` reparte 6,175 URC de 12,35 y el libro solo guarda 2 decimales. La diferencia con la cadena queda permanente y agrega filas de auditoría en cada lectura real. Decidir antes de HU-19: redondear en el contrato o limitar los montos. Cambiar el contrato requiere autorización (`AGENTS.md` §14).
- Sin resolver para HU-09/HU-10: pedir huella al vincular y alias de llave por cuenta.
- D-08 (voz en web), D-10 (cola on-chain), D-15 (criterio de "invulnerable" con el docente).
