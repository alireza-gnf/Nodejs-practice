const path = require("path");
const express = require("express");
const cors = require("cors");

const planetsRouter = require("./routes/planets/planets.router");

const app = express();

app.use((req, res, next) => {
  const start = Date.now();
  next();
  console.log(
    `${req.method} ${req.baseUrl}${req.url} - ${Date.now() - start}ms`
  );
});

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.static(path.join("public")));

app.use(express.json());

app.use("/planets", planetsRouter);

module.exports = app;
