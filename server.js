const express = require('express');
const { Sequelize } = require('sequelize');


const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const sequelize = new Sequelize(
  {
    // TODO: Enter PostgreSQL username
    user: 'postgres',
    // TODO: Enter PostgreSQL password
    password: 'password',
    host: 'localhost',     
    database: 'brewery_db',
  },
  console.log(`Connected to the brewery_db database.`)
)

sequelize.connect();

let deletedRow = 2;

sequelize.query(
  `DELETE FROM brewery_db WHERE id = $1`,
  [deletedRow],
  (err, { rows }) => {
    if (err) {
      console.log(err);
    }
    console.log(rows);
  }
);

// Query database
sequelize.query('SELECT * FROM favorite_books', function (err, { rows }) {
  console.log(rows);
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});