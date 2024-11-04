const { getAllLaunches, addLaunch } = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddLaunch(req, res) {
  const launch = req.body;
  const newLaunch = addLaunch({
    ...launch,
    launchDate: new Date(launch.launchDate),
  });
  return res.status(201).json(newLaunch);
}

module.exports = {
  httpGetAllLaunches,
  httpAddLaunch,
};
