const axios = require("axios");

const Launch = require("./launches.mongo");
const Planet = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 99;
const SPACEX_LAUNCHES_URL = "https://api.spacexdata.com/v4/launches/query";
const SPACEX_LATEST_LAUNCH_URL =
  "https://api.spacexdata.com/v4/launches/latest";

async function loadLaunches() {
  console.log("Downloading launches collection...");
  const response = await axios.post(SPACEX_LAUNCHES_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    throw new Error(
      `Downloading launches failed with status ${response.status}`,
      500
    );
  }
  await Launch.deleteMany();
  await Launch.bulkSave(
    response.data.docs
      .map((doc) => {
        return new Launch({
          flightNumber: doc["flight_number"],
          mission: doc["name"],
          launchDate: doc["date_local"],
          rocket: doc["rocket"]["name"],
          customers: doc["payloads"].flatMap((payload) => payload["customers"]),
          upcoming: doc["upcoming"],
          success: doc["success"],
        });
      })
      .filter((doc) => doc.success !== null)
  );
}

function getLaunchByFlightNumber(flightNumber) {
  return Launch.findOne({ flightNumber });
}

async function getAllLaunches(skip, limit) {
  return await Launch.find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function getLatestFlightNumber() {
  const latestFlight = await Launch.findOne().sort("-flightNumber");

  return latestFlight ? latestFlight.flightNumber : DEFAULT_FLIGHT_NUMBER;
}

async function saveLaunch(launch) {
  await Launch.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, {
    upsert: true,
  });

  return launch;
}

async function scheduleNewLaunch(launch) {
  const planet = await Planet.findOne({ keplerName: launch.target });

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
  const abortedLaunch = await Launch.updateOne(
    { flightNumber: launch.flightNumber },
    {
      upcoming: false,
      success: false,
    }
  );

  return abortedLaunch.modifiedCount === 1;
}

module.exports = {
  loadLaunches,
  getLaunchByFlightNumber,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunch,
};
