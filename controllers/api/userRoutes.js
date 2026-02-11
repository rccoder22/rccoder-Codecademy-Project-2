const router = require("express").Router();
const { Users, Favorites } = require("../../models");

// Main page returns 404
// router.get("/", (req, res) => {
//   res.status(404).json({
//     status: 404,
//     message: "Page does not exists",
//   });
// });

// POST /api/users/favorites gets all users favorites
// send userId
router.post("/favorites", async (req, res) => {
  try {
    if (req.body.userId) {
      const userFavorites = await Favorites.findAll({
        where: {
          user_id: req.body.userId,
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
    } else {
      res.status(400).json({
        status: 400,
        message: "No such user",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error accessing the database",
    });
  }
});

// https://api.openbrewerydb.org/v1/breweries/{obdb-id}
// POST /api/users/favorite Saves favorite brewery information
// send userId and obd_id
router.post("/favorite", async (req, res) => {
  const breweryId = req.body.obd_id;
  const userId = req.body.user_id;
  try {
    const favoriteCounted = await Favorites.findAndCountAll({
      where: {
        obd_id: breweryId,
        user_id: userId,
      },
      limit: 1,
    });

    if (favoriteCounted.count > 0) {
      throw new Error("Already a favorite");
    }

    fetch(`https://api.openbrewerydb.org/v1/breweries/${breweryId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(async (data) => {
        if (userId) {
          const [favorite, created] = await Favorites.findOrCreate({
            where: {
              user_id: userId,
              obd_id: breweryId,
            },
            defaults: {
              user_id: userId,
              obd_id: data.id,
              brewery_name: data.name,
              brewery_type: data.brewery_type,
              address: data.address_1,
              city: data.city,
              state: data.state_province,
              postal_code: data.postal_code,
              longitude: data.longitude,
              latitude: data.latitude,
              phone: data.phone,
              website_url: data.website_url,
            },
          });

          // if
          // const userCount = Users.findAndCountAll({
          //   where: {
          //     user_id: userId,
          //   },
          // });
          // console.log(`\n${userCount}\n`);
          // if (userCount !== 0) {
          //   const createdFavorite = Favorites.create({
          //     user_id: userId,
          //     obd_id: data.id,
          //     brewery_name: data.name,
          //     brewery_type: data.brewery_type,
          //     address: data.address_1,
          //     city: data.city,
          //     state: data.state_province,
          //     postal_code: data.postal_code,
          //     longitude: data.longitude,
          //     latitude: data.latitude,
          //     phone: data.phone,
          //     website_url: data.website_url,
          //   });

          //   if (createdFavorite) {
          //     res.status(200).json({
          //       status: 200,
          //       message: "Created Favorite successfully",
          //     });
          //     return;
          //   }
          // }
          if (created) {
            res.status(200).json({
              data,
              status: 200,
              message: "Data Created successfully",
              created: favorite.obd_id,
            });
            return;
          } else {
            throw new Error("Already exists");
          }
        }
        // req.body.userId
        // Need to save the brewery data to the database as one of the user's favorites
        // returning the json data right now
      })
      .catch((error) => {
        res.status(400).json({
          status: 400,
          message: "Favorite already exists",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: "Could not save favorite brewery",
      error: error.message,
      user_id: userId,
      obd_id: breweryId,
    });
  }
});

// DELETE /api/users/favorite Saves favorite brewery information
// send userId and obd_id

router.delete("/favorite", async (req, res) => {
  const breweryId = req.body.obd_id;
  const userId = req.body.user_id;
  try {
    const favoriteCounted = await Favorites.findAndCountAll({
      where: {
        obd_id: breweryId,
        user_id: userId,
      },
      limit: 1,
    });

    if (favoriteCounted.count === 0) {
      throw new Error("No Record Found");
    }
    const affectedRows = await Favorites.destroy({
      where: {
        obd_id: breweryId,
        user_id: userId,
      },
    });

    if (affectedRows > 0) {
      res.status(200).json({
        status: 200,
        message: `${affectedRows} removed`,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: "Could not delete favorite brewery",
      error: error.message,
      user_id: userId,
      obd_id: breweryId,
    });
  }
});

module.exports = router;
