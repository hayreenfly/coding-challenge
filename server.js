const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const db = require("./db/models");
require("dotenv").config();
const logger = require("morgan"); // middleware to log HTTP requests in the console
const cors = require("cors");


const app = express();

const PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(cors());

// Initializing middleware to parse incoming request bodies
// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({
  extended: true
}));
//form-urlencoded



app.get("/", (req, res) => {
  res.send("Set up complete for coding challenge");
});

// Defining Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/post", require("./routes/api/post"));

// Connect Database
db.sequelize.sync({
  force: false
}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
  });
});