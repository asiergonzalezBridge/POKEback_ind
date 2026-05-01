import { DataTypes } from 'sequelize'
import sequelize from '../config/postgres.js'

const Battle = sequelize.define('Battle', {
  id_battle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_pokemon_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  enemy_pokemon_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  enemy_hp: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  enemy_attack: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  result: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  coins_earned: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'battles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
})

export default Battle
