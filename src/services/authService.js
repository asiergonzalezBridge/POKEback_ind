import dotenv from 'dotenv'
dotenv.config()

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, UserPokemon, Pokemon } from '../models/index.js'
import { Op } from 'sequelize'

// Stats base para el Pokémon inicial
const STARTER_HP     = 100
const STARTER_ATTACK = 50
const STARTER_SPEED  = 45

// Registra un nuevo usuario y le asigna un Pokémon inicial según su poketype.
export const register = async ({ username, email, password, poketype }) => {

  if (!username || !email || !password || !poketype) {
    const error = new Error('Todos los campos son obligatorios')
    error.statusCode = 400
    throw error
  }

  const existe = await User.findOne({ where: { email } })
  if (existe) {
    const error = new Error('Email ya registrado')
    error.statusCode = 409
    throw error
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    poketype
  })

  // Buscar un Pokémon del catálogo que coincida con el tipo elegido
  const typeNormalized = poketype.toLowerCase()

  const matchingPokemons = await Pokemon.findAll({
    where: { type: typeNormalized }
  })

  let starterPokemon = null

  if (matchingPokemons.length > 0) {
    // Elegir uno aleatorio del tipo
    starterPokemon = matchingPokemons[Math.floor(Math.random() * matchingPokemons.length)]
  } else {
    // Fallback: Pokémon aleatorio de cualquier tipo
    const count = await Pokemon.count()
    starterPokemon = await Pokemon.findOne({
      offset: Math.floor(Math.random() * count)
    })
  }

  if (starterPokemon) {
    await UserPokemon.create({
      user_id_user:       user.id_user,
      pokemon_id_pokemon: starterPokemon.id_pokemon,
      current_hp:         STARTER_HP,
      current_attack:     STARTER_ATTACK,
      current_speed:      STARTER_SPEED
    })
    console.log(`[register] Starter asignado: ${starterPokemon.name} (${starterPokemon.type}) → user ${user.id_user}`)
  } else {
    console.warn(`[register] No se encontró Pokémon de tipo ${typeNormalized} ni fallback`)
  }

  const { password: _, ...userSafe } = user.toJSON()
  return userSafe
}

// Verifica las credenciales. Soporta bcrypt y texto plano (usuarios init.sql).
export const loginUser = async (email, password) => {

  const user = await User.findOne({ where: { email } })

  if (!user) {
    const error = new Error('Credenciales incorrectas')
    error.statusCode = 401
    throw error
  }

  let validPassword = false

  if (user.password.startsWith('$2b$')) {
    validPassword = await bcrypt.compare(password, user.password)
  } else {
    validPassword = password === user.password
  }

  if (!validPassword) {
    const error = new Error('Credenciales incorrectas')
    error.statusCode = 401
    throw error
  }

  return user
}

// Genera JWT tras validar credenciales.
export const login = async ({ email, password }) => {

  if (!email || !password) {
    const error = new Error('Email y password obligatorios')
    error.statusCode = 400
    throw error
  }

  const user = await loginUser(email, password)

  const token = jwt.sign(
    { id: user.id_user, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  return token
}

export default { register, login, loginUser }