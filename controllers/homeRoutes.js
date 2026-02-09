const router = require("express").Router();
const { Users, Favorites } = require("../models");

router.get("/", (req, res) => {
  res.render("homePage", {});
});

router.get("/login", (req, res) => {
  res.render("loginPage", {});
});
module.exports = router;
