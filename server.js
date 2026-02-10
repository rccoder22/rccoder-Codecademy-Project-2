const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");

const routes = require("./controllers");
const sequelize = require("./config/connection");
const helpers = require("./utils/helpers");

const PORT = process.env.PORT || 3001;
const app = express();

// Set up handlebars
const hbs = exphbs.create({ helpers });

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

// Run the server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(
      `\nServer running on port ${PORT}. Visit http://localhost:${PORT}`,
    );
  });
});


