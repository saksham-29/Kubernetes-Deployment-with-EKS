const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ service: "demo-app", status: "running" });
});

app.get("/health", (req, res) => res.send("OK"));

app.listen(3000, () => console.log("App running on port 3000"));
