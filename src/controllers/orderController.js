import * as orderService from '../services/orderService.js'

export const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id

    const orders = await orderService.getUserOrders(userId)

    res.json(orders)

  } catch (error) {
    next(error)
  }
}