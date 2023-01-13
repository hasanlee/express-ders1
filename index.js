const express = require("express");
const { db } = require("./db");
const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send(db.employees);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
