# HU-31 · Accesibilidad: modo oscuro, tamaño de texto y contraste — Plan técnico

> Fase SDD: **Plan** (Diseño). Estado: `aprobado (2026-11-17, PO)` · Rama: `feat/HU-31-accesibilidad` (mobile)
> Spec aprobada por el PO el 2026-11-17.

## 1. Módulos afectados

| Carpeta | Módulo / componente | Cambio |
|---|---|---|
| mobile | `tema/tokens.ts` | agrega paletas oscuro y alto contraste (valores de `DESIGN_SYSTEM.md` §5; solo se agrega lo que falte) |
| mobile | `tema/` (nuevo `ProveedorTema.tsx`, `useTema.ts`, `useEstilos.ts`) | contexto con tema, escala de texto y alto contraste; guarda en almacenamiento local |
| mobile | `app/_layout.tsx`, `app.json` | monta el proveedor; `userInterfaceStyle: automatic` |
| mobile | `app/ajustes-apariencia.tsx` (nueva) y fila en `perfil.tsx` | pantalla «Apariencia» |
| mobile | **54 archivos** que importan `colores` (205 usos) y **51** `StyleSheet.create` | migración mecánica (ver §7) |
| backend / web / contracts | — | sin cambios |

Reutiliza: `FilaAjuste`, `Casilla`, `Boton`, `Mensajes` para la pantalla; almacenamiento local ya usado en la app (el mismo mecanismo de la sesión no sensible).

## 2. Cambios al modelo de datos

Ninguno. Preferencia solo local (RN-1). Sin migración ni dependencias nuevas (`useColorScheme` y `PixelRatio` son de React Native).

## 3. Endpoints

Ninguno.

## 4. Pantallas

| Cliente | Pantalla | Pasos | Claves i18n |
|---|---|---|---|
| mobile | Perfil → Apariencia | 3 grupos de opciones (Tema, Tamaño de texto, Alto contraste); cada opción con `accessibilityRole="radio"` y `accessibilityState.selected`; aplica al tocar | `comun.apariencia.{titulo,tema,automatico,claro,oscuro,texto,normal,grande,muy_grande,contraste,no_guardada}` |

## 5. Diseño técnico

El problema real: `colores` es un objeto constante que se lee dentro de `StyleSheet.create` al cargar el módulo; no cambia al cambiar de tema. Decisión:

1. `tema/useEstilos.ts`: `crearEstilos((c, t) => ({ ... }))` devuelve un hook `useEstilos()` que llama a `StyleSheet.create` con la paleta y la escala actuales, memoizado por (tema, escala, contraste). `c` = colores del tema; `t(px)` = tamaño de fuente × escala (Normal 1, Grande 1,15, Muy grande 1,3; tope total 1,5, RN-5).
2. Migración por archivo: `const estilos = StyleSheet.create({...})` → `const useEstilos = crearEstilos((c, t) => ({...}))`, y `const estilos = useEstilos()` dentro del componente. Los `colores.x` sueltos en JSX pasan a `useTema().colores`.
3. `colores` exportado se mantiene (tema claro) para no romper pruebas existentes; se retira al final si ya nadie lo usa.
4. Mapa: no cambia (CA-8). Zonas de marca iguales en ambos temas (ya así en tokens). Alto contraste: paleta con texto `#000`/`#FFF`, bordes visibles ≥ 7:1.
5. Los `fontSize` (20 usos) pasan por `t()`; los componentes de texto compartidos (`Boton`, `Campo`, `Mensajes`) se migran primero, así la mayoría de pantallas hereda la escala.
6. Persistencia: lectura al montar el proveedor; valor inválido → predeterminados (CA-10); error al guardar → se aplica en sesión y se avisa (`no_guardada`).

## 6. Estrategia de pruebas

| Criterio | Tipo | Archivo |
|---|---|---|
| CA-1, CA-9 | Jest: opciones con rol y estado accesibles | `mobile/src/__tests__/apariencia.test.tsx` |
| CA-2, CA-3 | Jest: cambiar tema cambia el fondo de una pantalla real; «automático» sigue `useColorScheme` | ídem |
| CA-4 | Jest: escala 1,15 / 1,3 y tope 1,5 | `tema/useEstilos.test.ts` |
| CA-5, CA-7 | **Unitaria de contraste**: calcula la razón de cada par texto/fondo de las paletas oscuro y alto contraste (≥ 4,5:1, 3:1 en grande; ≥ 7:1 en alto contraste) | `tema/contraste.test.ts` |
| CA-6, CA-10 | Jest: persistencia, dato corrupto, fallo al guardar | `apariencia.test.tsx` |
| Regresión | toda la suite existente de `mobile` (96+ pruebas) debe seguir en verde | CI |
| CA-4, CA-8, CA-9 (visual / TalkBack) | **manual en teléfono**: capturas del flujo principal en oscuro, texto muy grande y alto contraste; lectura con TalkBack | informe en `SPECS/.../HU-31-accesibilidad/verificacion.md` |

## 7. Riesgos

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| **La migración toca 54 archivos y puede romper pantallas o pruebas** | Alta | Alto | Orden: componentes compartidos → pestañas → flujo principal → resto; `lint` + `npm test` tras cada bloque; commits pequeños |
| No alcanza el tiempo para migrar todo | Media | Medio | **Recorte propuesto (pide confirmación):** migrar el flujo principal (buscar, reservar, abordar, billetera, perfil) y declarar el resto «solo claro»; la spec exige el flujo principal en CA-4 y CA-7 |
| Texto muy grande corta botones | Media | Medio | Medir en teléfono; permitir scroll; tope 1,5 |
| TalkBack no lee `Aviso` (pendiente abierto) | Alta | Bajo | Solo se garantiza en los ajustes (CA-9), como dice la spec |

Requiere confirmación humana (§14): **no** (sin datos, API, dependencias ni RLS).

## 8. Tareas propuestas

| Tarea | Horas | Responsable |
|---|---|---|
| Paletas oscuro y alto contraste + prueba de contraste | 2 | por asignar |
| Proveedor de tema, `crearEstilos`, persistencia y pruebas | 3 | por asignar |
| Pantalla Apariencia y fila en Perfil | 2 | por asignar |
| Migrar componentes compartidos y pestañas | 4 | por asignar |
| Migrar resto del flujo principal (buscar, reservar, abordar, billetera) | 4 | por asignar |
| Prueba en teléfono con capturas y TalkBack; verificar y PR | 2 | por asignar |
