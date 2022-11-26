const express = require("express");
const MintDb = require("./MintDb/index.js");

const app = express();
const cors = require("cors");
const db = new MintDb();

app.options("*", cors());

/* MintDB Users CRUD */
app.get("/users", (req, res) => {
  res.json(db.select("users", req.query));
});

app.get("/users/new", (req, res) => {
  db.insert("users", req.query);
  res.json({ res: true });
});

app.get("/users/delete", (req, res) => {
  db.delete("users", req.query);
  res.json({ res: true });
});

app.get("/users/update", (req, res) => {
  db.update("users", req.query, { name: "tom" });
  res.json({ res: true });
});

/* Root Routes */

app.get("/", (req, res) => {
  res.json({ res: "Hi" });
});

app.listen(5100);
