const launches = new Map();

let _lastFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Some Mission",
  rocket: "Some Rocket",
  launchDate: new Date("December 22, 2024"),
  target: "Kepler",
  customers: ["Tapsi", "Snapp", "Digikala"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function existsLaunchById(id) {
  return launches.has(id);
}

function isUpcomingLaunchById(id) {
  const launch = launches.get(id);
  return launch.upcoming;
}

function getAllLaunches() {
  return Array.from(launches.values());
}

function addLaunch(launch) {
  _lastFlightNumber++;
  launches.set(
    _lastFlightNumber,
    Object.assign(launch, {
      flightNumber: _lastFlightNumber,
      upcoming: true,
      success: true,
      customers: ["Tapsi", "Snapp", "DigiKala"],
    })
  );
  return launches.get(_lastFlightNumber);
}

function abortLaunchById(id) {
  const launch = launches.get(id);
  launch.upcoming = false;
  launch.success = false;

  return launch;
}

module.exports = {
  existsLaunchById,
  isUpcomingLaunchById,
  getAllLaunches,
  addLaunch,
  abortLaunchById,
};
