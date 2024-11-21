const fs = require("fs");
const https = require("https");

require("dotenv").config();
const app = require("./app");
const { startMongoConnection } = require("./utils/connectMongo");
const { loadPlanets } = require("./models/planets.model");
const { loadLaunches } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;

const server = https.createServer(
  {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
  },
  app
);

async function startServer(port) {
  await startMongoConnection();
  await loadPlanets();
  await loadLaunches();

  server.listen(PORT, () => console.log(`Listening on port ${port}...`));
}

startServer(PORT);
