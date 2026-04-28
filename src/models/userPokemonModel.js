import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserPokemon = sequelize.define("UserPokemon", {
  id_user_pokemon: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pokemon_id_pokemon: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  current_hp: DataTypes.INTEGER,
  current_attack: DataTypes.INTEGER,
  current_speed: DataTypes.INTEGER
}, {
  tableName: 'user_pokemon',
  timestamps: false
});

export default UserPokemon;