import User from '../models/userModel.js'
import bcrypt from 'bcrypt'

//Obtiene todos los usuarios excluyendo el campo password.
export const getUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['password'] }
  })
}

// Obtiene un usuario por su ID.
export const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] }
  })

  if (!user) {
    const error = new Error('Usuario no encontrado')
    error.statusCode = 404
    throw error
  }

  return user
}

// Crea un nuevo usuario con la contraseña hasheada.
export const createUser = async ({ username, password, email, poketype }) => {

  if (!username || !password || !email.includes('@') || !poketype) {
    const error = new Error('Faltan campos obligatorios')
    error.statusCode = 400
    throw error
  }

  const existingUser = await User.findOne({ where: { email } })

  if (existingUser) {
    const error = new Error('El email ya está registrado')
    error.statusCode = 400
    throw error
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await User.create({
    username,
    password: hashedPassword,
    email,
    poketype
  })

  const userSafe = newUser.toJSON()
  delete userSafe.password

  return userSafe
}

// Actualiza los datos de un usuario. Solo modifica los campos recibidos.
export const updateUser = async (id, data) => {
  const user = await User.findByPk(id)

  if (!user) {
    const error = new Error('Usuario no encontrado')
    error.statusCode = 404
    throw error
  }

  const { username, email, poketype, password } = data
  const updatedData = {}

  if (username) updatedData.username = username
  if (email) updatedData.email = email
  if (poketype) updatedData.poketype = poketype
  if (password) updatedData.password = await bcrypt.hash(password, 10)

  await user.update(updatedData)

  const userSafe = user.toJSON()
  delete userSafe.password

  return userSafe
}

// Elimina un usuario de la base de datos (cascade en tablas relacionadas).
export const deleteUser = async (id) => {
  const user = await User.findByPk(id)

  if (!user) {
    const error = new Error('Usuario no encontrado')
    error.statusCode = 404
    throw error
  }

  await user.destroy()

  return { message: 'Usuario eliminado' }
}
