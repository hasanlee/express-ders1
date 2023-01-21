const express = require("express");
const { connection } = require("./db");
const app = express();
const port = 5000;

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to db");
  }
});

app.use(express.json());

//GET All
app.get("/tasks", (req, res) => {
  connection.query("SELECT * FROM tasks;", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

//INSERT New
app.post("/tasks", (req, res) => {
  connection.query(
    "INSERT INTO tasks (description, due_date, finished_date,employee) VALUES  (?,?,?,?)",
    [
      req.body.description,
      req.body.due_date,
      req.body.finished_date,
      req.body.employee,
    ],
    (error, result) => {
      if (error) return res.json({ error: error });
      res.json(result.insertId);
    }
  );
});

//GET by ID
//SQL injection possible. Test API endpoint.
app.get("/tasks/:id", (req, res) => {
  connection.query(
    `SELECT * FROM tasks WHERE id = ${req.params.id}`,
    // [req.params.id],
    (err, data) => {
      if (err) return res.status(500);
      res.json(data);
    }
  );
});

//UPDATE by ID
app.put("/tasks/:id", (req, res) => {
  connection.query(
    "UPDATE tasks SET ? WHERE id=? ",
    [req.body, req.params.id],
    (err, data) => {
      if (err) return res.status(500);
      res.json(data);
    }
  );
});

//DELETE by ID
app.delete("/tasks/:id", (req, res) => {
  connection.query("DELETE tasks WHERE id=? ", [req.params.id], (err, data) => {
    if (err) return res.status(500);
    if (data.affectedRows) {
      res.json({ message: "Deleted" });
    }
    res.json(data);
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
