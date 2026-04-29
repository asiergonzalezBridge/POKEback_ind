import { Order, OrderItem, Product } from '../models/index.js'

export const getUserOrders = async (userId) => {

  const orders = await Order.findAll({
    where: { user_id: userId },
    include: [
      {
        model: OrderItem,
        include: [
          {
            model: Product,
            attributes: ['id_product', 'name', 'price', 'image', 'type']
          }
        ]
      }
    ],
    order: [['id_order', 'DESC']]
  })

  return orders.map(order => ({
  id: order.id_order,
  total: order.total,
  items: order.OrderItems.map(item => ({
    productId: item.product_id,
    name: item.Product.name,
    image: item.Product.image,
    price: item.price,
    quantity: item.quantity
  }))
}))
}