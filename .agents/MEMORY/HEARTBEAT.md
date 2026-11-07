# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-07

**Sprint actual:** Sprint 2 · 28/10 – 03/11/2026 (sprints de 1 semana, miércoles a martes). Las fechas ya vencieron con HU-13, HU-17 y HU-18 pendientes.
**Foco:** HU-12 y HU-14 con PR abiertos y CI en verde, esperando revisión. HU-13 sigue apilada sobre HU-14, sin esperar el merge (decisión del integrante, 07/11): backend y contrato hechos, falta móvil. El despliegue va después.

## Estado actual

- **Sprint 1 cerrado:** en `origin/develop` de los 5 repositorios.
- **HU-08 y HU-09:** fusionadas en `develop`. Falta en HU-09 lo real de Play Integrity (simulado en desarrollo) y la prueba de vida nativa de HU-08.
- **SP125 (Keystore nativo, HU-09):** `mobile`, `feat/HU-09-keystore-nativo`, en origin, sin fusionar en `develop` (comprobado el 07/11).
- **HU-12:** implementada, en origin, sin fusionar en `develop` en `backend` ni en `mobile` (comprobado el 07/11).
- **HU-14:** implementada, verificada y revisada, apilada sobre HU-12, en origin con la rama `feat/HU-14-saldo-historial` en `backend` (`a53df7c`), `mobile` (`db42801`) y raíz. CI en verde en `backend` y `mobile`.
- **HU-13:** `backend` (rama `feat/HU-13-recarga-saldo`, apilada sobre HU-14) y `contracts` (misma rama, desde `develop`) implementados, verificados y sin subir. Falta SP114 (móvil) y SP129 (firmante KMS, al desplegar). Ajuste de spec y plan aprobado el 07/11.
- **PR a `develop`, en orden de fusión:** `mobile` #8 (SP125), #9 (HU-12), #10 (HU-14); `backend` #10 (HU-12), #11 (HU-14); raíz #19 (documentos).

## Última sesión (07/11)

- HU-13: aprobado el ajuste de spec y plan; implementados SP109–SP113 y SP126–SP128. Probado contra `UniCoin` en Hardhat con el backend en su proceso. Detalle en `MEMORY.md`.

## Próximo paso concreto

1. **HU-13, punto exacto:** contrato de la API listo. Sigue SP114 en `mobile`: rama `feat/HU-13-recarga-saldo` apilada sobre `feat/HU-14-saldo-historial` (aún sin crear), pantalla `src/app/recargar.tsx`, botón Recargar en Billetera y en el historial vacío, y aviso de pendiente. El QR llega como `qrImagenBase64` (PNG sin prefijo `data:`); `monto` se envía como número; la firma va solo en `confirmar`. Después, la verificación en sesión limpia y el teléfono. Grado 5: dinero.
2. En paralelo, otro integrante revisa y fusiona los PR en el orden de arriba. Tras el merge: confirmar con `git merge-base --is-ancestor`, actualizar punteros y marcar lo que corresponda.
3. Después de HU-13: HU-17 y HU-18.

## Sin verificar

- Polygon Amoy y SP23: billetera, saldo y escrow solo se probaron contra Hardhat local.
- El enlace a Polygonscan se vio y se abrió con la URL de Amoy agregada por un proxy de prueba, con un hash que no existe en esa red.
- HU-13 en Polygon Amoy: `queryFilter` sin `fromBlock` puede chocar con el límite de rango de un RPC público. La confirmación con huella real, que llega con el móvil. El arreglo de nonce del proveedor solo tiene la prueba real, sin prueba automatizada.
- CI real, Play Integrity real, StrongBox, invalidación al registrar una huella nueva.
- Escrow desde el backend: la prueba llamó al contrato y escribió los asientos por su cuenta. El flujo real llega con HU-19.
- La pestaña Billetera con datos en web: sin Keystore no hay firma, muestra "vincula este teléfono". Con datos solo se vio en el teléfono, a 360 y 412 dp.

## Bloqueos activos

- HU-13 no puede fusionarse antes que HU-12 y HU-14: esos PR dependen de otro integrante. No bloquea implementarla. Orden de `contracts`: su PR va antes que el de `backend` de HU-13.
- **Con HU-13 fusionada, producción no arranca hasta SP129 (firmante KMS).** Hacerlo al desplegar.
- Esta PC tiene Node 22 y npm 10: usar Node 24 portable, solo en el PATH del proceso y con un PATH corto (con el largo, npm no encuentra `prisma`).
- `.env` local sin `WALLET_ENCRYPTION_KEY` ni `IDENTIDAD_SECRETO`: el backend no arranca sin ellas.

## Decisiones abiertas

- **Vulnerabilidades en dependencias de producción (`npm audit`, 07/11), anteriores a HU-14, sin corregir:** `backend` 7 altas, con `@nestjs/platform-express` y `prisma` como directas; `mobile` 6 altas, con `expo-router` como directa. Cambiar dependencias requiere autorización (`AGENTS.md` §14). Decidir si se atienden antes de desplegar.
- **Para HU-19, reembolso 50/50 de un monto con centavos impares:** `reembolsar` reparte 6,175 URC de 12,35 y el libro solo guarda 2 decimales. La diferencia con la cadena queda permanente y agrega filas de auditoría en cada lectura real. Decidir antes de HU-19: redondear en el contrato o limitar los montos. Cambiar el contrato requiere autorización (`AGENTS.md` §14).
- Sin resolver para HU-09/HU-10: pedir huella al vincular y alias de llave por cuenta.
- D-08 (voz en web), D-15 (criterio de "invulnerable" con el docente).
