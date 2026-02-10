const router = require("express").Router();
const { Users, Favorites } = require("../models");

router.get("/", (req, res) => {
  res.render("homePage", {});
});

router.get("/favorites", async (req, res) => {
  try {
    console.log(`\n\n\n${req.query.uuid}\n\n\n`);
    if (req.query.uuid) {
      const favorites = await Favorites.findAll({
        where: {
          user_id: req.query.uuid,
        },
      });
      console.log(favorites);
      const favoritesData = favorites.get({ plain: true });
      res.render("favoritesPage", favoritesData);
    } else {
      console.log("No uuid found");
      //res.redirect(301, "/");
      res.render("favoritesPage", {});
    }
  } catch (error) {
    console.log(error);
    res.render("favoritesPage", {});
    //res.redirect(301, "/");
  }
});

router.get("/login", (req, res) => {
  res.render("loginPage", {});
});
module.exports = router;
