import { UserStore, Product } from '../models/index.js'

// Obtiene todos los productos comprados por un usuario.
export const getUserStore = async (userId) => {
  return await UserStore.findAll({
    where: { user_id_user: userId },
    include: [{ model: Product, as: 'product' }]
  })
}

// Compra un producto para un usuario.
export const buyProduct = async (userId, productId) => {

  const existing = await UserStore.findOne({
    where: {
      user_id_user: userId,
      store_id_product: productId
    }
  })

  if (existing) {
    existing.quantity += 1
    await existing.save()
    return existing
  }

  return await UserStore.create({
    user_id_user: userId,
    store_id_product: productId,
    quantity: 1
  })
}

// Elimina un producto del inventario de un usuario.
export const removeProduct = async (userId, productId) => {
  const item = await UserStore.findOne({
    where: {
      user_id_user: userId,
      store_id_product: productId
    }
  })

  if (!item) {
    const error = new Error('Producto no encontrado en la tienda del usuario')
    error.statusCode = 404
    throw error
  }

  await item.destroy()

  return { message: 'Producto eliminado' }
}
