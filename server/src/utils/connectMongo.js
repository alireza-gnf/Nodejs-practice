const mongoose = require("mongoose");

mongoose.connection.once("connected", () => console.log("Mongoose connected"));
mongoose.connection.on("error", (err) => console.error(err));
mongoose.connection.once("disconnected", () =>
  console.log("Mongoose disconnected")
);

async function startMongoConnection() {
  await mongoose.connect(process.env.MONGO_URL);
}

async function closeMongoConnection() {
  await mongoose.connection.close();
}

module.exports = {
  startMongoConnection,
  closeMongoConnection,
};
