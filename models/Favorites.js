// Table name: favorites
// Columns:
// favorite_id: UUID, primary key:
// user_id: UUID, foreign key referencing users(user_id):
// obd_id: STRING, not null:
// brewery_name: STRING, not null:
// address: STRING, not null:
// city: STRING, not null:
// state: STRING, not null:
// postal_code: STRING, not null:
// phone: STRING, not null:
// website_url: STRING, not null:

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Favorites extends Model {}

Favorites.init(
  {
    favorite_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    obd_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brewery_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brewery_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "favorites",
  },
);

module.exports = Favorites;
