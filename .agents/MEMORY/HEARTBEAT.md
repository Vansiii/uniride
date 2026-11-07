# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-07

**Sprint actual:** Sprint 2 · 28/10 – 03/11/2026 (sprints de 1 semana, miércoles a martes). Las fechas ya vencieron con HU-13, HU-17 y HU-18 pendientes.
**Foco:** HU-17 en curso: backend y móvil verificados en sesión limpia y en el teléfono físico, sigue la revisión y el PR. HU-12, HU-14 y HU-13 con PR abiertos y CI en verde, esperando revisión. Cada historia se apila sobre la anterior, sin esperar el merge (decisión del integrante, 07/11). El despliegue va después.

## Estado actual

- **Sprint 1 cerrado:** en `origin/develop` de los 5 repositorios.
- **HU-08 y HU-09:** fusionadas en `develop`. Falta en HU-09 lo real de Play Integrity (simulado en desarrollo) y la prueba de vida nativa de HU-08.
- **SP125 (Keystore nativo, HU-09):** `mobile`, `feat/HU-09-keystore-nativo`, en origin, sin fusionar en `develop` (comprobado el 07/11).
- **HU-12:** implementada, en origin, sin fusionar en `develop` en `backend` ni en `mobile` (comprobado el 07/11).
- **HU-14:** implementada, verificada y revisada, apilada sobre HU-12, en origin con la rama `feat/HU-14-saldo-historial` en `backend` (`a53df7c`), `mobile` (`db42801`) y raíz. CI en verde en `backend` y `mobile`.
- **HU-13:** rama `feat/HU-13-recarga-saldo` en `backend` y `mobile` (apiladas sobre HU-14) y `contracts` (desde `develop`), implementada, verificada en sesión limpia y en el teléfono físico, y con PR abiertos (`backend` `b15640a`, `mobile` `5cb8227`, `contracts` `cc01cbb`). Revisión hecha. Falta SP129 (firmante KMS, al desplegar). Ajuste de spec y plan aprobado el 07/11.
- **HU-17:** rama `feat/HU-17-publicar-viaje` en `backend` (`fc188b0`) y `mobile` (`b8614a3`), apiladas sobre HU-13, y raíz, sin subir. SP115-SP119 hechas y verificadas en sesión limpia y en el teléfono físico; falta revisión y PR. Su PR va después de los de HU-13.
- **PR a `develop`, en orden de fusión:** `mobile` #8 (SP125), #9 (HU-12), #10 (HU-14), #11 (HU-13); `backend` #10 (HU-12), #11 (HU-14), #12 (HU-13); `contracts` #1 (HU-13); raíz #19 (HU-12 y HU-14), #20 (HU-13).

## Última sesión (07/11)

- HU-17, teléfono físico: huella y Keystore reales, cancelar, Nominatim, teselas, TalkBack y 412 dp, con firmas contadas en un registro. Se corrigieron 4 defectos que solo salían en el teléfono: el aviso quedaba fuera de la vista, salían dos huellas si se tardaba más de 30 s, un hueco sobre las pestañas y nombres largos sin su comienzo. La corrección de la huella vale para toda petición firmada y cambió el módulo nativo: **hay que recompilar el APK**. Regresión en verde en `backend`, `mobile` y `contracts`. Detalle en `MEMORY.md`.

## Próximo paso concreto

1. **HU-17, punto exacto:** teléfono físico cerrado. Sigue la revisión y el PR, cuando el integrante lo diga. Incluye el cambio de firma de `mobile` (toca HU-09, billetera y recargas): revisarlo como grado 5.
2. En paralelo, otro integrante revisa y fusiona los PR en el orden de arriba, con `contracts` antes que `backend`. Tras el merge: confirmar con `git merge-base --is-ancestor`, actualizar punteros y marcar lo que corresponda.
3. Después, HU-18, apilada si depende de ramas sin fusionar.

## Sin verificar

- HU-17: con el teléfono no se probó el dedo no registrado al publicar (sí en la recarga de HU-13, con el mismo diálogo) ni el reloj del teléfono desfasado más de 30 s (solo en Jest).
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

- **Para HU-18 o HU-19, viajes de una cuenta suspendida:** ya no puede publicar, pero lo publicado antes sigue activo. Cambiarlo toca la máquina de estados (`AGENTS.md` §14). Decidir qué pasa con esos viajes.
- **Para HU-18, `GET /viajes/{id}`:** `ssd.md` pide miembro verificado con firma; el plan de HU-17, aprobado después, pide solo miembro de la organización, y así quedó. Confirmar o corregir `ssd.md`.
- **Para HU-18, nombre del conductor:** `GET /viajes/{id}` da el nombre completo a cualquier miembro, como dice el plan; `DESIGN_SYSTEM.md` P-09 propone nombre e inicial del apellido. Decidir antes de mostrarlo.
- **Viajes que nunca salieron:** ninguna historia pasa un viaje a `expirado`. Uno que ya debió salir sigue en `publicado` y ocupa al conductor hasta 2 horas después. Decidir qué historia lo hace; toca la máquina de estados (`AGENTS.md` §14).
- **HU-17, origen y destino iguales:** se aceptan, porque la spec no lo prohíbe. Decidir si se rechazan.
- **HU-17, diferencias con el prototipo:** fecha en chips con hora escrita (P-08 de `DESIGN_SYSTEM.md`), y origen y destino en campos fuera de la tarjeta del mapa. Decidir si se aceptan.
- **Vulnerabilidades en dependencias de producción (`npm audit`, 07/11), anteriores a HU-14, sin corregir:** `backend` 7 altas, con `@nestjs/platform-express` y `prisma` como directas; `mobile` 6 altas, con `expo-router` como directa. Cambiar dependencias requiere autorización (`AGENTS.md` §14). Decidir si se atienden antes de desplegar.
- **Para HU-19, reembolso 50/50 de un monto con centavos impares:** `reembolsar` reparte 6,175 URC de 12,35 y el libro solo guarda 2 decimales. La diferencia con la cadena queda permanente y agrega filas de auditoría en cada lectura real. Decidir antes de HU-19: redondear en el contrato o limitar los montos. Cambiar el contrato requiere autorización (`AGENTS.md` §14).
- Sin resolver para HU-09/HU-10: pedir huella al vincular y alias de llave por cuenta.
- D-08 (voz en web), D-15 (criterio de "invulnerable" con el docente).
