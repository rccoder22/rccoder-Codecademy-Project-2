const router = require("express").Router();

router.post("/search", (req, res) => {
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
        throw new Error("Error fetching breweries");
      }
      return response.json();
    })
    .then((data) => {
      res.json({ data, url: url });
    })
    .catch((error) => {
      res.status(400).json({
        status: 400,
        message: "Cannot retreive breweries info",
      });
    });
});

module.exports = router;
