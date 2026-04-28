import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Product = sequelize.define('Product', {
  id_product: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  type: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING(350),
    allowNull: true,
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  expire_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
}, {
  tableName: 'products',
  timestamps: false,
})

export default Product