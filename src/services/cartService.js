import Cart from '../models/cartModel.js'
import { Product, Order, OrderItem, User, UserStore } from '../models/index.js'
import { Op } from 'sequelize'

// =======================
// OBTENER O CREAR CARRITO
// =======================
export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId })

  if (!cart) {
    cart = await Cart.create({ userId, items: [] })
  }

  return cart
}

// =======================
// AÑADIR AL CARRITO
// =======================
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

// =======================
// ELIMINAR DEL CARRITO
// =======================
export const removeFromCart = async (userId, productId) => {
  const cart = await getOrCreateCart(userId)

  cart.items = cart.items.filter(
    item => item.productId !== productId
  )

  await cart.save()
  return cart
}

// =======================
// ACTUALIZAR CANTIDAD
// =======================
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
// =======================
// OBTENER CANTIDAD TOTAL DE PRODUCTOS EN EL CARRITO
// =======================
export const getCartCount = async (userId) => {
  const cart = await getOrCreateCart(userId)

  const count = cart.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  )

  return count
}

// =======================
// VACIAR CARRITO
// =======================
export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId)

  cart.items = []
  await cart.save()

  return cart
}

// =======================
// OBTENER CARRITO
// =======================
export const getCart = async (userId) => {
  return await getOrCreateCart(userId)
}

// =======================
// CARRITO CON TOTAL
// =======================
export const getCartWithTotal = async (userId) => {
  const cart = await getOrCreateCart(userId) // 👈 ESTO YA CREA SI NO EXISTE

  if (!cart || !cart.items) {
    return {
      userId,
      items: [],
      total: 0
    }
  }

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
  subtotal,
  product: {
    name: product.name,
    description: product.description,
    type: product.type,
    price: price
  }
}
}).filter(Boolean)

  const total = itemsWithDetails.reduce(
    (acc, item) => acc + item.subtotal,
    0
  )

  return {
    userId: cart.userId,
    items: itemsWithDetails,
    total
  }
}

// =======================
// CHECKOUT (COMPRA)
// =======================
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

  // OBTENER USUARIO
  const user = await User.findByPk(userId)

  // VALIDAR MONEDAS
  if (user.coins < total) {
    throw new Error('Monedas insuficientes')
  }

  // RESTAR MONEDAS
  user.coins -= total
  await user.save()

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

  // ACTUALIZAR INVENTARIO (user_store)
  for (const item of cart.items) {
    const existing = await UserStore.findOne({
      where: {
        user_id_user: userId,
        store_id_product: item.productId
      }
    })

    if (existing) {
      existing.quantity += item.quantity
      await existing.save()
    } else {
      await UserStore.create({
        user_id_user: userId,
        store_id_product: item.productId,
        quantity: item.quantity
      })
    }
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