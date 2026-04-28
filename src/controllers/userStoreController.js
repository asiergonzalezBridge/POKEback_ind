import * as userStoreService from '../services/userStoreService.js'

// 📦 GET USER STORE
export const getUserStore = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = await userStoreService.getUserStore(id)
    res.json(data)
  } catch (error) {
    next(error)
  }
}

// 🛒 BUY PRODUCT
export const buyProduct = async (req, res, next) => {
  try {
    const { userId, productId } = req.body

    const result = await userStoreService.buyProduct(userId, productId)

    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

// ❌ DELETE PRODUCT
export const removeProduct = async (req, res, next) => {
  try {
    const { userId, productId } = req.body

    const result = await userStoreService.removeProduct(userId, productId)

    res.json(result)
  } catch (error) {
    next(error)
  }
}