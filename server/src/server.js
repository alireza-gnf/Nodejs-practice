const http = require("http");

const app = require("./app");
const { connectMongo } = require("./utils/connectMongo");
const { loadPlanets } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(port) {
  await connectMongo();
  await loadPlanets();

  server.listen(PORT, () => console.log(`Listening on port ${port}...`));
}

startServer(PORT);
