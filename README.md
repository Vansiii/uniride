# UniRide

Plataforma de carpooling para organizaciones (universidades y empresas) con verificación criptográfica de cada viaje y billetera blockchain propia (solo red de prueba). Proyecto del Grupo 4 · Ingeniería de Software I (INF-422), UAGRM.

## Empezar

Este es el repositorio principal; cada aplicación es un submódulo con su propio repositorio. Clona todo con:

```bash
git clone --recurse-submodules https://github.com/Vansiii/uniride.git
```

1. Lee [`AGENTS.md`](AGENTS.md) (reglas del proyecto) y [`.agents/MEMORY/HEARTBEAT.md`](.agents/MEMORY/HEARTBEAT.md) (estado actual).
2. Instala **Node.js 24 LTS** (trae npm 11; npm 10 falla al instalar el backend) y Docker.
3. Copia `.env.example` a `.env` y completa las contraseñas locales.
4. En cada carpeta: `npm ci`.
5. Entorno completo: `docker compose up --build` (PostgreSQL, MinIO, nodo Hardhat y API en http://localhost:3000/api/v1/salud; Swagger en http://localhost:3000/api/docs).

## Estructura

| Carpeta | Repositorio | Qué es |
|---|---|---|
| `backend/` | [uniride-backend](https://github.com/Vansiii/uniride-backend) | API REST NestJS + Prisma |
| `web/` | [uniride-web](https://github.com/Vansiii/uniride-web) | Paneles de administración (React + Vite) |
| `mobile/` | [uniride-mobile](https://github.com/Vansiii/uniride-mobile) | App de conductor y pasajero (Expo / React Native) |
| `contracts/` | [uniride-contracts](https://github.com/Vansiii/uniride-contracts) | Token URC y escrow (Solidity + Hardhat 3) |
| `SPECS/` | Misión, constitución, roadmap, documento técnico (`ssd.md`) y specs por historia |
| `.agents/` | Memoria de decisiones, estado y Sprint Backlog |

Los comandos de cada carpeta están en `AGENTS.md` §9. Forma de trabajo: Scrum + Spec-Driven Development (`SPECS/constitution.md`).
