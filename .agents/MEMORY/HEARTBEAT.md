# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-14 (HU-23 parte 3: verificación)

**Sprint actual:** Sprint 3 · Viaje completo verificado y pagado (37 PHU con HU-10, Release 1.0).
**Foco:** HU-23 verificada; sigue la 3b (dos teléfonos, SP170). HU-22 espera revisión humana y merge.

## Estado actual

- **En `develop`:** Sprint 1 y 2, HU-10 y HU-29 (PR #27, #28, punteros #29) y **HU-19** (raíz #30, backend #18, mobile #18; fusionada el 13/11).
- **HU-22:** ramas `feat/HU-22-verificacion-abordaje` creadas el 14/11 desde `develop` en la raíz (`d62238f`), `backend` (`c341be0`) y `mobile` (`508eebc`). Ya no van apiladas: HU-19 está fusionada. Spec y plan aprobados el 08/11; SP154–SP162 en el backlog.
- **Pendientes de HU-19 (no bloquean HU-22):** ver «Próximo paso» 2.

## Última sesión (14/11, HU-23 parte 3: verificación)

- **Los 15 CA de HU-23 cumplen**, con prueba automática y petición real o teléfono. Informe: `.harness/evidencias/HU-23/verificacion/informe.md`; peticiones reales: `verificacion/api-parte3.mjs` (41 comprobaciones, reutilizable).
- **Corregido:** «Viaje en curso» sin `EtiquetaEstado` (DESIGN_SYSTEM §10.4): `mobile` `6cd4b8e`. **Viaje activo anclado (N7, SP177, pedido del usuario):** arriba en Buscar y Mis viajes con la acción del momento para los dos roles, `mobile` `864659b`. Con pruebas y capturas a 360 y 412.
- **Verificado:** `verificar.py --cambiados --todo` en verde (backend 727 e2e, cobertura 91,7 %; mobile 487). Ramas apiladas sobre HU-22; orden de fusión: HU-22 y después HU-23.

## Próximo paso concreto

1. **HU-23 parte 4 (subir):** revisión de código, documentación y PR de raíz, `backend` y `mobile` (apilados sobre HU-22). SP170 (dos teléfonos) queda pendiente: el usuario todavía no puede hacerla; el merge espera esa prueba o la decisión del usuario.
2. **HU-23 parte 3b cuando haya dos teléfonos:** viaje por la calle con pantalla apagada y un tramo sin señal; medir velocidad máxima y coincidencia con GPS real y sentir la vibración del escáner. Guiones en `.harness/evidencias/HU-23/telefono/`.
3. **HU-22:** revisión de los PR por otro integrante y merge; tras el merge, punteros.
4. **Pedido del usuario (14/11):** acelerar las e2e del backend en una sesión aparte, sin debilitar pruebas.
5. **HU-19, pendiente si nadie lo hizo:** revisión, teléfono físico (SP151/SP152), TalkBack y UML del plan.
6. Después: HU-24.

## Sin verificar

- HU-23: verificada (parte 3); faltan dos teléfonos moviéndose juntos (3b). Con el teléfono quieto bajo techo la velocidad entre puntos llegó a 82,9 km/h (límite 150): revisar con datos de la calle. Un lote del pasajero que llega en el mismo instante en que se confirma su bajada se guarda pero no se evalúa (límite aceptado en el plan). La liberación del pago la encola HU-24.

- HU-19: reservar y «Mis viajes» solo con Jest y contra el backend de pruebas; falta el teléfono físico y TalkBack. El bloqueo real se probó en Hardhat local, no en Amoy. Las reservas `pendiente` se confirman con el worker de 5 s; si la cola falla, queda la alerta `reserva.bloqueo.atascado` (5 intentos).
- HU-29: bloqueo del sistema tras intentos fallidos (`comun.biometria.bloqueada`) solo con Jest: el Infinix X669 no bloqueó tras 16 rechazos en el diálogo y desbloquear con patrón anula el bloqueo.
- HU-10 CA-9: la llave de trayecto deja de valer con el dispositivo desactivado (e2e `a-08-abordaje`); falta verlo en el teléfono.
- HU-22: CA-7 con Play Integrity real (simulada en desarrollo; con el despliegue). El encuentro se probó con un teléfono y la otra parte en un guion de firmas reales. La renovación del código tras un escaneo rechazado (sondeo de 3 s, `9e4ce34`) solo con Jest y e2e, sin teléfono. La posición del conductor se valida al emitir el código: al verificar puede tener hasta ≈60 s (decisión del plan). Ser conductor de un viaje y pasajero de otro a la vez comparte el alias de la llave de trayecto: va en HU-23 parte 2.
- HU-10: si la app se cierra entre el 201 y `confirmarLlave()`, el servidor queda con la llave nueva y el teléfono con la vieja; se recupera revinculando (riesgo aceptado en la revisión).
- HU-10 depende de la prueba de vida nativa de HU-08, todavía pendiente en la app: en el teléfono se usó la simulada de desarrollo.
- HU-10: `PRUEBA_VIDA_FALLIDA` y `CONFLICTO_CONCURRENTE` en la app solo con Jest (el backend los prueba en e2e); `ROSTRO_NO_COINCIDE` e `INTENTOS_AGOTADOS` vistos en el teléfono. Publicar con la llave anulada, solo con Jest (misma función que Billetera y Recarga, vistas en el teléfono).
- Play Integrity real: simulada en desarrollo. HU-22 CA-7 no se declara verificado sin un teléfono físico con atestación real.
- Polygon Amoy y SP23: billetera, saldo y escrow solo contra Hardhat local.
- HU-13 en Amoy: contrato sin desplegar, relayer sin fondos; una confirmación por transacción hasta SP129.
- StrongBox.
- HU-17, fecha vieja al volver otro día: solo con Jest. Voz de TalkBack: solo la confirma una persona.
- HU-18: OpenFreeMap sin garantía de servicio.

## Bloqueos activos

- **Producción no arranca hasta SP129** (firmante KMS del relayer y, desde HU-24, de la cuenta verificadora). Hacerlo al desplegar.
- Esta PC tiene Node 22 y npm 10: usar Node 24 portable, solo en el PATH del proceso y con un PATH corto.
- `.env` local sin `WALLET_ENCRYPTION_KEY` ni `IDENTIDAD_SECRETO`: el backend no arranca sin ellas.
- Compilar `mobile` en nativo en Windows: `LongPathsEnabled=1` y CMake 3.31.6 (MEMORY, SP133).

## Decisiones abiertas

- **Tarjeta anclada oscura (DESIGN_SYSTEM §3, «Tarjeta destacada»):** la tarjeta del viaje activo (N7, hecha en SP177) usa las tarjetas claras de Mis viajes, no el fondo `marcaProfundo`. Decidir si se cambia.

- **Billetera al volver de vincular:** sigue en «primero vincula este teléfono» hasta tocar actualizar (visto en SP144, ya era así antes de HU-29). Releer por foco abriría la huella sola si hay billetera. El usuario decidió dejarlo anotado.
- **Accesibilidad:** TalkBack no lee los `Aviso` que aparecen; falta probar mover el foco. Decidir en qué historia va.
- **Viajes que nunca salieron:** ninguna historia pasa un viaje a `expirado`; lo cubre HU-20 (S4) con la ventana de abordaje de HU-22 RN-3.
- **HU-18, «Elegir en el mapa» sin ubicación:** el pin empieza en el centro de Santa Cruz y se puede usar sin moverlo.
- **Organización suspendida:** ningún código la suspende; se resuelve en la historia que implemente la suspensión.
- **`app.super_admin` en viajes:** `publicar` y `mis-viajes` abren RLS filtrando por `conductorId`; una política por `conductor_id` sería más estrecha (`AGENTS.md` §14).
- **Sesión muerta en la app:** si el refresco falla, ninguna pantalla lleva a iniciar sesión.
- **HU-17, diferencias con el prototipo:** fecha en chips con hora escrita y origen/destino fuera de la tarjeta del mapa.
- Sin resolver para HU-09/HU-10: pedir huella al vincular y alias de llave por cuenta.
- D-08 (voz en web), D-15 (criterio de "invulnerable" con el docente).
