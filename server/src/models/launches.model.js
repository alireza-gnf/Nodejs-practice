const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 99;

function getLaunchByFlightNumber(flightNumber) {
  return launches.findOne({ flightNumber });
}

async function getAllLaunches() {
  return await launches.find({}, { _id: 0, __v: 0 });
}

async function getLatestFlightNumber() {
  const latestFlight = await launches.findOne().sort("-flightNumber");

  return latestFlight ? latestFlight.flightNumber : DEFAULT_FLIGHT_NUMBER;
}

async function saveLaunch(launch) {
  await launches.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true }
  );

  return launch;
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) throw new Error("No such planet was found");

  return await saveLaunch({
    ...launch,
    flightNumber: (await getLatestFlightNumber()) + 1,
    upcoming: true,
    success: true,
    customers: ["Tapsi", "Snapp", "DigiKala"],
  });
}

async function abortLaunch(launch) {
  const abortedLaunch = await launches.updateOne(
    { flightNumber: launch.flightNumber },
    {
      upcoming: false,
      success: false,
    }
  );

  return abortedLaunch.modifiedCount === 1;
}

module.exports = {
  getLaunchByFlightNumber,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunch,
};
