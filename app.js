const express = require("express");
const MintDb = require("./MintDb/index.js");

const app = express();
const cors = require("cors");
const db = new MintDb();

app.options("*", cors({
  origin: "*"
}));

/* MintDB Users CRUD */
app.get("/users", (req, res) => {
  res.json(db.select("users", req.query));
});

app.post("/users/new", (req, res) => {
  const user_id = db.insert("users", req.query);
  res.json({ id: user_id });
});

app.delete("/users/delete", (req, res) => {
  db.delete("users", req.query);
  res.json({ res: true });
});

app.patch("/users/update", (req, res) => {
  db.update("users", req.query, { name: "tom" });
  res.json({ res: true });
});

/* Root Routes */

app.get("/", (req, res) => {
  res.json({ res: "Hi" });
});

app.listen(5100);
