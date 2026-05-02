# ⚡ POKEback — Backend con PvE

Plataforma backend de temática Pokémon desarrollada con **Node.js + Express + Sequelize + PostgreSQL + Mongo + Pug**, donde los usuarios pueden:

- Registrarse e iniciar sesión
- Gestionar su perfil y colección de Pokémon
- Comprar productos en la tienda con monedas
- Gestionar equipos de hasta 6 Pokémon
- Combatir en batallas PvE por turnos contra Pokémon salvajes
- Capturar enemigos y añadirlos a su colección
- Perder Pokémon permanentemente en combate (permadeath)

---

## 🎯 Objetivo del Proyecto

Demostrar dominio de desarrollo backend con Node.js siguiendo el enfoque:

> "Menos es más, si está bien hecho."

---

## 🗂️ Estructura del proyecto

```
src/
├── config/
│   ├── postgres.js          # Conexión Sequelize + PostgreSQL
│   └── mongo.js             # Conexión MongoDB (logs/eventos)
├── controllers/
│   ├── authController.js
│   ├── battleController.js  # ← PvE
│   ├── cartController.js
│   ├── pokemonController.js
│   ├── productsController.js
│   ├── teamController.js
│   ├── userController.js
│   ├── userPokemonController.js
│   └── userStoreController.js
├── middlewares/
│   ├── authMiddleware.js    # JWT
│   └── sessionMiddleware.js # Sesión + roles
├── models/
│   ├── index.js             # Asociaciones Sequelize
│   ├── battleModel.js       # ← PvE
│   ├── orderModel.js
│   ├── orderItemModel.js
│   ├── pokemonModel.js
│   ├── productsModel.js
│   ├── teamModel.js
│   ├── teamPokemonModel.js
│   ├── userModel.js
│   ├── userPokemonModel.js
│   └── userStoreModel.js
├── routes/
│   ├── index.js             # Router raíz
│   ├── authRoutes.js
│   ├── battleRoutes.js      # ← PvE (montado en viewRoutes)
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   ├── pokemonRoutes.js
│   ├── productsRoute.js
│   ├── teamRoutes.js
│   ├── userPokemonRoutes.js
│   ├── userRoutes.js
│   ├── userStoreRoutes.js
│   └── viewRoutes.js        # Vistas SSR (incluye rutas de batalla)
├── services/
│   ├── authService.js
│   ├── battleService.js     # ← PvE: lógica de combate
│   ├── cartService.js
│   ├── pokemonService.js
│   ├── productService.js
│   ├── teamService.js
│   ├── userPokemonService.js
│   ├── userService.js
│   ├── userStoreService.js
│   └── orderService.js
└── views/
    ├── layout.pug
    ├── login.pug
    ├── register.pug
    ├── dashboard.pug
    ├── pokemon.pug
    ├── store.pug
    ├── cart.pug
    ├── teams.pug
    ├── battle-select.pug    # ← PvE
    ├── battle-fight.pug     # ← PvE
    ├── battle-result.pug    # ← PvE
    ├── admin.pug
    └── error.pug
```

---

## 🔗 Relaciones entre modelos

| Relación | Tipo |
|----------|------|
| User → UserPokemon | One-to-Many |
| UserPokemon → Pokemon | Many-to-One |
| User → Team | One-to-Many |
| Team → TeamPokemon | One-to-Many |
| TeamPokemon → UserPokemon | Many-to-One |
| User → Order | One-to-Many |
| Order → OrderItem | One-to-Many |
| OrderItem → Product | Many-to-One |
| User → UserStore (carrito) | Many-to-Many a través de UserStore |
| Battle → User | Many-to-One |
| Battle → UserPokemon | Many-to-One (ON DELETE SET NULL) |
| Battle → Pokemon (enemigo) | Many-to-One |

---

## ⚔️ Sistema PvE — Combate por Turnos

### Flujo de batalla
```
GET /battle         → Selección de Pokémon del usuario
POST /battle/start  → Inicia combate, genera enemigo aleatorio
GET /battle/fight   → Vista del turno actual
POST /battle/turn   → Procesa acción elegida
GET /battle/result  → Resultado final
```

### Acciones por turno
| Acción | Efecto |
|--------|--------|
| ⚔️ Atacar | Dañas al enemigo, él contraataca |
| 🔴 Capturar | % éxito según HP del enemigo. Si falla, el enemigo contraataca |
| 🏃 Escapar | Fin de la batalla sin recompensa |

### Mecánica de captura
| Estado del enemigo | Probabilidad |
|-------------------|-------------|
| HP > 30% | 20% |
| HP ≤ 30% | 60% |

### Consecuencias
- **Victoria**: +20 monedas
- **Captura exitosa**: Pokémon añadido a `user_pokemon` con HP regenerado + +20 monedas
- **Derrota**: Tu Pokémon muere permanentemente (DELETE en `user_pokemon`)

### Escalado del enemigo por tipo
- **Tipos agresivos** (fire, electric): más ataque, menos HP
- **Tipos defensivos** (resto): menos ataque, más HP

---

## 🚀 Instalación y arranque

```bash
# 1. Clonar e instalar dependencias
git clone <repo-url>
cd pokeback
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env:
# DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
# JWT_SECRET, SESSION_SECRET
# PGADMIN_DEFAULT_EMAIL, PGADMIN_DEFAULT_PASSWORD

# 3. Arrancar con Docker
docker compose up

# El init.sql inicializa automáticamente las tablas y datos de ejemplo
```

---

## 🛣️ Rutas disponibles

### Vistas (navegador)

| Ruta | Descripción | Auth |
|------|-------------|------|
| `GET /login` | Login | Pública |
| `GET /register` | Registro | Pública |
| `GET /dashboard` | Panel del usuario | Sesión |
| `GET /store` | Tienda con filtros y paginación | Sesión |
| `GET /cart` | Carrito de compra | Sesión |
| `GET /pokemon` | Mis Pokémon (ordenable) | Sesión |
| `GET /teams` | Mis Equipos | Sesión |
| `GET /battle` | Selección Pokémon PvE | Sesión |
| `GET /battle/fight` | Combate activo | Sesión |
| `GET /battle/result` | Resultado de la batalla | Sesión |
| `GET /admin` | Panel de administración | Admin |

### API REST

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/auth/register` | Registro | Pública |
| POST | `/auth/login` | Login → JWT | Pública |
| GET | `/api/pokemon` | Listar Pokémon | Pública |
| POST | `/api/pokemon` | Crear Pokémon | Admin JWT |
| GET | `/api/products` | Listar productos | Pública |
| POST | `/api/products` | Crear producto | Admin JWT |
| GET | `/api/cart` | Ver carrito | JWT |
| POST | `/api/cart/add` | Añadir al carrito | JWT |
| POST | `/api/cart/remove/:id` | Eliminar del carrito | JWT |
| POST | `/api/cart/checkout` | Finalizar compra | JWT |
| GET | `/api/users` | Listar usuarios | Admin JWT |

---

## 🔐 Credenciales de prueba

| Username | Contraseña | Rol |
|----------|-----------|-----|
| ash | 1234 | user |
| misty | 1234 | user |
| Luis | 4321 | admin |

---

## 🧩 Reparto de tareas

| Módulo | Responsable |
|--------|------------|
| User + Auth + Relaciones + PvE | Asier |
| Pokemon + Documentación | Darío |
| Product + Vistas + Carrito | Luis |
| Team + TeamPokemon + Diagramas | Eli |

---

## Autores

- Asier Gonzalez
- Luis Alonso
- Eli Fernández
- Darío Arenaza