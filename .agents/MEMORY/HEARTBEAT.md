# HEARTBEAT — Estado operativo

> Primer archivo a leer en cada sesión. Se **sobrescribe** al final de cada sesión.

**Última actualización:** 2026-11-10

**Sprint actual:** Sprint 3 · Viaje completo verificado y pagado (37 PHU con HU-10, Release 1.0).
**Foco:** HU-10: backend corregido (10/11); falta mobile (CA-1 y códigos) y el teléfono físico.

## Estado actual

- **Sprint 1 y Sprint 2 en `develop`** de los 5 repositorios. Specs y planes del Sprint 3 aprobados (08/11), tareas SP134–SP176 en el backlog.
- **HU-10 en curso** en `feat/HU-10-cambio-dispositivo` (raíz PR #27, backend #16, mobile #16, de Smile-HD). **No fusionar todavía.**
  - Backend (SP134–SP137) hecho y corregido el 10/11: `backend` en `d979d72`, `verificar.py backend` en verde (482 unitarias, 523 e2e, cobertura 92 %), prueba real de la API en `.harness`.
  - Contrato definitivo en `plan.md` §3: códigos de HU-08 (`PRUEBA_VIDA_FALLIDA`, `INTENTOS_AGOTADOS`), 409 `CONFLICTO_CONCURRENTE`, la sesión de vida vale solo con su desafío.

## Última sesión (10/11)

- Correcciones del backend de HU-10 sobre la rama de Smile-HD (con OK del integrante): sesión de vida atada al desafío (A-08), 409 con mensaje y Swagger, auditoría de rechazos con modelo (CA-12), fecha local en el correo (CA-8), fuera el CORS abierto con credenciales. Prueba A-08 propia.
- Plan de HU-10 completado: códigos reales, amenazas con su prueba, consultas, decisiones y §7b.
- Vulnerabilidades publicadas revisadas en los 4 repositorios: ninguna.

## Próximo paso concreto

1. **HU-10 parte 2 (mobile, SP138–SP139)** sobre la rama de Smile-HD:
   - CA-1: Billetera, Publicar y Recarga muestran «Actualiza la app» con `LLAVE_ANULADA`; falta el aviso «Registraste una huella nueva…» con «Confirmar mi identidad».
   - `dispositivo.tsx` espera `LIVENESS_FALLIDA` e `IDENTIDAD_BLOQUEADA`: pasar a `PRUEBA_VIDA_FALLIDA` e `INTENTOS_AGOTADOS`, y agregar `CONFLICTO_CONCURRENTE`.
   - `crearLlave()` borra la llave local antes de que el servidor acepte: borrar solo después del 201.
   - Fuera de alcance que baja seguridad: modo simulado en cualquier build web, token de refresco en `localStorage`, `globalThis` en `sesion.tsx`, script `android` de `package.json`. Sin CORS en el backend: el web de desarrollo va por el proxy.
   - Raíz: `docker-compose.yml` cambiado en el PR, revisarlo.
2. Luego SP140 en teléfono físico (huella nueva real) y la parte 4: revisión, commits con SP134–SP140, punteros.
3. Después, en orden: HU-29 → HU-19 → HU-22 → HU-23 → HU-24. Dependencias autorizadas: `expo-camera` (SP161) y `expo-task-manager` (SP168).

## Sin verificar

- HU-10 depende de la prueba de vida nativa de HU-08, todavía pendiente en la app.
- Play Integrity real: simulada en desarrollo. HU-22 CA-7 no se declara verificado sin un teléfono físico con atestación real.
- Polygon Amoy y SP23: billetera, saldo y escrow solo contra Hardhat local.
- HU-13 en Amoy: contrato sin desplegar, relayer sin fondos; una confirmación por transacción hasta SP129.
- StrongBox; invalidación de la llave al registrar una huella nueva.
- Dev build con SDK 58 en teléfono físico (Keystore de HU-09).
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
- **Sesión muerta en la app:** si el refresco falla, ninguna pantalla lleva a iniciar sesión.
- **HU-17, diferencias con el prototipo:** fecha en chips con hora escrita y origen/destino fuera de la tarjeta del mapa.
- Sin resolver para HU-09/HU-10: pedir huella al vincular y alias de llave por cuenta.
- D-08 (voz en web), D-15 (criterio de "invulnerable" con el docente).
