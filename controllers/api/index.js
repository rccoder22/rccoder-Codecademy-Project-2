const router = require("express").Router();
const userRoutes = require("./userRoutes");
const breweryRoutes = require("./breweryRoutes");

// /api/users goto to userRoutes.js
router.use("/users", userRoutes);
router.use("/breweries", breweryRoutes);

module.exports = router;
