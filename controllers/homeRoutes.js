const router = require("express").Router();
const { Users, Favorites } = require("../models");

router.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Home page
router.get("/", (req, res) => {
  res.render("homePage", {
    title: "Brews'n Home",
  });
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
          data.name = data.name.replace(/[^a-zA-Z0-9 ]/g, "");
          data.postal_code = data.postal_code.slice(0,5);
          const phone1 = data.phone.slice(0,3);
          const phone2 = data.phone.slice(3,6);
          const phone3 = data.phone.slice(6);
          data.phone = `${phone1}-${phone2}-${phone3}`;
          res.render("singleSearchPage", { data, title: "Brews'n search" });
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
    if (req.session.user) {
      const favorites = await Favorites.findAll({
        where: {
          user_id: req.session.user.user,
        },
      });
      const favoritesData = favorites.map((brewery) => {
        return brewery.get({ plain: true });
      });
      res.render("favoritesPage", {
        favoritesData,
        title: "Brews'n User Favorites",
      });
    } else {
      res.redirect(301, "/");
    }
  } catch (error) {
    res.redirect(301, "/");
  }
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
    return;
  }
  res.render("loginPage", {
    title: "Brews'n login",
  });
});

module.exports = router;
