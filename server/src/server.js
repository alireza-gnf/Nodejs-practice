const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

const { loadPlanets } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;
const MONGO_URL = "mongodb://127.0.0.1:27017/nasa";

const server = http.createServer(app);
mongoose.connection.once("connected", () => console.log("Mongoose connected"));
mongoose.connection.on("error", (err) => console.error(err));
mongoose.connection.once("disconnected", () =>
  console.log("Mongoose disconnected")
);
async function startServer(port) {
  await mongoose.connect(MONGO_URL);
  await loadPlanets();

  server.listen(PORT, () => console.log(`Listening on port ${port}...`));
}

startServer(PORT);
