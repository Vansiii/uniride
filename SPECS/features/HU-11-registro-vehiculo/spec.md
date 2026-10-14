# HU-11 · Registro de vehículo — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-10-14)` · Épica: E3 Verificación de identidad · Prioridad: Must · PHU: 3 · Sprint: S1
> Requisito del docente que cubre: ninguno directo (habilita publicar viajes, HU-17)
> Amenazas que toca: ninguna del modelo directamente; maneja datos sensibles (foto del vehículo, `AGENTS.md` §11)

## 1. Historia

**Como** conductor
**quiero** registrar mi vehículo con placa, marca, modelo, color, capacidad y foto
**para** que los pasajeros me identifiquen.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | una persona con membresía aprobada | registra su vehículo con todos los datos y una foto, y acepta el uso de la foto | el vehículo queda registrado a su nombre |
| CA-2 | una placa ya registrada por cualquier persona en UniRide | alguien intenta registrarla | el sistema la rechaza |
| CA-3 | la placa escrita con minúsculas, espacios o guiones (por ejemplo "1234-abc") | se registra | se guarda normalizada ("1234ABC") y la unicidad se compara con esa forma |
| CA-4 | una capacidad fuera del rango permitido o una placa con formato inválido | la persona intenta guardar | el sistema lo rechaza indicando qué corregir |
| CA-5 | un vehículo con capacidad 4 | el conductor publique un viaje (HU-17) | no podrá ofrecer más de 4 cupos |
| CA-6 | una persona sin vehículo registrado | intenta publicar un viaje (HU-17) | el sistema no se lo permite y la invita a registrar uno |
| CA-7 | un vehículo registrado | cualquier persona distinta del dueño consulta sus datos (por ejemplo, un pasajero que ve el viaje) | ve solo placa, marca, modelo y color; la foto nunca aparece en respuestas, mensajes ni registros (D-20) |
| CA-8 | una persona con membresía pendiente o rechazada | intenta registrar un vehículo | el sistema no se lo permite |

## 3. Reglas de negocio

- RN-1: La placa es única en todo UniRide, no solo dentro de una organización.
- RN-2: Formato de placa: placas bolivianas actuales, 3 o 4 dígitos seguidos de 3 letras.
- RN-3: La capacidad es el número de asientos para pasajeros (sin contar al conductor), de 1 a 6.
- RN-4: Un vehículo activo por conductor en v1, para no agregar la elección del vehículo al publicar.
- RN-5: La foto es un dato sensible: requiere consentimiento explícito, se guarda cifrada y se usa solo para verificación. A los pasajeros se les muestra solo placa, marca, modelo y color (D-20).
- RN-6: El vehículo pertenece a la persona y le sirve en todas sus organizaciones (D-07).
- RN-7: Para registrar un vehículo basta con tener sesión iniciada y membresía aprobada. Publicar viajes (HU-17) sí exige verificación completa de identidad y teléfono (D-21).
- RN-8: El registro se hace en la app móvil.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje (clave es-BO) |
|---|---|---|
| Placa duplicada (CA-2) | Rechazo | `vehiculos.registro.placa_duplicada` |
| Placa o capacidad inválida (CA-4) | Rechazo con el campo a corregir | `vehiculos.registro.dato_invalido` |
| Foto demasiado pesada o con formato no permitido | Rechazo indicando el límite | `vehiculos.registro.foto_invalida` |
| Falla el almacenamiento de la foto | No se registra nada a medias | `vehiculos.registro.no_disponible` |
| Dos personas registran la misma placa a la vez | Solo una lo logra | `vehiculos.registro.placa_duplicada` |

## 5. Fuera de alcance

- Editar o eliminar el vehículo, o tener varios vehículos.
- Validar la placa, el SOAT o la licencia con entidades estatales (fuera de alcance v1).
- Publicar viajes → HU-17.

## 6. Dependencias

- HU-06.

## 7. Definition of Done

Referencia: `SPECS/constitution.md` Art. 12.

- [ ] CA-1 a CA-8 cumplidos.
- [ ] Pruebas del `plan.md` en verde; cobertura de backend ≥ 70 %.
- [ ] Prueba de que la foto no aparece en respuestas ni logs (CA-7) en verde.
- [ ] PR revisado · CI en verde · 7 criterios de calidad.
- [ ] Desplegada en AWS y documentada en Swagger.
- [ ] Spec actualizada · aceptada por el PO.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-10-14 | Creación (borrador) | — |
| 2026-10-14 | Placa, capacidad y vehículo único definidos; foto no visible (D-20); basta membresía aprobada (D-21), CA-8 | Resuelve D-12, D-16, D-20, D-21 |
