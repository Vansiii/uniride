# HU-34 · Recuperación de contraseña — Plan técnico

> Fase SDD: **Plan** (Diseño). Cómo se construye lo que dice `spec.md`.
> Estado: `aprobado (2026-10-14)` · Rama: `feat/HU-34-recuperacion-contrasena`
> **Orden en S1: 7.ª.**

## 1. Módulos afectados

| Carpeta | Módulo / componente | Cambio |
|---|---|---|
| backend | `autenticacion` | Endpoints para recuperar y restablecer la contraseña |
| backend | `notificaciones` | Plantillas `otp_recuperacion` y `contrasena_cambiada` (por la cola) |
| web | `src/paginas/RecuperarContrasena` | Nuevo (correo → código + contraseña nueva) |
| mobile | `app/recuperar.tsx` | Nuevo; reutiliza la pantalla Código de HU-05 |

Reutiliza: `OtpService` (HU-05, propósito `recuperacion`), revocación de sesiones (HU-06), cola de correos (HU-01).

## 2. Cambios al modelo de datos

Ninguno. Sin migración.

## 3. Endpoints

| Método | Ruta | Rol | Request → Response | Errores (`codigo`) |
|---|---|---|---|---|
| POST | `/api/v1/autenticacion/recuperar-contrasena` | público | `{ correo }` → 202 (siempre la misma respuesta) | `OTP_LIMITE_REENVIO` 429 |
| POST | `/api/v1/autenticacion/restablecer-contrasena` | público | `{ correo, codigo, contrasenaNueva }` → 204 | `OTP_INVALIDO` 400, `OTP_VENCIDO` 410, `OTP_BLOQUEADO` 429, `CONTRASENA_DEBIL` 400 |

Reglas de implementación:
- Si el correo no existe, se responde 202 sin generar código. Si existe, el código se envía por la **cola** (no en el momento), para que una falla de SES no revele que la cuenta existe (spec, caso borde corregido).
- El límite de reenvío se aplica por correo aunque la cuenta no exista, para que la respuesta 429 tampoco revele nada.
- Un código para un correo sin cuenta responde `OTP_INVALIDO`, igual que un código erróneo.
- Al restablecer, en una transacción: hash nuevo, revocación de **todos** los `tokens_refresco` del usuario, reinicio del bloqueo de inicio de sesión, auditoría y correo `contrasena_cambiada` en la cola.
- No toca dispositivos ni billetera (RN-5). CA-7 se cubre con `FirmaDispositivoGuard` en S2.

Swagger actualizado: [ ]

## 4. Pantallas y voz

| Cliente | Pantalla | Pasos del flujo | Claves i18n nuevas |
|---|---|---|---|
| web | Recuperar contraseña (correo) → Restablecer (código + contraseña nueva) | 2 | `autenticacion.recuperacion.*` |
| mobile | Igual, con la pantalla Código de HU-05 | 2 | `autenticacion.recuperacion.*` |

Voz: no aplica.

## 5. Diagramas UML

- [ ] Secuencia: igual a la de HU-05 con propósito `recuperacion`; basta una nota en el diagrama de HU-05.

## 6. Estrategia de pruebas

| Criterio | Tipo | Archivo de prueba |
|---|---|---|
| CA-1 envío del código | e2e | `backend/test/autenticacion/recuperacion.e2e-spec.ts` |
| CA-2 no revela cuentas (misma respuesta y mismos límites) | e2e | mismo archivo |
| CA-3 cambia la contraseña y cierra todas las sesiones | e2e | mismo archivo |
| CA-4 / CA-5 bloqueo, vencido o usado | unitaria (`OtpService`) | `otp.service.spec.ts` |
| CA-6 contraseña débil | e2e | `recuperacion.e2e-spec.ts` |
| CA-7 | se verifica en S2 con HU-09 | — |
| Pantallas | Vitest / Jest | `RecuperarContrasena.test.tsx`, `recuperar.test.tsx` |

## 7. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Toma de cuenta si alguien controla el correo institucional | Baja | Medio | Correo de aviso al cambiar; desde S2 el dinero exige el teléfono vinculado y la biometría |

Dependencias nuevas: ninguna.

## 8. Tareas propuestas (se copian a backlog.md al aprobar)

| Tarea | Horas | Responsable |
|---|---|---|
| Endpoints de recuperar y restablecer (revocación de sesiones, auditoría, correos) | 3 | |
| Web: pantallas de recuperación | 3 | |
| Mobile: pantalla de recuperación | 3 | |
| Pruebas (CA-1 a CA-6) | 3 | |
| **Total** | **12** | |
