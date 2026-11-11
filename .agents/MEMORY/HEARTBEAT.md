# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-10

**Sprint actual:** Sprint 3 · Viaje completo verificado y pagado (37 PHU con HU-10, Release 1.0).
**Foco:** HU-10 y HU-29 subidas y con PR; falta fusionar en orden (HU-10 primero) con revisión de otro integrante.

## Estado actual

- **Sprint 1 y Sprint 2 en `develop`** de los 5 repositorios. Specs y planes del Sprint 3 aprobados (08/11), tareas SP134–SP176 en el backlog.
- **HU-10 en curso** en `feat/HU-10-cambio-dispositivo` (raíz PR #27, backend #16, mobile #16, de Smile-HD). **No fusionar todavía.**
  - Backend (SP134–SP137): `backend` en `180ae4e`, subido. Verificación completa en verde tras la revisión (524 e2e).
  - Mobile (SP138–SP139): `mobile` en `6bc8777`, subido. Lint, tipos y pruebas en verde.
  - Punteros de `backend` y `mobile` en la raíz con commit; el de `contracts` apunta a HU-13 y no va en esta rama.
  - **Pendiente de revisión por otro integrante** : llave desparejada si la app se cierra entre el 201 y `confirmarLlave()` (hoy se recupera revinculando) y el bloque de fallas de llave repetido en Billetera, Publicar, Recarga y Dispositivo.
  - SP140 hecho en un Infinix X669 con huella nueva real.
- **HU-29 en PR**: backend #17, mobile #17 y raíz #28, con base en `feat/HU-10-cambio-dispositivo`. Se fusiona después de HU-10, en orden backend → mobile → raíz.
  - Backend (SP141–SP142): `backend` en `46822b0`, subido. Verificación completa en verde tras la revisión (543 e2e) y prueba real de API.
  - Mobile (SP143): `mobile` en `1106de2`, subido. Verificación completa en verde tras la revisión (399 pruebas y build); mirada en teléfono físico hecha.
  - Verificación limpia (10/11): regresión completa en verde (543 e2e, cobertura 92,3 %) y peticiones reales de los ataques en las tres acciones. Corregido CA-2 al crear la billetera. Crear la billetera pasa a un resumen con botón con huella (CA-1, a pedido del usuario); Movimientos lleva a Billetera.
  - SP144 en el Infinix X669 (10/11): resumen y CA-1 al crear la billetera, CA-5 con un dedo no registrado (16 rechazos, nada firmado llegó al servidor), CA-2, RN-4/RN-5 sin PIN ni patrón en el diálogo, Movimientos → «Ir a Billetera» y CA-8 sin huellas ni rostro; tras volver a registrar la huella, la llave anulada lleva a «Confirmar mi identidad». Evidencias en `.harness/evidencias/HU-29/telefono/informe.md`.

## Última sesión (10/11)

- HU-29 parte 4: `/code-review medium` sobre backend y mobile. Corregido en mobile `1106de2` y backend `46822b0`; los tres sin cambio, con su motivo en la tabla de la revisión.
- Mobile: un toque durante una confirmación ya no borra el aviso (recarga) ni repite la validación (publicar); si el saldo falla justo tras crear la billetera, se ve la billetera nueva con el aviso y sin otra huella (Jest, que falla sin el arreglo).
- Verificación tras corregir: backend completa en verde (543 e2e); mobile rápida en verde.

## Próximo paso concreto

1. **HU-10:** subida a los PR #16, #16 y #27 (backend y mobile ya estaban; la raíz se subió el 10/11). Merge en orden backend → mobile → raíz, tras la revisión de otro integrante. Los commits viejos dicen `SP03` en vez de SP134–SP140.
2. **HU-29:** revisión hecha (6 de 9 hallazgos corregidos) y PR abiertos. Tras fusionar HU-10, fusionar HU-29 y luego actualizar los punteros de `develop`. Si se conecta el teléfono, ver la nueva instrucción de recarga.
3. Después, en orden: HU-19 → HU-22 → HU-23 → HU-24. Dependencias autorizadas: `expo-camera` (SP161) y `expo-task-manager` (SP168).

## Sin verificar

- HU-29: bloqueo del sistema tras intentos fallidos (`comun.biometria.bloqueada`) solo con Jest: el Infinix X669 no bloqueó tras 16 rechazos en el diálogo y desbloquear con patrón anula el bloqueo.
- HU-10 CA-9 (llaves de trayecto) depende de HU-22.
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
