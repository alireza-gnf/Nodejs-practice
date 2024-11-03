const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const planetsRouter = require("./routes/planets/planets.router");
const { launchesRouter } = require("./routes/launches/launches.router");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// app.use((req, res, next) => {
//   const start = Date.now();
//   next();
//   console.log(
//     `${req.method} ${req.baseUrl}${req.url} - ${Date.now() - start}ms`
//   );
// });

app.use(morgan("combined"));

app.use(express.static("public"));

app.use(express.json());

app.use("/planets", planetsRouter);
app.use("/launches", launchesRouter);

module.exports = app;
