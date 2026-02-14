const router = require("express").Router();
const { Users, Favorites } = require("../../models");

router.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

router.post("/", async (req, res) => {
  try {
    const dbUserData = await Users.create({
      first_name: req.body.firstname,
      last_name: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user = {
        loggedIn: true,
        firstname: dbUserData.first_name,
        email: dbUserData.email,
        user: dbUserData.user_id,
      };

      res.status(200).json({
        status: 200,
        message: "Logged In",
        dbUserData,
      });
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Unable to create user",
    });
  }
});

// POST /api/users/favorites gets all users favorites
// send userId
router.post("/favorites", async (req, res) => {
  try {
    if (req.session.user) {
      const userFavorites = await Favorites.findAll({
        where: {
          user_id: req.session.user.user,
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
  const user = req.session.user;
  try {
    const favoriteCounted = await Favorites.findAndCountAll({
      where: {
        obd_id: breweryId,
        user_id: user.user,
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
        if (user.user) {
          const [favorite, created] = await Favorites.findOrCreate({
            where: {
              user_id: user.user,
              obd_id: breweryId,
            },
            defaults: {
              user_id: user.user,
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
      user_id: user.user,
      obd_id: breweryId,
    });
  }
});

// DELETE /api/users/favorite Deletes favorite brewery information
// send userId and obd_id
router.delete("/favorite", async (req, res) => {
  const breweryId = req.body.obd_id;
  const userId = req.body.user_id;
  const user = req.session.user;
  try {
    const favoriteCounted = await Favorites.findAndCountAll({
      where: {
        obd_id: breweryId,
        user_id: user.user,
      },
      limit: 1,
    });

    if (favoriteCounted.count === 0) {
      throw new Error("No Record Found");
    }
    const affectedRows = await Favorites.destroy({
      where: {
        obd_id: breweryId,
        user_id: user.user,
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
      user_id: user.user,
      obd_id: breweryId,
    });
  }
});

// POST /api/users/login  Login the user
// requires email and password
router.post("/login", async (req, res) => {
  try {
    const dbUserData = await Users.findOne({
      where: {
        email: req.body.username,
      },
    });

    if (!dbUserData) {
      res.status(400).json({
        status: 400,
        message: "Incorrect email or password.  Please try again!",
      });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({
        status: 400,
        message: "Incorrect email or password.  Please try again!",
      });
      return;
    }

    req.session.save(() => {
      req.session.user = {
        loggedIn: true,
        firstname: dbUserData.first_name,
        email: dbUserData.email,
        user: dbUserData.user_id,
      };

      res.status(200).json({
        status: 200,
        message: "You are now logged in.",
      });
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
});

// POST /api/users/logout  Log out the user
router.post("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
