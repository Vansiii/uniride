# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-07

**Sprint actual:** Sprint 2 · 28/10 – 03/11/2026 (sprints de 1 semana, miércoles a martes). Las fechas ya vencieron con HU-13, HU-17 y HU-18 pendientes.
**Foco:** HU-18 implementada, verificada en sesión limpia y en el teléfono, y revisada; falta subir ramas y PR cuando lo diga el integrante. HU-12, HU-14, HU-13 y HU-17 con PR abiertos; todos esperan revisión. Cada historia se apila sobre la anterior, sin esperar el merge (decisión del integrante, 07/11). El despliegue va después.

## Estado actual

- **Sprint 1 cerrado:** en `origin/develop` de los 5 repositorios.
- **HU-08 y HU-09:** fusionadas en `develop`. Falta en HU-09 lo real de Play Integrity (simulado en desarrollo) y la prueba de vida nativa de HU-08.
- **SP125 (Keystore nativo, HU-09):** `mobile`, `feat/HU-09-keystore-nativo`, en origin, sin fusionar en `develop` (comprobado el 07/11).
- **HU-12:** implementada, en origin, sin fusionar en `develop` en `backend` ni en `mobile` (comprobado el 07/11).
- **HU-14:** implementada, verificada y revisada, apilada sobre HU-12, en origin con la rama `feat/HU-14-saldo-historial` en `backend` (`a53df7c`), `mobile` (`db42801`) y raíz. CI en verde en `backend` y `mobile`.
- **HU-13:** rama `feat/HU-13-recarga-saldo` en `backend` y `mobile` (apiladas sobre HU-14) y `contracts` (desde `develop`), implementada, verificada en sesión limpia y en el teléfono físico, y con PR abiertos (`backend` `b15640a`, `mobile` `5cb8227`, `contracts` `cc01cbb`). Revisión hecha. Falta SP129 (firmante KMS, al desplegar). Ajuste de spec y plan aprobado el 07/11.
- **HU-17:** rama `feat/HU-17-publicar-viaje` en `backend` (`2585a7b`) y `mobile` (`e31b086`), apiladas sobre HU-13, y raíz, en origin. SP115-SP119 hechas, verificadas en sesión limpia y en el teléfono físico, y revisadas. PR abiertos, que van después de los de HU-13.
- **HU-18:** rama `feat/HU-18-buscar-viajes` en `backend` (`7b61c44`) y `mobile` (`a71e3db`), apiladas sobre HU-17, y raíz, solo local. SP120-SP123 y SP130 hechas, verificadas en sesión limpia (07/11), probadas en el teléfono físico y revisadas. Se fusiona después de los PR de HU-17.
- **PR a `develop`, en orden de fusión:** `mobile` #8 (SP125), #9 (HU-12), #10 (HU-14), #11 (HU-13), #12 (HU-17); `backend` #10 (HU-12), #11 (HU-14), #12 (HU-13), #13 (HU-17); `contracts` #1 (HU-13); raíz #19 (HU-12 y HU-14), #20 (HU-13), #21 (HU-17).

## Última sesión (07/11)

- HU-18, revisión de código del diff contra HU-17. Corregido en `mobile` `a71e3db`, con pruebas: pantalla de resultados que se caía con un enlace incompleto, hora ya pasada que decía «Sin resultados», aviso en el detalle de un viaje que ya no está, insignias de otra sesión, temporizador del GPS y «1000 m». `verificar.py mobile --rapido` en verde; los textos nuevos no se vieron en el navegador. Detalle en `MEMORY.md`.

## Próximo paso concreto

1. **HU-18, punto exacto:** revisión hecha y corregida (`mobile` `a71e3db`). Falta push de `backend`, `mobile` y raíz y abrir los PR cuando lo diga el integrante (van después de los de HU-17).
4. En paralelo, otro integrante revisa y fusiona los PR en el orden de arriba, con `contracts` antes que `backend`. Tras el merge: confirmar con `git merge-base --is-ancestor`, actualizar punteros y marcar lo que corresponda. El cambio de firma de `mobile` exige recompilar el APK.

## Sin verificar

- HU-18: OpenFreeMap y las teselas de relieve no dan garantía de servicio. El tope de 15 s se midió forzando que Android no responda; no se vio ocurrir bajo techo.
- HU-17, fecha vieja al volver otro día: solo con prueba de Jest, que adelanta el reloj; en el teléfono exigiría cambiar su fecha.
- HU-17 y firma: la recarga con la firma nueva se probó en el teléfono contra cadena simulada; contra contrato real, al desplegar en Amoy (decisión del integrante). La voz de TalkBack solo la confirma una persona.
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

- **Accesibilidad, para después (decisión del integrante, 07/11):** TalkBack no lee los avisos que aparecen: al cancelar la huella dice el título y salta al botón. Afecta a todos los `Aviso`. Región viva y anuncio explícito no bastaron; falta probar mover el foco al aviso. Decidir en qué historia va.
- **HU-10 (reserva):** tras registrar una huella nueva la llave queda anulada y no hay salida: el aviso dice falsamente "Actualiza la app" y "Mi teléfono" no deja volver a vincular. Quien agregue una huella pierde firmar, billetera y publicar. Decidir si HU-10 debe adelantarse antes de producción.
- **Para HU-19, viajes de una cuenta suspendida:** ya no aparecen en la búsqueda (decisión del integrante, 07/11), pero siguen en `publicado` y quien ya reservó sigue con su reserva. Cambiarlo toca la máquina de estados (`AGENTS.md` §14). Decidir qué pasa con esos viajes y sus reservas.
- **HU-18, «Elegir en el mapa» sin ubicación:** el pin empieza en el centro de Santa Cruz y «Usar este punto» se puede tocar sin moverlo. Decidir si se exige mover el pin primero.
- **Para HU-19, el conductor se encuentra a sí mismo:** la búsqueda incluye sus propios viajes, porque la spec no los excluye. Decidir si se ocultan; reservar el propio debe rechazarse en cualquier caso.
- **Viajes que nunca salieron:** ninguna historia pasa un viaje a `expirado`. Uno que ya debió salir sigue en `publicado` para siempre, aunque ya no ocupa al conductor (decisión del integrante, 07/11), y `mis-viajes` y el detalle lo muestran así. Decidir qué historia lo hace; toca la máquina de estados (`AGENTS.md` §14).
- **Organización suspendida:** ningún código pone una organización en ese estado y `POST /viajes` no lo mira. Decisión del integrante (07/11): se resuelve en la historia que implemente la suspensión.
- **`app.super_admin` en viajes:** `publicar` y `mis-viajes` abren RLS para leer los viajes del propio conductor, siempre con filtro por `conductorId`. Una política por `conductor_id` sería más estrecha; toca el diseño de RLS (`AGENTS.md` §14).
- **Sesión muerta en la app:** si el refresco falla, ninguna pantalla lleva a iniciar sesión, y Publicar lo muestra como falta de conexión. Afecta a toda la app.
- **HU-18, diferencias con el prototipo (decisión del integrante, 07/11):** se aceptan sin «Hacia», el título de resultados genérico, el nombre de pila sin inicial del apellido (RN-4) y las fechas en chips. La voz real es de HU-27.
- **HU-17, diferencias con el prototipo:** fecha en chips con hora escrita (P-08 de `DESIGN_SYSTEM.md`), y origen y destino en campos fuera de la tarjeta del mapa. Decidir si se aceptan.
- **Vulnerabilidades en dependencias de producción (`npm audit`, 07/11), anteriores a HU-14, sin corregir:** `backend` 7 altas, con `@nestjs/platform-express` y `prisma` como directas; `mobile` 6 altas, con `expo-router` como directa. Cambiar dependencias requiere autorización (`AGENTS.md` §14). Decidir si se atienden antes de desplegar.
- **Para HU-19, reembolso 50/50 de un monto con centavos impares:** `reembolsar` reparte 6,175 URC de 12,35 y el libro solo guarda 2 decimales. La diferencia con la cadena queda permanente y agrega filas de auditoría en cada lectura real. Decidir antes de HU-19: redondear en el contrato o limitar los montos. Cambiar el contrato requiere autorización (`AGENTS.md` §14).
- Sin resolver para HU-09/HU-10: pedir huella al vincular y alias de llave por cuenta.
- D-08 (voz en web), D-15 (criterio de "invulnerable" con el docente).
