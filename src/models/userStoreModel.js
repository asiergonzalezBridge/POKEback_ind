import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const UserStore = sequelize.define('UserStore', {
  user_id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  store_id_product: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: 'user_store',
  timestamps: false
})

export default UserStore