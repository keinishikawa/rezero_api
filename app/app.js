const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const path = require("path");
const bodyParser = require("body-parser");

const dbPath = "app/db/database.sqlite3";

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/v1/users", (req, res) => {
  const db = new sqlite3.Database(dbPath);

  db.all("select * from users", (err, rows) => {
    res.json(rows);
  });
  db.close();
});

app.get("/api/v1/search", (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const keyword = req.query.q;

  db.all(`select * from users where name LIKE "%${keyword}%"`, (err, rows) => {
    res.json(rows);
  });
  db.close();
});

app.get("/api/v1/users/:id", (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const id = req.params.id;

  db.get(`select * from users where id = ${id}`, (err, row) => {
    res.json(row);
  });
  db.close();
});

app.post("/api/v1/users", async(req, res) => {
  const db = new sqlite3.Database(dbPath);

  const name = req.body.name;
  const profile = req.body.profile ? req.body.profile : "";
  const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : "";

  const run = async sql => {
    return new Promise((resolve, reject) => {
      db.run(sql, err => {
        if (err) {
          res.status(500).send(err);
          return reject();
        } else {
          res.json({ message: "新規ユーザを作成しました" });
          return resolve();
        }
      });
    });
  };
  await run(`insert into users (name,profile,date_of_birth)values("${name}","${profile}","${date_of_birth})`;

});

const port = process.env.PORT || 3000;
app.listen(port);

console.log(`Listen on port ${port}`);
