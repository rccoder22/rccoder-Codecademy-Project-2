const router = require("express").Router();
const { Users, Favorites } = require("../models");

router.get("/", (req, res) => {
  res.render("homePage", {});
});

router.get("/favorites", async (req, res) => {
  try {
    if (req.query.fav) {
      const favorites = await Favorites.findAll({
        where: {
          user_id: req.query.fav,
        },
      });
      const favoritesData = favorites.map((brewery) => {
        return brewery.get({ plain: true });
      });
      res.render("favoritesPage", { favoritesData });
    } else {
      res.redirect(301, "/");
    }
  } catch (error) {
    res.redirect(301, "/");
  }
});

router.get("/login", (req, res) => {
  res.render("loginPage", {});
});
module.exports = router;
