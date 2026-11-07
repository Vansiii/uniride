# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-07

**Sprint actual:** Sprint 2 · 28/10 – 03/11/2026 (sprints de 1 semana, miércoles a martes). Las fechas ya vencieron con HU-13, HU-17 y HU-18 pendientes.
**Foco:** HU-17 en curso: backend y móvil hechos, sigue la verificación. HU-12, HU-14 y HU-13 con PR abiertos y CI en verde, esperando revisión. Cada historia se apila sobre la anterior, sin esperar el merge (decisión del integrante, 07/11). El despliegue va después.

## Estado actual

- **Sprint 1 cerrado:** en `origin/develop` de los 5 repositorios.
- **HU-08 y HU-09:** fusionadas en `develop`. Falta en HU-09 lo real de Play Integrity (simulado en desarrollo) y la prueba de vida nativa de HU-08.
- **SP125 (Keystore nativo, HU-09):** `mobile`, `feat/HU-09-keystore-nativo`, en origin, sin fusionar en `develop` (comprobado el 07/11).
- **HU-12:** implementada, en origin, sin fusionar en `develop` en `backend` ni en `mobile` (comprobado el 07/11).
- **HU-14:** implementada, verificada y revisada, apilada sobre HU-12, en origin con la rama `feat/HU-14-saldo-historial` en `backend` (`a53df7c`), `mobile` (`db42801`) y raíz. CI en verde en `backend` y `mobile`.
- **HU-13:** rama `feat/HU-13-recarga-saldo` en `backend` y `mobile` (apiladas sobre HU-14) y `contracts` (desde `develop`), implementada, verificada en sesión limpia y en el teléfono físico, y con PR abiertos (`backend` `b15640a`, `mobile` `5cb8227`, `contracts` `cc01cbb`). Revisión hecha. Falta SP129 (firmante KMS, al desplegar). Ajuste de spec y plan aprobado el 07/11.
- **HU-17:** rama `feat/HU-17-publicar-viaje` en `backend` (`879afb8`) y `mobile` (`ab44397`), apiladas sobre HU-13, y raíz, sin subir. SP115-SP119 hechas; faltan verificación en sesión limpia, teléfono físico y PR. Su PR va después de los de HU-13.
- **PR a `develop`, en orden de fusión:** `mobile` #8 (SP125), #9 (HU-12), #10 (HU-14), #11 (HU-13); `backend` #10 (HU-12), #11 (HU-14), #12 (HU-13); `contracts` #1 (HU-13); raíz #19 (HU-12 y HU-14), #20 (HU-13).

## Última sesión (07/11)

- HU-17, móvil (SP119): pestaña Publicar con requisitos, formulario firmado, búsqueda en OpenStreetMap, mapa fijo y resultado, más `GET /viajes/limites` en `backend`. Pruebas de `mobile` y regresión de `backend` en verde; mirada en navegador con backend real, firma con llave inyectada y Nominatim real, a 360 y 412 dp. Ajustes al plan en `MEMORY.md`.

## Próximo paso concreto

1. **HU-17, punto exacto:** SP119 commiteada. Sigue la verificación en sesión limpia de CA-1 a CA-7, A-08 y A-13, con paridad contra `prototipos/sprint-2.html` (`m-publicar*`): fecha en chips y hora escrita son diferencias con el prototipo, y falta el micrófono apagado. Luego, el teléfono físico.
2. En paralelo, otro integrante revisa y fusiona los PR en el orden de arriba, con `contracts` antes que `backend`. Tras el merge: confirmar con `git merge-base --is-ancestor`, actualizar punteros y marcar lo que corresponda.
3. Después, HU-18, apilada si depende de ramas sin fusionar.

## Sin verificar

- HU-17: `POST /viajes` solo se probó con firma de una llave P-256 de prueba, en navegador. Falta en teléfono físico: huella y Keystore reales, y Nominatim y teselas desde Android.

- Polygon Amoy y SP23: billetera, saldo y escrow solo se probaron contra Hardhat local.
- El enlace a Polygonscan se vio y se abrió con la URL de Amoy agregada por un proxy de prueba, con un hash que no existe en esa red.
- HU-13 en Polygon Amoy: acuñar allí (contrato sin desplegar, sin relayer con fondos). Solo se comprobó contra su RPC público que la ventana de 1000 bloques pasa y el rango completo no.
- HU-13: una confirmación por transacción y sin reemplazar una atascada, aceptable con el relayer de desarrollo; se resuelve en SP129.
- Play Integrity real, StrongBox, invalidación al registrar una huella nueva.
- Escrow desde el backend: la prueba llamó al contrato y escribió los asientos por su cuenta. El flujo real llega con HU-19.

## Bloqueos activos

- HU-13 no puede fusionarse antes que HU-12 y HU-14: esos PR dependen de otro integrante. No bloquea implementarla. Orden de `contracts`: su PR va antes que el de `backend` de HU-13.
- **Con HU-13 fusionada, producción no arranca hasta SP129 (firmante KMS).** Hacerlo al desplegar.
- Esta PC tiene Node 22 y npm 10: usar Node 24 portable, solo en el PATH del proceso y con un PATH corto (con el largo, npm no encuentra `prisma`).
- `.env` local sin `WALLET_ENCRYPTION_KEY` ni `IDENTIDAD_SECRETO`: el backend no arranca sin ellas.

## Decisiones abiertas

- **Para HU-17, cuenta suspendida:** la spec no dice si puede publicar y hoy puede, porque `CUENTA_SUSPENDIDA` solo se exige en la billetera. Decidir si se bloquea.
- **Para HU-18, `GET /viajes/{id}`:** `ssd.md` pide miembro verificado con firma; el plan de HU-17, aprobado después, pide solo miembro de la organización, y así quedó. Confirmar o corregir `ssd.md`.
- **Vulnerabilidades en dependencias de producción (`npm audit`, 07/11), anteriores a HU-14, sin corregir:** `backend` 7 altas, con `@nestjs/platform-express` y `prisma` como directas; `mobile` 6 altas, con `expo-router` como directa. Cambiar dependencias requiere autorización (`AGENTS.md` §14). Decidir si se atienden antes de desplegar.
- **Para HU-19, reembolso 50/50 de un monto con centavos impares:** `reembolsar` reparte 6,175 URC de 12,35 y el libro solo guarda 2 decimales. La diferencia con la cadena queda permanente y agrega filas de auditoría en cada lectura real. Decidir antes de HU-19: redondear en el contrato o limitar los montos. Cambiar el contrato requiere autorización (`AGENTS.md` §14).
- Sin resolver para HU-09/HU-10: pedir huella al vincular y alias de llave por cuenta.
- D-08 (voz en web), D-15 (criterio de "invulnerable" con el docente).
