import { DataTypes } from 'sequelize'
import sequelize from '../config/postgres.js'

export const OrderItem = sequelize.define('OrderItem', {
  id_order_item: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
  price: DataTypes.FLOAT
}, {
  tableName: 'order_items',
  timestamps: false
})