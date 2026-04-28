import { User, UserStore } from '../models/index.js'
import Product from '../models/productsModel.js'

// Obtiene todos los usuarios excluyendo el campo password.
export const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['password'] },
    order: [['id_user', 'ASC']]
  })
}

// Elimina un usuario por su ID.
export const deleteUser = async (id) => {
  const user = await User.findByPk(id)

  if (!user) {
    const error = new Error('Usuario no encontrado')
    error.statusCode = 404
    throw error
  }

  await user.destroy()
}

// Edita el poketype y las monedas de un usuario.
export const editUser = async (id, data) => {
  const user = await User.findByPk(id)

  if (!user) {
    const error = new Error('Usuario no encontrado')
    error.statusCode = 404
    throw error
  }

  await user.update({
    poketype: data.poketype,
    coins: parseInt(data.coins)
  })
}

// Obtiene todos los productos ordenados por ID.
export const getAllProducts = async () => {
  return await Product.findAll({
    order: [['id_product', 'ASC']]
  })
}

// Crea un nuevo producto.
export const createProduct = async (data) => {
  const { type, name, description, price, stock, expire_time } = data

  if (!type || !name || price === undefined || stock === undefined) {
    const error = new Error('Faltan campos obligatorios')
    error.statusCode = 400
    throw error
  }

  await Product.create({
    type, name, description, price, stock,
    expire_time: expire_time || null
  })
}

// Edita un producto existente.
export const editProduct = async (id, data) => {
  const product = await Product.findByPk(id)

  if (!product) {
    const error = new Error('Producto no encontrado')
    error.statusCode = 404
    throw error
  }

  await product.update(data)
}

// Elimina un producto por su ID.
export const deleteProduct = async (id) => {
  const product = await Product.findByPk(id)

  if (!product) {
    const error = new Error('Producto no encontrado')
    error.statusCode = 404
    throw error
  }

  await product.destroy()
}

// Obtiene todas las compras de todos los usuarios.
export const getAllPurchases = async () => {
  return await UserStore.findAll({
    include: [
      { model: Product, as: 'product' },
      { model: User, attributes: ['username'] }
    ],
    order: [['user_id_user', 'ASC']]
  })
}