import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const User = sequelize.define('User', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  username: {
    type: DataTypes.STRING(50),
    allowNull: false
  },

  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },

  poketype: {
    type: DataTypes.STRING(50),
    allowNull: false
  },

  coins: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  rol: {
  type: DataTypes.STRING,
  defaultValue: 'user'
}

}, {
  tableName: 'users',
  timestamps: false // modificar si queremos incluir createdAt updateAt
})

export default User