import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";


export const Product=sequelize.define("Product",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price :{
        type: DataTypes.STRING,
        allowNull: false,
      },
      description:{
        type:DataTypes.TEXT
      },
      image:{
        type:DataTypes.STRING,
        allowNull:true
      }
})