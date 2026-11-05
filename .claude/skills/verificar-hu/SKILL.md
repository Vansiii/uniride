---
name: verificar-hu
description: Verificar una HU o cambio contra la Definition of Done de UniRide (lint, formato, pruebas, build por carpeta, criterios de aceptación, pruebas de ataque). Usar antes de dar una tarea por terminada, abrir un PR o cerrar una HU.
---

# Verificar (fase Verify)

1. Detectar carpetas tocadas: `git status` y `git -C <carpeta> status` (son submódulos).
2. Por cada carpeta, leer su `package.json` y ejecutar **solo scripts que existan** (tabla en `AGENTS.md` §9): `lint`, `format:verificar`, `test`, `build`; en `backend/` además `test:e2e`. Una carpeta a la vez (npm en paralelo corrompe la caché). Node 24 / npm 11 requeridos; si el entorno tiene otra versión, decirlo.
3. Mapear cada criterio CA-x de `spec.md` a su prueba (plan §6). Un criterio sin prueba automatizada = pendiente.
4. Si toca verificación, billetera, escrow, estados del viaje u organizaciones: usar la skill `amenazas` y confirmar que la prueba de ataque existe y falla el ataque.
5. Checklist de `.github/pull_request_template.md`: Swagger actualizado, textos en `es-BO` (no en código), sin secretos/datos sensibles en código, logs o pruebas, cobertura backend ≥ 70 %, `spec.md`/`ssd.md` al día.
6. Indicar qué UML (casos de uso, clases, paquetes, despliegue, secuencia) debería actualizarse.
7. Informe final corto: ✅ verificado (con el comando), ❌ falló (salida completa), ⚠️ no verificado (p. ej. atestación solo en teléfono físico, Docker apagado, despliegue AWS, aceptación del PO). Nunca declarar la HU "terminada" si falta algo de `AGENTS.md` §16.

Nunca borrar, saltar (`skip`/`only`) ni debilitar pruebas para que pase el pipeline.
