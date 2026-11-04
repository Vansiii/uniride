# HU-08 · Verificación de identidad — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-02)` · Épica: E3 Verificación de identidad · Prioridad: Must · PHU: 8 · Sprint: S2
> Requisito del docente que cubre: **2 — Verificación que no se pueda saltar** (Capa 1: Identidad)
> Amenazas que toca: **A-01** (Registrarse con foto o video de otro) y **A-02** (Varias cuentas por persona)

## 1. Historia

**Como** usuario
**quiero** verificar mi identidad con mi carnet de identidad y una prueba de vida
**para** que la comunidad confíe en que soy una persona real y poder publicar viajes, reservar cupos o cobrar pasajes.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | una persona con sesión iniciada y cuenta no verificada | captura la foto del anverso de su carnet de identidad y completa la prueba de vida satisfactoriamente con similitud facial ≥ 90 % | su identidad cambia a estado `Verificada` y queda habilitada para los siguientes pasos |
| CA-2 | un atacante que intenta verificar usando una foto impresa, pantalla con video o máscara (Amenaza A-01) | realiza la prueba de vida | el sistema detecta la ausencia de vivacidad, rechaza la verificación y la identidad permanece no verificada |
| CA-3 | una prueba de vida auténtica pero con una foto de carnet que pertenece a otra persona (similitud < 90 %) (Amenaza A-01) | se evalúa la coincidencia | el sistema rechaza la solicitud indicando que los rostros no coinciden |
| CA-4 | un número de carnet de identidad ya registrado por otra cuenta en UniRide (Amenaza A-02) | alguien intenta verificar una cuenta con ese mismo documento | el sistema rechaza la verificación por documento duplicado |
| CA-5 | un rostro que ya coincide con una cuenta previamente verificada en el sistema (Amenaza A-02) | alguien intenta verificar una segunda cuenta con un carnet diferente | el sistema detecta duplicidad biométrica y rechaza la verificación |
| CA-6 | un usuario con identidad en estado `No_verificada`, `Pendiente` o `Rechazada` | intenta publicar un viaje (HU-17), reservar un cupo (HU-19) o crear billetera (HU-12) | el servidor bloquea la acción y le exige completar la verificación de identidad |
| CA-7 | una foto de carnet borrosa, con brillo excesivo o donde no se detecta con claridad un rostro | se envía a verificación | el sistema la rechaza inmediatamente indicando el problema de legibilidad para que reintente |
| CA-8 | una cuenta verificada | cualquier usuario o cliente consulta información pública o viaja con él | nunca se expone la foto del carnet, la selfie ni vectores biométricos; solo se expone el indicador de identidad verificada |
| CA-9 | 3 intentos fallidos consecutivos de verificación en una misma cuenta | se produce el tercer fallo | la verificación queda bloqueada temporalmente por 24 horas para prevenir ataques de fuerza bruta |

## 3. Reglas de negocio

- RN-1: **Umbral biométrico:** Se exige una coincidencia facial mínima del **90 %** entre la foto del carnet y la captura de vivacidad.
- RN-2: **Unicidad global:** Un documento de identidad y un rostro pertenecen a una sola persona y a una sola cuenta en toda la plataforma UniRide (A-02). No existe verificación parcial por organización.
- RN-3: **Consentimiento informado:** Antes de acceder a la cámara o capturar datos biométricos, el usuario debe aceptar explícitamente los términos de tratamiento de datos personales conforme a la Ley N.º 164 y Constitución Art. 6.
- RN-4: **Captura en vivo exclusiva:** La prueba de vida solo se realiza en tiempo real a través de la app móvil. No se permite seleccionar videos ni fotos pregrabadas de la galería.
- RN-5: **Protección de datos sensibles:** Las imágenes de carnets se almacenan cifradas en reposo, con acceso restringido exclusivamente al proceso de verificación. Nunca se exponen en URLs públicas ni en logs de auditoría (`AGENTS.md` §11).
- RN-6: **Estados de identidad de la cuenta:** `No_verificada` (inicial), `En_revision`, `Verificada`, `Rechazada`, `Bloqueada_temporal`.
- RN-7: **Acciones restringidas:** La verificación aprobada es requisito indispensable e infranqueable para habilitar la billetera on-chain (HU-12), publicar viajes (HU-17) y reservar asientos (HU-19).

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| Falla de vivacidad / spoofing (CA-2) | Rechazo; no se altera el estado previo | `identidad.verificacion.prueba_vida_fallida` |
| Rostro no coincide con el carnet (CA-3) | Rechazo; cuenta continúa no verificada | `identidad.verificacion.rostro_no_coincide` |
| Carnet ya registrado en otra cuenta (CA-4) | Rechazo por documento duplicado | `identidad.verificacion.documento_duplicado` |
| Rostro ya registrado en otra cuenta (CA-5) | Rechazo por biometría duplicada | `identidad.verificacion.rostro_duplicado` |
| Imagen de carnet ilegible o sin rostro (CA-7) | Rechazo solicitando nueva captura nítida | `identidad.verificacion.imagen_ilegible` |
| Límite de 3 intentos alcanzado (CA-9) | Bloqueo temporal por 24 horas | `identidad.verificacion.intentos_agotados` |
| Falla de comunicación con el motor de verificación | Estado consistente; nada se guarda a medias | `identidad.verificacion.servicio_no_disponible` |
| Intento de operar sin estar verificado (CA-6) | Bloqueo en servidor (código 403) | `identidad.verificacion.requerida` |

## 5. Fuera de alcance de esta HU

- Vinculación criptográfica del hardware del dispositivo móvil y atestación de Play Integrity → HU-09.
- Creación de la dirección on-chain y custodia en AWS KMS → HU-12.
- Validación del carnet contra bases de datos del SEGIP o entidades policiales/estatales (fuera de alcance v1).
- Renovación por carnet vencido o cambio de identidad (fuera de alcance v1).

## 6. Dependencias

- **HU-06:** Inicio de sesión (se requiere una cuenta activa autenticada).
- Decisiones abiertas que la afectan: ninguna bloqueante directa (D-15 aborda el término "invulnerable" ante el docente).

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Criterios CA-1 a CA-9 cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura en backend ≥ 70 %.
- [ ] Pruebas de ataque A-01 (spoofing y fotos ajenas) y A-02 (duplicidad de carnet y rostro) automatizadas y en verde.
- [ ] Verificación de que ninguna respuesta ni log exponga imágenes ni datos biométricos en crudo.
- [ ] PR revisado por otro integrante del equipo.
- [ ] CI en verde (lint, pruebas y build).
- [ ] Documentado en Swagger.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-02 | Creación (borrador) | — |
| 2026-11-02 | Aprobación de spec y plan; hash HMAC-SHA256 para CI y descarte de SEGIP | 2026-11-02 · HU-08 Verificación de identidad: spec y plan técnico aprobados |

