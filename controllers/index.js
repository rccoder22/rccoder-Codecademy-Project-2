const router = require("express").Router();

const apiRoutes = require("./api");
const homeRoutes = require("./homeRoutes.js");

// Regular requests goto homeRoutes.js, all api calls goto apiRoutes.js
router.use("/", homeRoutes);
router.use("/api", apiRoutes);

module.exports = router;
