const mongoose = require("mongoose");

const MONGO_URL = "mongodb://127.0.0.1:27017/nasa";

mongoose.connection.once("connected", () => console.log("Mongoose connected"));
mongoose.connection.on("error", (err) => console.error(err));
mongoose.connection.once("disconnected", () =>
  console.log("Mongoose disconnected")
);

async function startMongoConnection() {
  await mongoose.connect(MONGO_URL);
}

async function closeMongoConnection() {
  await mongoose.connection.close();
}

module.exports = {
  startMongoConnection,
  closeMongoConnection,
};
