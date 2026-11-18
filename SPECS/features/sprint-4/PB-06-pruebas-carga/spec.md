# PB-06 · Pruebas de carga básicas (reducida) — Especificación

> Fase SDD: **Specify** (Análisis). Qué y por qué, sin tecnología.
> Estado: `aprobada por el PO (2026-11-17)` · Épica: Calidad · Prioridad: Could · PHU: 2 (reducida de 3) · Sprint: S4 (hasta vie 20/11/2026)
> Requisito del docente que cubre: ninguno directo; respalda los criterios de calidad de `AGENTS.md` §10 (búsqueda < 2 s, verificación de abordaje < 3 s)
> Amenazas que toca: ninguna

## 1. Historia

**Como** equipo
**queremos** medir cuánto tardan la búsqueda de viajes y la verificación de abordaje con varios usuarios a la vez
**para** poder afirmar en la defensa que cumplimos las metas de rendimiento, con un informe y no a ojo.

## 2. Criterios de aceptación

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-1 | el entorno local con datos de prueba (≥ 200 viajes publicados en ≥ 2 organizaciones) | se corre la prueba de búsqueda con **20 usuarios simultáneos** durante 30 s | el percentil 95 del tiempo de respuesta es **< 2 s** y no hay errores 5xx |
| CA-2 | el mismo entorno | se corre la prueba de verificación de abordaje (validación en servidor del desafío firmado) con **10 usuarios simultáneos** | el percentil 95 es **< 3 s** y no hay errores 5xx |
| CA-3 | cualquiera de las dos pruebas | termina | se escribe un informe (`informe.md`) con fecha, versión del código, equipo usado, cantidad de peticiones, p50, p95, máximo y errores, y si cumple o no la meta |
| CA-4 | una meta no se cumple | termina | el informe lo dice como **no cumple**; no se cambia la meta ni se descarta el resultado |
| CA-5 | la prueba | se corre contra la API local | no mueve dinero real ni usa la red principal; los datos de prueba usan cuentas marcadas como de prueba |
| CA-6 | un tercero | repite el procedimiento | con un solo comando por prueba y los pasos del informe obtiene resultados comparables |

## 3. Reglas de negocio

- RN-1: Las metas son las de `AGENTS.md` §10: búsqueda < 2 s, abordaje < 3 s, medidas en el p95.
- RN-2: Se mide el servidor, no la red del teléfono ni el mapa; el informe aclara que es **local** y que la nube puede variar.
- RN-3: La verificación de abordaje se mide con firmas generadas por el guion de pruebas (no con teléfonos); el informe lo aclara, igual que la suite PB-05.
- RN-4: Sin servicios externos reales (Rekognition, Play Integrity real, Amoy): se mide con la simulación de desarrollo, y el informe lo declara.
- RN-5: No se agregan dependencias de producción; la herramienta de medición es de desarrollo.

## 4. Casos borde y errores

| Caso | Comportamiento esperado |
|---|---|
| El backend no está levantado | El guion termina con un mensaje claro y código distinto de cero; no escribe informe |
| Datos de prueba insuficientes | El guion los crea o avisa; no mide con una base vacía |
| Fallan peticiones | Se cuentan como errores en el informe; no se reintentan en silencio |

## 5. Fuera de alcance de esta HU

- Carga sostenida, picos, pruebas de estrés o en AWS.
- Rendimiento de la app móvil o del panel web.
- Optimizar lo que resulte lento: se registra como defecto o deuda, aparte.

## 6. Dependencias

- HU-18 (búsqueda), HU-22 (abordaje), suite de ataques PB-05 (reutiliza su manera de firmar el desafío).
- Decisiones abiertas: ninguna.

## 7. Definition of Done

- [ ] Criterios de aceptación cumplidos y `informe.md` generado con corridas reales.
- [ ] Lint y formato del guion en verde.
- [ ] PR revisado por otro integrante; CI en verde.
- [ ] Esta spec refleja lo realmente construido.
- [ ] Aceptada por el PO.

## 8. Historial de cambios

| Fecha | Cambio | Entrada en MEMORY.md |
|---|---|---|
| 2026-11-17 | Creación (borrador) | pendiente |
| 2026-11-17 | Aprobada por el PO | pendiente |
