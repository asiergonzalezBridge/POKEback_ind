import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Team = sequelize.define("Team", {
  id_team: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'team',
  timestamps: false
});

export default Team;