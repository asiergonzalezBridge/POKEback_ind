import Cart from '../models/cartModel.js'
import { Product } from '../models/index.js'
import { Op } from 'sequelize'
import { Order, OrderItem } from '../models/index.js'

// Obtener o crear carrito
export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId })

  if (!cart) {
    cart = await Cart.create({ userId, items: [] })
  }

  return cart
}

// Añadir producto con validación stock
export const addToCart = async (userId, productId, quantity = 1) => {

  const cart = await getOrCreateCart(userId)

  const product = await Product.findByPk(productId)

  if (!product) {
    throw new Error('Producto no existe')
  }

  const existingItem = cart.items.find(
    item => item.productId === productId
  )

  const newQuantity = existingItem
    ? existingItem.quantity + quantity
    : quantity

  if (newQuantity > product.stock) {
    throw new Error(`Stock insuficiente. Disponible: ${product.stock}`)
  }

  if (existingItem) {
    existingItem.quantity = newQuantity
  } else {
    cart.items.push({ productId, quantity })
  }

  await cart.save()
  return cart
}

// Eliminar producto
export const removeFromCart = async (userId, productId) => {
  const cart = await getOrCreateCart(userId)

  cart.items = cart.items.filter(
    item => item.productId !== productId
  )

  await cart.save()
  return cart
}

// Actualizar cantidad
export const updateQuantity = async (userId, productId, quantity) => {

  const cart = await getOrCreateCart(userId)

  const product = await Product.findByPk(productId)

  if (!product) {
    throw new Error('Producto no existe')
  }

  if (quantity <= 0) {
    throw new Error('Cantidad inválida')
  }

  if (quantity > product.stock) {
    throw new Error(`Stock insuficiente. Disponible: ${product.stock}`)
  }

  const item = cart.items.find(
    item => item.productId === productId
  )

  if (!item) {
    throw new Error('Producto no está en el carrito')
  }

  item.quantity = quantity

  await cart.save()

  return cart
}

// Vaciar carrito
export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId)

  cart.items = []
  await cart.save()

  return cart
}

// Obtener carrito
export const getCart = async (userId) => {
  return await getOrCreateCart(userId)
}

//compra total del carrito

  export const getCartWithTotal = async (userId) => {
  const cart = await getOrCreateCart(userId)

  const productIds = cart.items.map(item => item.productId)

  const products = await Product.findAll({
    where: {
      id_product: productIds
    }
  })

  const itemsWithDetails = cart.items.map(item => {
    const product = products.find(
      p => p.id_product === item.productId
    )

    if (!product) return null

    const price = parseFloat(product.price)
    const subtotal = price * item.quantity

    return {
      productId: item.productId,
      quantity: item.quantity,
      price,
      subtotal
    }
  }).filter(item => item !== null)

  const total = itemsWithDetails.reduce(
    (acc, item) => acc + item.subtotal,
    0
  )

  return {
    userId: cart.userId,
    items: itemsWithDetails,
    total
  }
  console.log('👉 getCartWithTotal ejecutándose')
  console.log('👉 items:', cart.items)

}

export const checkout = async (userId) => {

  const cart = await getOrCreateCart(userId)

  if (cart.items.length === 0) {
    throw new Error('El carrito está vacío')
  }

  const productIds = cart.items.map(item => item.productId)

  const products = await Product.findAll({
    where: {
      id_product: {
        [Op.in]: productIds
      }
    }
  })

  // VALIDAR STOCK
  for (const item of cart.items) {
    const product = products.find(
      p => p.id_product === item.productId
    )

    if (!product) {
      throw new Error(`Producto ${item.productId} no existe`)
    }

    if (item.quantity > product.stock) {
      throw new Error(`Stock insuficiente para ${product.name}`)
    }
  }

  // CALCULAR TOTAL
  const total = cart.items.reduce((acc, item) => {
    const product = products.find(
      p => p.id_product === item.productId
    )

    return acc + (parseFloat(product.price) * item.quantity)
  }, 0)

  // CREAR ORDER
  const order = await Order.create({
    user_id: userId,
    total
  })

  // CREAR ORDER ITEMS
  for (const item of cart.items) {
    const product = products.find(
      p => p.id_product === item.productId
    )

    await OrderItem.create({
      order_id: order.id_order,
      product_id: item.productId,
      quantity: item.quantity,
      price: product.price
    })
  }

  // RESTAR STOCK
  for (const item of cart.items) {
    const product = products.find(
      p => p.id_product === item.productId
    )

    product.stock -= item.quantity
    await product.save()
  }

  // LIMPIAR CARRITO
  cart.items = []
  await cart.save()

  return {
    message: 'Compra realizada con éxito',
    total
  }
}