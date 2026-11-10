# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-10

**Sprint actual:** Sprint 3 · Viaje completo verificado y pagado (37 PHU con HU-10, Release 1.0).
**Foco:** HU-10: backend, app y teléfono físico hechos; falta la verificación limpia y la subida.

## Estado actual

- **Sprint 1 y Sprint 2 en `develop`** de los 5 repositorios. Specs y planes del Sprint 3 aprobados (08/11), tareas SP134–SP176 en el backlog.
- **HU-10 en curso** en `feat/HU-10-cambio-dispositivo` (raíz PR #27, backend #16, mobile #16, de Smile-HD). **No fusionar todavía.**
  - Backend (SP134–SP137) corregido el 10/11: `backend` en `d979d72`, en verde (482 unitarias, 523 e2e, cobertura 92 %).
  - Mobile (SP138–SP139) corregido el 10/11: `mobile` en `472e22b`, lint, tipos y 390 pruebas en verde. Sin commit ni push en la raíz (punteros de submódulos pendientes).
  - SP140 hecho en un Infinix X669 con huella nueva real.

## Última sesión (10/11)

- App de HU-10: CA-1 («Registraste una huella nueva…» con «Confirmar mi identidad») en Billetera, Publicar y Recarga; «Mi teléfono» con los códigos del contrato final (`PRUEBA_VIDA_FALLIDA`, `INTENTOS_AGOTADOS` con hora, `CONFLICTO_CONCURRENTE`).
- La llave nueva solo firma tras el 201 (dos alias y `confirmarLlave`): un rechazo ya no deja el teléfono sin llave.
- Quitado lo fuera de alcance que bajaba la seguridad: simulaciones en web, refresco en `localStorage`, `globalThis` en `sesion.tsx`, script `android`.
- El Kotlin de la rama no compilaba; corregido y compilado. Aviso de éxito que quedaba junto a un rechazo, corregido.
- En el teléfono: vincular, rechazo que conserva la llave, huella nueva → CA-1 → revinculación con identidad → firma con la llave nueva; teléfono sin llave → revinculación. Base: anterior inactivo, auditoría y correo.
- Rechazo real de rostro y bloqueo de 24 h vistos en el teléfono; la hora para reintentar ahora dice el día cuando no es hoy (`formatearHora`, también en HU-08).
- Disco C: liberado (18 GB libres): restos de JetBrains y de Visual Studio, Gradle 8.14 y la imagen del emulador.

## Próximo paso concreto

1. **HU-10 parte 3: verificación limpia** (sesión que no implementó), por criterio y por riesgo, con la corrida completa de backend y mobile.
2. Parte 4: revisión, PR y punteros. Raíz: `docker-compose.yml` cambiado en el PR, revisarlo.
3. Después, en orden: HU-29 → HU-19 → HU-22 → HU-23 → HU-24. Dependencias autorizadas: `expo-camera` (SP161) y `expo-task-manager` (SP168).

## Sin verificar

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

- **Accesibilidad:** TalkBack no lee los `Aviso` que aparecen; falta probar mover el foco. Decidir en qué historia va.
- **Viajes que nunca salieron:** ninguna historia pasa un viaje a `expirado`; lo cubre HU-20 (S4) con la ventana de abordaje de HU-22 RN-3.
- **HU-18, «Elegir en el mapa» sin ubicación:** el pin empieza en el centro de Santa Cruz y se puede usar sin moverlo.
- **Organización suspendida:** ningún código la suspende; se resuelve en la historia que implemente la suspensión.
- **`app.super_admin` en viajes:** `publicar` y `mis-viajes` abren RLS filtrando por `conductorId`; una política por `conductor_id` sería más estrecha (`AGENTS.md` §14).
- **304 tras renovar la sesión:** con el token de acceso vencido, el reintento de un GET puede llegar como `304` (ETag de Express) y `leer()` lo muestra como «Algo salió mal»; «Reintentar» lo resuelve. Viene de antes de HU-10. Opciones: quitar el ETag en la API (datos privados por usuario) o tratar el 304 en el cliente. Decidir en qué historia va.
- **Sesión muerta en la app:** si el refresco falla, ninguna pantalla lleva a iniciar sesión.
- **HU-17, diferencias con el prototipo:** fecha en chips con hora escrita y origen/destino fuera de la tarjeta del mapa.
- Sin resolver para HU-09/HU-10: pedir huella al vincular y alias de llave por cuenta.
- D-08 (voz en web), D-15 (criterio de "invulnerable" con el docente).
