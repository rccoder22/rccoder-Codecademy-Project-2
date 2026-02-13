const router = require("express").Router();

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
      .then((data) => {
        console.log(`Data from ODB: ${data}`);
        res.json({ data });
      })
      .catch((error) => {
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
