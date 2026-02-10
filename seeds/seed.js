const sequelize = require("../config/connection");
const seedFavorites = require("./favorites");
const seedUsers = require("./users");

const seedAll = async () => {
  await sequelize.sync({ force: true });

  await seedUsers();

  await seedFavorites();

  process.exit(0);
};

seedAll();

