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
          res.render("singleSearchPage", {});
          return null;
        }
        return response.json();
      })
      .then(async (data) => {
        if (data) {
          const favData = await Favorites.findOne({
            where: {
              obd_id: data.id,
              user_id: req.session.user ? req.session.user.user : null,
            },
          });
          data.name = data.name.replace(/[^a-zA-Z0-9 ]/g, "");
          if (data.postal_code) {
            data.postal_code = data.postal_code.slice(0, 5);
          }
          if (data.phone) {
            const phone1 = data.phone.slice(0, 3);
            const phone2 = data.phone.slice(3, 6);
            const phone3 = data.phone.slice(6);
            data.phone = `${phone1}-${phone2}-${phone3}`;
          }
          res.render("singleSearchPage", {
            data,
            title: "Brews'n search",
            isFavorite: favData ? true : false,
          });
        }
      })
      .catch((error) => {
        res.render("singleSearchPage", {});
      });
  }
});

router.get("/favorites", async (req, res) => {
  //console.log(`Session user: ${JSON.stringify(req.session.user)}`);
  try {
    if (req.session.user) {
      const user = req.session.user;
      const favorites = await Favorites.findAll({
        where: {
          user_id: user.user,
        },
      });
      const favoritesData = favorites.map((brewery) => {
        const brews = brewery.get({ plain: true });
        brews.brewery_name = brews.brewery_name.replace(/[^a-zA-Z0-9 ]/g, "");
        brews.postal_code = brews.postal_code.slice(0, 5);
        if (brews.phone) {
          brews.phone = brews.phone.replace(/[^0-9]/g, "");
          const phone1 = brews.phone.slice(0, 3);
          const phone2 = brews.phone.slice(3, 6);
          const phone3 = brews.phone.slice(6);
          brews.phone = `${phone1}-${phone2}-${phone3}`;
        }
        return brews;
      });
      res.render("favoritesPage", {
        favoritesData,
        title: "Brews'n User Favorites",
      });
    } else {
      res.redirect(301, "/");
    }
  } catch (error) {
    //console.log(error.message);
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
