# PB-09 · Notificaciones push en la app móvil — Especificación y plan

> Fase SDD: **Specify + Plan** (resumidos en un archivo por el plazo de la defensa).
> Estado: `implementada, desplegada y probada en teléfono (20/11/2026); aceptada por Vansiii` · Épica: Usabilidad · Prioridad: Should · Sprint: S4
> Requisito del docente que cubre: 4 (interfaz navegable: la app avisa sin que la persona tenga que mirar)
> Amenazas que toca: ninguna capa de verificación. Un aviso **solo informa** lo que el servidor ya decidió (AGENTS.md §5.1); nunca autoriza ni mueve dinero.

## 1. Historia

**Como** pasajero o conductor
**quiero** recibir en el teléfono un aviso cuando pasa algo con mis reservas, viajes, pagos o solicitudes
**para** enterarme a tiempo sin abrir la app, y llegar a la pantalla correcta con un toque.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces | Prueba |
|---|---|---|---|---|
| CA-1 | Una persona inicia sesión en la app | da permiso de notificaciones | el teléfono registra su token FCM en la API (`PUT /yo/token-push`) | `push.test.ts`, `push.e2e-spec.ts` |
| CA-2 | Una reserva pasa de `pendiente` a `confirmada` (escrow bloqueado) | — | el pasajero recibe «Reserva confirmada» y el conductor «Nuevo pasajero» | `trabajos-onchain.service.spec.ts` |
| CA-3 | El pasajero cancela su reserva | — | el conductor recibe «Un pasajero canceló» | `cancelaciones.service.spec.ts` |
| CA-4 | El conductor cancela el viaje (o se resuelve una reserva de un viaje cancelado) | — | cada pasajero recibe «Viaje cancelado» con el monto devuelto | `cancelaciones` / `vencimientos` |
| CA-5 | Una reserva expira sin abordaje | — | el pasajero recibe «Reserva vencida» con el reembolso | `vencimientos.service.spec.ts` |
| CA-6 | El escrow libera el pago | — | el conductor recibe «Recibiste un pago» | `trabajos-onchain.service.spec.ts` |
| CA-7 | Un admin aprueba o rechaza una solicitud | — | el miembro recibe el resultado | `membresias.service.spec.ts` |
| CA-8 | Se toca un aviso (app abierta, en segundo plano o cerrada) | — | abre la reserva, el viaje o los movimientos; nunca una ruta fuera de esa lista | `push.test.ts` |
| CA-9 | La persona cierra sesión, u otra cuenta inicia sesión en el mismo teléfono | — | la cuenta anterior deja de recibir avisos en ese teléfono | `push.e2e-spec.ts` |
| CA-10 | FCM falla | — | el evento de negocio no se revierte; el aviso se reintenta (5 intentos); un token inválido se borra | `push.service.spec.ts` |
| CA-11 | En Perfil se toca «Notificaciones» | — | con permiso, llega una notificación de prueba; sin permiso, abre los ajustes de Android | manual en teléfono |

## 3. Diseño (plan)

- **Canal:** Firebase Cloud Messaging, API HTTP v1, directo desde el backend. Sin cuenta de Expo (el APK se compila en Docker, sin EAS) y sin `firebase-admin`: el token OAuth se firma con `node:crypto` (RS256) con la cuenta de servicio.
- **Backend (`notificaciones`):** columna `usuarios.token_push` (única: un token es de una sola cuenta) y cola `notificaciones_push` (migración `021`), igual que `correos_salientes`: se encola **en la misma transacción** del evento y un worker cada 5 s envía con `FOR UPDATE SKIP LOCKED` y espera creciente. El token se lee al enviar, no se copia en la cola. `PUSH_MODO=consola|fcm|apagado`, `FCM_CUENTA_SERVICIO_B64`.
- **Endpoints:** `PUT /yo/token-push`, `DELETE /yo/token-push`, `POST /yo/token-push/prueba` (solo el propio usuario; sin id en la ruta). Cerrar sesión borra el token.
- **Móvil:** `expo-notifications` (única dependencia nueva). `src/servicios/push.ts` pide permiso (Android 13+), crea el canal `avisos`, registra el token y escucha los toques; `useAvisosPush` corre mientras hay sesión. `google-services.json` fuera del repo; `app.config.js` lo incluye solo si existe.
- **Datos:** el aviso lleva título, cuerpo y una ruta. Sin datos sensibles (nada de montos ajenos, carnets ni ubicaciones).

## 4. Fuera de alcance

- Avisos en la web y a administradores (HU-26 ya los muestra en el panel).
- Preferencias por tipo de aviso.
- iOS (la app es solo Android).

## 5. Puesta en marcha (hecha el 20/11/2026)

- Proyecto de Firebase `uniride-app-mobile` con `com.uniride.app`; `google-services.json` en `mobile/` (fuera de git); cuenta de servicio en SSM `/uniride/env`; backend desplegado con la migración 021 y APK recompilado.
- CA-1, CA-8 (con la app cerrada) y CA-11 probados en el teléfono físico por Vansiii.
