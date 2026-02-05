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

// Connect to database
// const sequelize = new Sequelize(
//   {
//     // TODO: Enter PostgreSQL username
//     user: "postgres",
//     // TODO: Enter PostgreSQL password
//     password: "password",
//     host: "localhost",
//     database: "brewery_db",
//   },
//   console.log(`Connected to the brewery_db database.`),
// );

// sequelize.connect();

// let deletedRow = 2;

// sequelize.query(
//   `DELETE FROM brewery_db WHERE id = $1`,
//   [deletedRow],
//   (err, { rows }) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(rows);
//   },
// );

// // Query database
// sequelize.query("SELECT * FROM brewery_db", function (err, { rows }) {
//   console.log(rows);
// });

// // Default response for any other request (Not Found)
// app.use((req, res) => {
//   res.status(404).end();
// });
