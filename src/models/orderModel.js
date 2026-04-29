import { DataTypes } from 'sequelize'
import sequelize from '../config/postgres.js'

export const Order = sequelize.define('Order', {
  id_order: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: DataTypes.INTEGER,
  total: DataTypes.FLOAT,
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'orders',
  timestamps: false
})