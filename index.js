const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { connection } = require("./db");
const { authenticateJWT } = require("./middlewares/auth");
const { errorHandler } = require("./middlewares/errorHandler");
const { pageNotFoundHandler } = require("./middlewares/pageNotFoundHandler");
const { tryCatch } = require("./utils/tryCatch");
const app = express();
const port = 5000;

dotenv.config();

async () => {
  await (
    await connection
  ).connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connected to db");
    }
  });
};

//Middlewares
app.use(express.json());

//Routes
app.post(
  "/login",
  tryCatch(async (req, res) => {
    const { username, password } = req.body;
    const [rows] = await (
      await connection
    ).execute(`SELECT * FROM users WHERE username = ?`, [username]);

    //Check user
    const user = rows[0];
    console.log(user);
    if (!user) throw new Error("User not found");

    //Check password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) throw new Error("Incorrect password.");

    // Generate an access token
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET_TOKEN
    );

    res.json({
      accessToken,
      user,
    });
  })
);

//GET All
app.get(
  "/tasks",
  authenticateJWT,
  tryCatch(async (req, res) => {
    await (
      await connection
    )
      .query("SELECT * FROM tasks;")
      .then(([rows]) => {
        return res.status(200).json(rows);
      })
      .catch((err) => {
        throw new Error(err);
      });
  })
);

//INSERT New
app.post(
  "/tasks",
  authenticateJWT,
  tryCatch(async (req, res) => {
    await (
      await connection
    )
      .query(
        "INSERT INTO tasks (description, due_date, finished_date,employee) VALUES  (?,?,?,?)",
        [
          req.body.description,
          req.body.due_date,
          req.body.finished_date,
          req.body.employee,
        ]
      )
      .then(([data]) => {
        return res.status(200).json(data.insertId);
      })
      .catch((err) => {
        throw new Error(err);
      });
  })
);

//GET by ID
//SQL injection possible. Test API endpoint.
app.get(
  "/tasks/:id",
  authenticateJWT,
  tryCatch(async (req, res) => {
    await (
      await connection
    )
      .query(
        `SELECT * FROM tasks WHERE id = ${req.params.id}`
        // [req.params.id]
      )
      .then(([data]) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        throw new Error(err);
      });
  })
);

//UPDATE by ID
app.put(
  "/tasks/:id",
  authenticateJWT,
  tryCatch(async (req, res) => {
    await (
      await connection
    )
      .query("UPDATE tasks SET ? WHERE id=? ", [req.body, req.params.id])
      .then(([data]) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        throw new Error(err);
      });
  })
);

//DELETE by ID
app.delete(
  "/tasks/:id",
  authenticateJWT,
  tryCatch(async (req, res) => {
    await (
      await connection
    )
      .query("SELECT * FROM tasks WHERE id=?; DELETE FROM tasks WHERE id=? ", [
        req.params.id,
        req.params.id,
      ])
      .then(([data]) => {
        if (data[1].affectedRows) {
          res.status(200).json({ message: "Deleted", data: data[0] });
        } else {
          res.status(200).json({ message: "Nothing deleted", data: data[0] });
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  })
);

//Middlewares
app.use(pageNotFoundHandler);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
