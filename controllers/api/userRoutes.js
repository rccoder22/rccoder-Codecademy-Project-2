const router = require("express").Router();
const { Users, Favorites } = require("../../models");

// Main page returns 404
router.get("/", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Page does not exists",
  });
});

// /api/users/:userId/favorites gets all users favorites
router.get("/:userId/favorites", async (req, res) => {
  try {
    const userFavorites = await Favorites.findAll({
      where: {
        user_id: req.params.userId,
      },
    });

    if (!userFavorites) {
      res.status(400).json({
        status: 400,
        message: "Could not find user favorites",
      });
    }

    res.status(200).json({
      favorites: userFavorites,
      message: "Favorites accessed",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error accessing the database",
    });
  }
});

// https://api.openbrewerydb.org/v1/breweries/{obdb-id}
// /api/users/:userId/favorite Saves favorite brewery information
router.post("/:userId/favorite", (req, res) => {
  try {
    fetch(`https://api.openbrewerydb.org/v1/breweries/${req.body.obd_id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        // Need to save the brewery data to the database as one of the user's favorites
        // returning the json data right now
        res.json({
          status: 200,
          brewery: data,
        });
      });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: "Could not save favorite brewery",
    });
  }
});

module.exports = router;
