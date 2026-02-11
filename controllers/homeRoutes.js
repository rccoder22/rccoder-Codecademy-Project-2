const router = require("express").Router();
const { Users, Favorites } = require("../models");

// Home page
router.get("/", (req, res) => {
  res.render("homePage", {});
});

//Search for one Brewery
router.get("/search/1", (req, res) => {
  if (req.query.bn) {
    const lookup = req.query.bn;
    const url = `https://api.openbrewerydb.org/v1/breweries/${lookup}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          res.status(400).json({
            status: 400,
            message: `Database response status ${response.status}`,
          });
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          res.render("singleSearchPage", { data });
        }
      })
      .catch((error) => {
        res.status(400).json({
          status: 400,
          message: error.message,
        });
      });
  }
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
