import { Order, OrderItem, Product } from '../models/index.js'

export const getUserOrders = async (userId) => {

  const orders = await Order.findAll({
    where: { user_id: userId },
    include: [
      {
        model: OrderItem,
        include: [
          {
            model: Product
          }
        ]
      }
    ],
    order: [['id_order', 'DESC']]
  })

  return orders
}