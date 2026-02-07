const Users = require('./Users');
const Favorites = require('./Favorites');

Users.hasMany(Favorites, {
  foreignKey: 'user_id',
});

// Painting.belongsTo(Gallery, {
//   foreignKey: 'gallery_id',
// });

module.exports = { Users, Favorites };