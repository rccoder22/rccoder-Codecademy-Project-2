const router = require("express").Router();
const userRoutes = require("./userRoutes");

// /api/users goto to userRoutes.js
router.use("/users", userRoutes);

module.exports = router;
