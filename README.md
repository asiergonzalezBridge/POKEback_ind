# ⚡ POKEback — Backend Grupal

Este proyecto consiste en la construcción del backend de una plataforma de temática Pokémon desarrollada con **Node.js + Express + Sequelize + PostgreSQL + POSTMAN**; donde los usuarios podrán:

- Registrarse e iniciar sesión
- Gestionar su perfil
- Comprar y gestionar elementos dentro de una tienda
- Sirve como plataforma para futuros juegos (PvE o PvP)

La tienda es solo una parte de un sistema más grande, donde la lógica principal gira en torno a la interacción entre usuarios, sus recursos y mecánicas de juego.

---

# 🎯 Objetivo del Proyecto

El objetivo principal es demostrar dominio de:

Desarrollo backend con Node.js
Diseño de APIs REST
Uso de bases de datos relacionales (PostgreSQL)
Buenas prácticas (estructura, seguridad, organización)

Siguiendo el enfoque de

"Menos es más, si está bien hecho"


---

## 🗂️ Estructura del proyecto

El backend seguirá una arquitectura basada en:

- API REST
- Patrón MVC (Modelo - Vista - Controlador)

Estructura prevista:

```
DOCS/
├── diagramas/
│   ├── flujo_admin.svg
│   ├── flujo_normal.svg
│   ├── tablas.png
├── POKEback_Memoria.pdf
├── README.md
public/
├── fonts/
│   ├── pokemon-solid.ttf
├── styles.css
├── admin.css
├── dashboard.css
├── index.css
├── login-register.css
├── pokemon.css
├── store.css
├── teams.css
src/
├── config/
│   ├── db.js                # Conexión Sequelize
├── controllers/             # Recibe la petición, llama a servicio y devuelve resultado final a vista.
│   ├── adminController.js
│   ├── authController.js
│   ├── pokemonController.js
│   ├── productsController.js
│   ├── teamController.js
│   ├── userController.js
│   ├── userPokemonController.js
│   ├── userStoreController.js
├── middlewares/             # Componentes Clave
│   ├── authMiddelware.js    # JWT 
│   ├── sessionMiddelware.js # Sesión + roles
├── models/                  # Interactúa con la base de datos y devuelve datos al Servicio.
│   ├── index.js 
│   ├── pokemonModel.js      
│   ├── productsModel.js      
│   ├── teamModel.js         
│   ├── teamPokemonModel.js  
│   ├── userModel.js         
│   ├── userPokemonModel.js
│   ├── userStoreModel.js 
├── routes/                  # Definición de rutas (API + vistas)
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── index.js
│   ├── pokemonRoutes.js
│   ├── productsRoutes.js
│   ├── teamRoutes.js
│   ├── userPokemonRoutes.js
│   ├── userRoutes.js
│   ├── userStoreRoutes.js
│   ├── viewRoutes.js
├── services/                # Lógica de negocio
│   ├── adminService.js
│   ├── authService.js
│   ├── pokemonService.js
│   ├── productService.js
│   ├── teamService.js
│   ├── userPokemonService.js
│   ├── userService.js
│   ├── userStoreService.js
└── views/                   # Plantillas
│   ├── admin.pug
│   ├── dashboard.pug
│   ├── error.pug
│   ├── index.pug
│   ├── layout.pug
│   ├── login.pug
│   ├── pokemon.pug
│   ├── register.pug
│   ├── store.pug
│   ├── teams.pug
├── index.js 

```
---

## 🔗 Relaciones entre modelos

| Relación | Tipo |
|----------|------|
| User → UserPokemon | One-to-Many |
| UserPokemon → User | Many-to-One |
| User → Team | One-to-Many |
| Team → User | Many-to-One |
| Team → TeamPokemon | One-to-Many |
| TeamPokemon → Team | Many-to-One |
| TeamPokemon → UserPokemon | Many-to-One |
| UserPokemon → Pokemon | Many-to-One |

---

## 🚀 Instalación y arranque

```bash
# 1. Clonar e instalar dependencias
git clone <repo-url>
cd pokeback
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus datos de PostgreSQL

# 3. Crear la base de datos en PostgreSQL
create pokeback_db

# 4. Arrancar el servidor (sincroniza tablas automáticamente)
npm run dev

```
---

## 🛣️ Rutas disponibles

### Vistas (navegador)
| Ruta | Descripción | Auth |
|------|-------------|------|
| `GET /` | Home | Pública |
| `POST /auth/login` | Login | Pública |
| `POST /auth/register` | Registro | Pública |
| `GET /pokemon` | Pokédex | Pública |
| `GET /pokemon/:id` | Detalle Pokémon | Pública |
| `GET /products` | Tienda | Pública |
| `GET /products/:id` | Buscar productos | Pública |
| `GET /users/perfil` | Mi perfil | Sesión |
| `GET /:user_id` | Pokemons de un usuario | Sesión |
| `GET /users/admin` | Gestión usuarios | Admin |

### API REST

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registro | Pública |
| POST | `/api/auth/login` | Login → JWT | Pública |
| GET | `/api/pokemon` | Listar pokémon | Pública |
| GET | `/api/pokemon/:id` | Detalle | Pública |
| POST | `/api/pokemon` | Crear | Admin JWT |
| PATCH | `/api/pokemon/:id` | Editar | Admin JWT |
| DELETE | `/api/pokemon/:id` | Eliminar | Admin JWT |
| GET | `/api/pokemon/mis-pokemons` | Mi equipo | JWT |
| GET | `/api/products` | Listar productos | Pública |
| POST | `/api/products` | Crear | Admin JWT |
| PATCH | `/api/products/:id` | Editar | Admin JWT |
| DELETE | `/api/products/:id` | Eliminar | Admin JWT |
| GET | `/api/users` | Listar usuarios | Admin JWT |
| PATCH | `/api/users/:id` | Editar usuario | JWT |
| DELETE | `/api/users/:id` | Eliminar usuario | Admin JWT |

---

## 🔐 Credenciales de prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| luis@mail.com | 1234 | user |

---

## 🧩 Reparto de tareas


| Módulo | Responsable |
|--------|------------|
| User + Auth + Relaciones | Asier |
| Pokemon + Documentación| Darío |
| Product + Vistas | Luís |
| Team + Team Pokemon | Eli |

---

## Autores

- Asier Gonzales
- Luis Alonso
- Eli Fernández
- Darío Arenaza

---

![Tablas](/diagramas/tablas.png)

---

![Flujo normal](/diagramas/flujo_normal.svg)

---

![Flujo admin](/diagramas/flujo_admin.svg)

---