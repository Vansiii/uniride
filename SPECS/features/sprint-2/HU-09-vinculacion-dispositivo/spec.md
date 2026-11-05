# HU-09 · Vinculación de dispositivo — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-02)` · Épica: E3 Verificación de identidad / Dispositivo · Prioridad: Must · PHU: 8 · Sprint: S2
> Requisito del docente que cubre: **2 — Verificación que no se pueda saltar** (Capa 2: Dispositivo)
> Amenazas que toca: **A-03** (Emulador, root o app modificada), **A-04** (Teléfono robado o prestado), **A-08** (Llamar a la API sin la app)

## 1. Historia

**Como** usuario
**quiero** que mi cuenta quede atada de forma segura a mi teléfono físico
**para** que nadie pueda operar mis viajes, mi billetera ni suplantarme desde otro dispositivo, emulador o programa externo.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | una persona con sesión iniciada en un teléfono Android físico legítimo | inicia la vinculación, genera su par de llaves en hardware y envía la atestación | el servidor valida la atestación de integridad, almacena la llave pública y marca el dispositivo como `Vinculado` |
| CA-2 | un emulador, dispositivo con root o app modificada/reempaquetada (Amenaza A-03) | intenta vincular el dispositivo o solicitar atestación | el servidor detecta que no cumple la integridad mínima y rechaza la vinculación |
| CA-3 | una petición sensible a la API (billetera, publicar viaje, reservar o handshakes) (Amenaza A-08) | se envía sin los encabezados de firma del dispositivo o desde una herramienta externa (curl, Postman) | el servidor responde inmediatamente con código 401 y rechaza la operación |
| CA-4 | una petición sensible enviada con firma de un dispositivo | la firma no corresponde a la llave pública registrada para esa cuenta o la firma digital es inválida (Amenaza A-04, A-08) | el servidor rechaza la petición con código 401 |
| CA-5 | un atacante que intercepta una petición firmada válida y la reenvía después de 30 segundos o con el mismo identificador único (Amenaza A-05 / Replay) | el servidor recibe la petición repetida o expirada | el sistema la rechaza por firma caducada o nonce duplicado |
| CA-6 | un usuario que ya tiene un dispositivo vinculado | inicia sesión desde otro teléfono e intenta vincularlo | el sistema le indica que ya posee un dispositivo activo y no permite la doble vinculación simultánea (A-02) |
| CA-7 | una persona cuyo teléfono exige autenticación biométrica para la llave de hardware (Amenaza A-04) | un tercero no autorizado toma el teléfono desbloqueado e intenta operar una acción sensible | el sistema solicita la biometría del dueño del teléfono; sin ella la llave no firma y la acción se cancela |

## 3. Reglas de negocio

- RN-1: **Atestación obligatoria:** La atestación con Google Play Integrity API debe cumplir como mínimo el veredicto `MEETS_DEVICE_INTEGRITY` (y validar el package name y la firma oficial de la app).
- RN-2: **Criptografía de hardware:** El par de llaves debe ser asimétrico, generado dentro del Keystore seguro del dispositivo (StrongBox o TEE), no exportable y con requerimiento de autenticación biométrica del usuario.
- RN-3: **Unicidad de dispositivo activo:** Una cuenta solo puede tener **un único dispositivo activo vinculado a la vez** (A-02).
- RN-4: **Payload de firma de petición:** Cada petición sensible debe firmar: `METODO + RUTA + TIMESTAMP + NONCE + SHA256(CUERPO)`. La ventana de tolerancia de tiempo es de **30 segundos**.
- RN-5: **Bypass de desarrollo restringido:** Para pruebas en emuladores y CI local se permite un modo simulado (`MODO_EMULADOR_DEV=true`), pero está estrictamente prohibido y bloqueado por arquitectura si el entorno es producción (`NODE_ENV=production`) (`AGENTS.md` §6).

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Dispositivo no íntegro (root/emulador, CA-2) | Rechazo de vinculación | `dispositivo.vinculacion.no_integro` |
| Firma ausente o inválida en endpoint sensible (CA-3, CA-4) | Rechazo 401 | `comun.errores.firma_invalida` |
| Petición con timestamp expirado o nonce repetido (CA-5) | Rechazo 401 | `comun.errores.peticion_expirada` |
| Cuenta ya posee otro dispositivo vinculado (CA-6) | Rechazo informativo | `dispositivo.vinculacion.ya_vinculado` |
| Cancelación de biometría en el teléfono (CA-7) | La acción se interrumpe localmente | `dispositivo.autenticacion.cancelada` |
| Falla en los servicios de Google Play | Rechazo seguro sin dejar registros corruptos | `dispositivo.vinculacion.servicio_no_disponible` |

## 5. Fuera de alcance de esta HU

- Flujo de cambio/recuperación de dispositivo cuando el teléfono anterior fue extraviado o robado → HU-10 (en Reserva).
- Verificación facial con carnet de identidad → HU-08.
- Manejo de biometría para confirmaciones de voz → HU-29.

## 6. Dependencias

- **HU-06:** Inicio de sesión (requiere cuenta con sesión autenticada).

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Criterios CA-1 a CA-7 cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura en backend ≥ 70 %.
- [ ] Pruebas de ataque A-03 (dispositivo no íntegro), A-04 (clave ajena) y A-08 (petición sin app / firma falsa) en verde.
- [ ] Verificación de que el bypass simulado de integridad falle inmediatamente en producción.
- [ ] PR revisado · CI en verde.
- [ ] Documentado en Swagger.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-02 | Creación (borrador) | — |
| 2026-11-02 | Aprobación de spec y plan; llaves ECDSA P-256 y firma en endpoints sensibles | 2026-11-02 · HU-09 Vinculación de dispositivo: spec y plan técnico aprobados |

