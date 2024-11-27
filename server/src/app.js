require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const authRouter = require("./routes/auth/auth.router");
const authenticate = require("./routes/auth/auth.middleware");
const planetsRouter = require("./routes/planets/planets.router");
const launchesRouter = require("./routes/launches/launches.router");

const app = express();
const store = new MongoDBStore(
  {
    uri: process.env.MONGO_URL,
    collection: "sessions",
  },
  (err) => console.log(err)
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(passport.authenticate("session"));
app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(
  morgan("combined", {
    stream: fs.createWriteStream(
      path.join(__dirname, "..", "log", "access.log"),
      { flags: "a" }
    ),
  })
);

app.use("/auth", authRouter);
app.use("/planets", authenticate, planetsRouter);
app.use("/launches", authenticate, launchesRouter);
app.use(authenticate, express.static(path.join(__dirname, "..", "public")));
app.use("/*", authenticate, (req, res) => {
  return res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.use((err, req, res, next) => {
  res.status(err.cause).json({ error: err.message });
});

module.exports = app;
