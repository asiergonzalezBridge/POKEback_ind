import Product from '../models/productsModel.js'

// Valida que un ID sea un número válido.
const validateId = (id) => {
  if (!id || isNaN(id)) {
    const error = new Error('ID inválido')
    error.statusCode = 400
    throw error
  }
}

// Obtiene todos los productos de la base de datos.
export const getAllProducts = async () => {
  return await Product.findAll()
}

// Obtiene un producto por su ID.
export const getProductById = async (id) => {
  validateId(id)

  const product = await Product.findByPk(id)

  if (!product) {
    const error = new Error('Producto no encontrado')
    error.statusCode = 404
    throw error
  }

  return product
}

// Crea un nuevo producto.
export const createProduct = async (data) => {
  const { type, name, description, price, stock, expire_time } = data

  if (!type || !name || price === undefined || stock === undefined) {
    const error = new Error('Faltan campos obligatorios')
    error.statusCode = 400
    throw error
  }

  return await Product.create({ type, name, description, price, stock, expire_time })
}

// Actualiza los datos de un producto existente.
export const updateProduct = async (id, data) => {
  validateId(id)

  const product = await Product.findByPk(id)

  if (!product) {
    const error = new Error('Producto no encontrado')
    error.statusCode = 404
    throw error
  }

  if (!data || Object.keys(data).length === 0) {
    const error = new Error('No hay datos para actualizar')
    error.statusCode = 400
    throw error
  }

  await product.update(data)

  return product
}

// Elimina un producto de la base de datos.
export const deleteProduct = async (id) => {
  validateId(id)

  const product = await Product.findByPk(id)

  if (!product) {
    const error = new Error('Producto no encontrado')
    error.statusCode = 404
    throw error
  }

  await product.destroy()

  return { message: 'Producto eliminado' }
}
