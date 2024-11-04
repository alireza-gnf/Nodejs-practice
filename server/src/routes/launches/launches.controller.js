const { getAllLaunches, addLaunch } = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddLaunch(req, res, next) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.launchDate ||
    !launch.target ||
    !launch.rocket
  ) {
    return next(new Error("Missing required launch data"));
  }

  const launchDate = new Date(launch.launchDate);
  if (isNaN(launchDate) || new Date() >= launchDate) {
    return next(new Error("Invalid launch date"));
  }

  const newLaunch = addLaunch({
    ...launch,
    launchDate,
  });
  return res.status(201).json(newLaunch);
}

module.exports = {
  httpGetAllLaunches,
  httpAddLaunch,
};
