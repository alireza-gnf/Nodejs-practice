const http = require("http");

require("dotenv").config();
const app = require("./app");
const { startMongoConnection } = require("./utils/connectMongo");
const { loadPlanets } = require("./models/planets.model");
const { loadLaunches } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(port) {
  await startMongoConnection();
  await loadPlanets();
  await loadLaunches();

  server.listen(PORT, () => console.log(`Listening on port ${port}...`));
}

startServer(PORT);
