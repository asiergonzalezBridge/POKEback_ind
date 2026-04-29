import * as cartService from '../services/cartService.js'

// GET /api/cart
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id

    const cart = await cartService.getCart(userId)
    res.json(cart)

  } catch (error) {
    next(error)
  }
}

// POST /api/cart/add
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { productId, quantity } = req.body

    const cart = await cartService.addToCart(userId, productId, quantity)
    res.json(cart)

  } catch (error) {
    next(error)
  }
}

// DELETE /api/cart/remove/:productId
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { productId } = req.params

    const cart = await cartService.removeFromCart(userId, Number(productId))
    res.json(cart)

  } catch (error) {
    next(error)
  }
}

// PUT /api/cart/update
export const updateQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { productId, quantity } = req.body

    const cart = await cartService.updateQuantity(userId, productId, quantity)
    res.json(cart)

  } catch (error) {
    next(error)
  }
}

// DELETE /api/cart/clear
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id

    const cart = await cartService.clearCart(userId)
    res.json(cart)

  } catch (error) {
    next(error)
  }
}
// GET /api/cart/total
export const getCartTotal = async (req, res, next) => {
  try {
    const userId = req.user.id

    const cart = await cartService.getCartWithTotal(userId)
    res.json(cart)

  } catch (error) {
    next(error)
  }
}

export const checkout = async (req, res, next) => {
  try {
    const userId = req.user.id

    const result = await cartService.checkout(userId)

    res.json(result)

  } catch (error) {
    next(error)
  }
}