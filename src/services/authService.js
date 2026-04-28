import dotenv from 'dotenv'
dotenv.config()

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

// Registra un nuevo usuario en la base de datos.
// Valida los campos, comprueba si el email ya existe y hashea la contraseña.
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

  const { password: _, ...userSafe } = user.toJSON()

  return userSafe
}

// Verifica las credenciales de un usuario. Soporta contraseñas hasheadas (bcrypt)
// y contraseñas en texto plano (usuarios de init.sql).
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
    // Fallback para usuarios del init.sql (sin hash)
    validPassword = password === user.password
  }

  if (!validPassword) {
    const error = new Error('Credenciales incorrectas')
    error.statusCode = 401
    throw error
  }

  return user
}

// Genera un token JWT para el usuario tras validar sus credenciales.
export const login = async ({ email, password }) => {

  if (!email || !password) {
    const error = new Error('Email y password obligatorios')
    error.statusCode = 400
    throw error
  }

  const user = await loginUser(email, password)

  const token = jwt.sign(
    {
      id: user.id_user,
      email: user.email,
      rol: user.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  return token
}

export default { register, login, loginUser }
