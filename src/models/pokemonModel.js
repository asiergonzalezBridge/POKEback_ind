import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Pokemon = sequelize.define('Pokemon', {
  id_pokemon: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  sprite: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  evolution: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: 'pokemon', // nombre real de la tabla
  timestamps: false // tu tabla no tiene createdAt ni updatedAt
})

export default Pokemon