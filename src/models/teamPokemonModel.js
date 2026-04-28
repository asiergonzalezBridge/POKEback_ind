import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TeamPokemon = sequelize.define("TeamPokemon", {
  team_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  slot: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  user_pokemon_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'team_pokemon',
  timestamps: false
});

export default TeamPokemon;