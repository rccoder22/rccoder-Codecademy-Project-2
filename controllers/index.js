const router = require("express").Router();

const apiRoutes = require("./api");
const homeRoutes = require("./homeRoutes.js");

// Regular requests goto homeRoutes.js, all api calls goto apiRoutes.js
router.use("/", homeRoutes);
router.use("/api", apiRoutes);

router.use((req, res, next) => {
  res.status(404);

  if (req.accepts("html")) {
    res.render("notFound", {});
    return;
  }

  if (req.accepts("json")) {
    res.json({ status: 404, error: "Not Found" });
  }
});

module.exports = router;
