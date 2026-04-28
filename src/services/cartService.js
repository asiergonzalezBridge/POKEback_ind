import Cart from '../models/cart.js'

// 🔹 Obtener o crear carrito
export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId })

  if (!cart) {
    cart = await Cart.create({ userId, items: [] })
  }

  return cart
}

// 🔹 Añadir producto
export const addToCart = async (userId, productId, quantity = 1) => {
  const cart = await getOrCreateCart(userId)

  const itemIndex = cart.items.findIndex(
    item => item.productId === productId
  )

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity
  } else {
    cart.items.push({ productId, quantity })
  }

  await cart.save()
  return cart
}

// 🔹 Eliminar producto
export const removeFromCart = async (userId, productId) => {
  const cart = await getOrCreateCart(userId)

  cart.items = cart.items.filter(
    item => item.productId !== productId
  )

  await cart.save()
  return cart
}

// 🔹 Actualizar cantidad
export const updateQuantity = async (userId, productId, quantity) => {
  const cart = await getOrCreateCart(userId)

  const item = cart.items.find(
    item => item.productId === productId
  )

  if (item) {
    item.quantity = quantity
  }

  await cart.save()
  return cart
}

// 🔹 Vaciar carrito
export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId)

  cart.items = []
  await cart.save()

  return cart
}

// 🔹 Obtener carrito
export const getCart = async (userId) => {
  return await getOrCreateCart(userId)
}