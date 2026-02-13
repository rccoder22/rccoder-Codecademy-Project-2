const router = require("express").Router();
const { Users, Favorites } = require("../../models");

router.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// GET /api/breweries
router.get("/", (req, res) => {
  res.status(404).json({ status: 404, message: "Page Not Found" });
});

// POST /api/breweries
router.post("/", (req, res) => {
  res.status(404).json({ status: 404, message: "Page Not Found" });
});

// POST /api/breweries/search/1
router.post("/search/1", (req, res) => {
  if (req.body.obd_id) {
    let obdId = req.body.obd_id;
    const url = `https://api.openbrewerydb.org/v1/breweries/${obdId}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching brewery");
        }
        return response.json();
      })
      .then((data) => {
        res.json({ data, url: url, status: 200 });
      })
      .catch((error) => {
        res.status(400).json({
          status: 400,
          message: "Error retrieving brewery info",
          url: url,
        });
      });
  } else {
    res.status(400).json({
      status: 400,
      message: "Invalid request.",
    });
  }
});

// POST /api/breweries/search
router.post("/search", (req, res) => {
  if (req.body.city) {
    let cityEntry = req.body.city;
    cityEntry = cityEntry.trim().toLowerCase();
    let url = "https://api.openbrewerydb.org/v1/breweries?per_page=10&";
    if (isNaN(Number(cityEntry))) {
      url += `by_city=${encodeURIComponent(cityEntry)}`;
    } else {
      url += `by_postal=${encodeURIComponent(cityEntry)}`;
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          res.status(400).json({
            data: [],
            message: "Error getting info from server",
          });
        }
        return response.json();
      })
      .then(async (data) => {
        // console.log(`Data from ODB: ${JSON.stringify(data)}\n`);
        let newData = data;
        if (req.session.user) {
          const user = req.session.user;
          const userId = user.user;
          const faves = await Favorites.findAll({
            where: {
              user_id: userId,
            },
          });
          const faveList = faves.map((fav) => {
            const brews = fav.get({ plain: true });
            return { obd_id: brews.obd_id, favorite_id: brews.favorite_id };
          });
          if (faveList.length > 0) {
            newData = data.map((brewery) => {
              const isFav = faveList.find((fav) => fav.obd_id === brewery.id);
              return {
                ...brewery,
                isFavorite: isFav ? true : false,
                isUser: userId || null,
              };
            });
          }
        }
        res.json({ newData });
      })
      .catch((error) => {
        console.log(`\nError fetching breweries: ${error.message}\n`);
        res.status(400).json({
          status: 400,
          message: "Cannot retreive breweries info",
        });
      });
  } else {
    res.status(400).json({
      status: 400,
      message: "Invalid request.",
    });
  }
});

module.exports = router;
