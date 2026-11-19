# PB-07 · Atestación del dispositivo con Key Attestation — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué.
> Estado: `aprobada por PO (18/11/2026)` · Épica: Seguridad · Prioridad: Must · PHU: 5 · Sprint: S4
> Requisito del docente que cubre: 2 (verificación que no se pueda saltar)
> Amenazas que toca: A-03, A-05, A-08 (y refuerza A-04)

## 1. Historia

**Como** equipo de UniRide
**quiero** que el servidor compruebe que cada petición sensible viene de la app original en un teléfono Android real sin alterar, usando la atestación de hardware del propio teléfono
**para** mantener la capa «Dispositivo» sin depender de una cuenta de pago de Google Play ni de publicar la app.

Contexto: la capa de atestación se pensó con Play Integrity (HU-09, HU-22). Esa API exige una cuenta de Play Console (pago único de 25 USD) y la app nunca se publicará en la tienda; además la app móvil nunca llegó a pedir el token real (solo el simulado de desarrollo). El equipo aprobó (18/11/2026) sustituirla por la atestación de claves de Android (Key Attestation), gratuita y verificable en el servidor. Cambia el mecanismo, no el contrato con la API: el campo `tokenIntegridad` y el desafío de un solo uso se mantienen.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | Un teléfono físico con el arranque verificado y la app original | vincula su dispositivo o hace una petición sensible con la atestación generada con el desafío del servidor | el servidor la acepta y el flujo continúa como hoy |
| CA-2 | Un emulador, un teléfono con bootloader desbloqueado o una llave guardada solo en software | envía su atestación | el servidor la rechaza como dispositivo no íntegro (422 `DISPOSITIVO_NO_INTEGRO`) |
| CA-3 | Una atestación válida hecha con otro desafío o con uno ya usado | se envía en una petición | el servidor la rechaza (A-05) |
| CA-4 | La app con otro nombre de paquete o firmada con otra llave (app modificada o reempaquetada) | envía su atestación | el servidor la rechaza |
| CA-5 | Una cadena de certificados cuya raíz no es la de Google, o con un certificado alterado o vencido | se envía como atestación | el servidor la rechaza |
| CA-6 | Un cliente que llama a la API sin la app | envía un token vacío, mal formado o de otro formato | el servidor responde con error de validación o rechazo, nunca acepta (A-08) |
| CA-7 | Producción con el modo de emulador activado | arranca el servidor | el arranque falla (se mantiene la guarda actual) |
| CA-8 | La app en el teléfono | pide la atestación | genera una llave nueva con el desafío, devuelve la cadena de certificados y no deja la llave en uso |

Ataque (CA-2 a CA-6): cada uno es una prueba automatizada que demuestra que el servidor rechaza.

## 3. Reglas de negocio

- RN-1: La atestación se pide con el desafío del servidor (de 16 a 128 caracteres, un solo uso, vida de 30 s en el encuentro).
- RN-2: Se acepta solo si la cadena de certificados llega a una raíz de Google conocida, el desafío coincide, el nivel de seguridad es TEE o StrongBox, el estado de arranque es verificado con bootloader bloqueado, y el paquete y la huella de la firma de la app coinciden con los configurados.
- RN-3: La huella de la firma y el nombre del paquete esperados entran por variables de entorno; sin ellas el servidor falla cerrado (503), nunca aprueba.
- RN-4: La atestación no puede tener más de 5 minutos de antigüedad.
- RN-5: La llave de atestación es de un solo uso: se genera y se elimina; no se confunde con la llave del dispositivo (HU-09) ni con las de trayecto.
- RN-6: El modo simulado sigue existiendo solo en desarrollo y sigue prohibido con `NODE_ENV=production`.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Teléfono con solo atestación de software (sin TEE) | rechazo como no íntegro | `comun.integridad.dispositivo_no_integro` |
| Teléfono sin soporte de atestación (Android < 8) | no se puede vincular; mensaje claro | `comun.integridad.no_soportado` |
| Falta configuración de paquete o huella | 503 fail-closed y registro de error sin secretos | `comun.integridad.servicio_no_disponible` |
| Atestación repetida | rechazada por el desafío de un solo uso | `comun.integridad.nonce` |
| Raíces de Google rotadas | la lista de raíces confiables vive en configuración, no en el código | — |

## 5. Fuera de alcance de esta HU

- Detección de ubicación simulada (HU-22/HU-23, sin cambios).
- Compilar y firmar la app para distribución (EAS Build; tarea aparte).
- Verificar licencia de instalación desde Play Store (no aplica: la app no se publica).
- Revocación de atestaciones por lista (se acepta el riesgo; se documenta).

## 6. Dependencias

- HU / PB: HU-09 (vinculación), HU-22 (abordaje), HU-23 (seguimiento).
- Decisiones abiertas que la afectan: ninguna. Aprobado por el equipo el 18/11/2026; AGENTS.md §4 y §6 se actualizan al fusionar.
- Cambia una capa de verificación y un módulo nativo: confirmación humana según AGENTS.md §14, ya dada.

## 7. Definition of Done

- [ ] Todos los criterios de aceptación cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Pruebas de ataque en verde (CA-2 a CA-6).
- [ ] Probada en un teléfono Android físico (la atestación no se declara verificada solo con pruebas).
- [ ] PR revisado por otro integrante.
- [ ] CI en verde (lint, pruebas, build).
- [ ] Correctitud · Eficiencia · Fiabilidad · Facilidad de uso · Mantenimiento · Seguridad e integridad · Portabilidad.
- [ ] Desplegada en AWS y documentada en Swagger (descripciones de `tokenIntegridad`).
- [ ] Esta spec refleja lo realmente construido; AGENTS.md §4 y §6 actualizados.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-18 | Creación (borrador) | pendiente |
