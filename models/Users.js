// Table_name: users
// Columns:
// user_id: UUID, primary key:
// first_name: STRING, not null:
// last_name: STRING, not null:
// email: STRING, not null, unique:
// password: STRING, not null:

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Users extends Model {}
Users.init (
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'users',
    }
  );

module.exports = Users;