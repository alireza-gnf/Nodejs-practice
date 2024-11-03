const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: "Some Mission",
  rocket: "Some Rocket",
  launchDate: new Date("December 22, 2024"),
  destination: "Kepler",
  customers: ["Tapsi", "Snapp", "Digikala"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

module.exports = {
  launches,
};
