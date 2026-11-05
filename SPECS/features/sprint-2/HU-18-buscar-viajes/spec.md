# HU-18 · Buscar viajes — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-02)` · Épica: E5 Viajes · Prioridad: Must · PHU: 5 · Sprint: S2
> Requisito del docente que cubre: **1 — Multi-organización** y **4 — Interfaz navegable e intuitiva**
> Amenazas que toca: **A-13** (Aislamiento entre organizaciones)

## 1. Historia

**Como** pasajero
**quiero** buscar viajes disponibles por ubicación de salida y horario
**para** encontrar un conductor de mi comunidad que realice una ruta compatible y viajar seguro a menor costo.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | un pasajero con membresía aprobada en una organización | busca viajes ingresando coordenadas de origen y una hora estimada de salida | el sistema devuelve los viajes en estado `Publicado` o `Reservado` con salida a ≤ 1,0 km de su punto y en una ventana de ± 30 minutos |
| CA-2 | una lista de resultados de búsqueda | el pasajero examina un viaje | visualiza nombre del conductor, badge de verificación, auto (marca, modelo, color, placa normalizada), hora exacta de salida, precio por asiento y cupos disponibles |
| CA-3 | viajes publicados en distintas organizaciones en la plataforma (Amenaza A-13) | un pasajero realiza una búsqueda | únicamente aparecen los viajes de su organización activa; los viajes de otras entidades quedan absolutamente invisibles |
| CA-4 | un viaje cuyos cupos disponibles llegaron a cero o cuya hora de salida ya transcurrió | alguien realiza una búsqueda | el sistema no lo incluye en los resultados |
| CA-5 | un viaje publicado por un conductor que aún no tiene calificaciones en el sistema (Resolución D-17) | se muestra en los resultados | el viaje muestra la insignia «Conductor verificado» y «Nuevo», sin estrellas vacías ni errores |
| CA-6 | una consulta de búsqueda en condiciones normales | se ejecuta la petición | el sistema responde en menos de **2 segundos** (meta de rendimiento del proyecto) |

## 3. Reglas de negocio

- RN-1: **Radio de proximidad:** Filtro geoespacial estricto a **≤ 1,0 km (1000 metros)** del punto de origen solicitado.
- RN-2: **Ventana temporal:** Filtro de horario de salida de **± 30 minutos** respecto a la hora deseada.
- RN-3: **Aislamiento institucional (A-13):** La búsqueda filtra obligatoriamente por el `organizacion_id` de la membresía activa del pasajero reforzado con Row-Level Security en PostgreSQL.
- RN-4: **Privacidad del conductor (D-20):** En los resultados de búsqueda se muestra la proyección `VehiculoPublico` (marca, modelo, color, placa) y el nombre de pila. La foto del carnet, selfie y número de documento nunca se exponen.
- RN-5: **Resolución de D-17 (Calificaciones):** El campo `calificacion` es opcional; si no existen reseñas (dado que HU-21 está en Reserva), se expone el estado de verificación y antigüedad en la plataforma.

## 4. Casos borde y errores

| Caso | Comportamiento esperado | Mensaje al usuario (clave es-BO) |
|---|---|---|
| No hay viajes coincidentes en el radio o ventana | Lista vacía amigable con sugerencia de ampliar horario | `viajes.buscar.sin_resultados` |
| Coordenadas inválidas o fuera de rango | Rechazo con código 400 | `comun.errores.coordenadas_invalidas` |
| Pasajero con membresía pendiente o inactiva | Rechazo 403 con pantalla informativa | `membresias.estado.pendiente` |

## 5. Fuera de alcance de esta HU

- Reserva de cupos y congelamiento de saldo en escrow → HU-19 (Sprint 3).
- Búsqueda y reserva asistida mediante comandos de voz en lenguaje natural → HU-27 (Sprint 4).
- Sistema de puntuación y reseñas mutuas post-viaje → HU-21 (en Reserva).

## 6. Dependencias

- **HU-17:** Publicar viaje (se requiere la existencia de viajes publicados).
- **HU-02 / HU-06:** Sesión activa y membresía aprobada en la organización.

## 7. Definition of Done

Marcar al cerrar la fase **Verify**. Referencia: `SPECS/constitution.md` Art. 12.

- [ ] Criterios CA-1 a CA-6 cumplidos.
- [ ] Pruebas automatizadas del `plan.md` en verde; cobertura en backend ≥ 70 %.
- [ ] Prueba de aislamiento multi-organización A-13 en verde.
- [ ] Tiempo de respuesta verificado < 2 segundos.
- [ ] PR revisado · CI en verde.
- [ ] Documentado en Swagger.
- [ ] Aceptada por el PO en la Sprint Review.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-02 | Creación (borrador) | — |
| 2026-11-02 | Aprobación de spec y plan; Haversine <= 1 km, ventana +/- 30 min y resolución D-17 | 2026-11-02 · HU-18 Buscar viajes: spec y plan técnico aprobados (Resuelve D-17) |

