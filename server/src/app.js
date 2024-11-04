const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const planetsRouter = require("./routes/planets/planets.router");
const { launchesRouter } = require("./routes/launches/launches.router");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(
  morgan("combined", {
    stream: fs.createWriteStream(
      path.join(__dirname, "..", "log", "access.log"),
      { flags: "a" }
    ),
  })
);

app.use("/planets", planetsRouter);
app.use("/launches", launchesRouter);
app.use("/*", (req, res) => {
  return res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message });
});

module.exports = app;
