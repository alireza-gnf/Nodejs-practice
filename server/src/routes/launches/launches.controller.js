const {
  getAllLaunches,
  addLaunch,
  existsLaunchById,
  abortLaunchById,
  isUpcomingLaunchById,
} = require("../../models/launches.model");

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
    return next(new Error("Missing required launch data", { cause: 400 }));
  }

  const launchDate = new Date(launch.launchDate);
  if (isNaN(launchDate) || new Date() >= launchDate) {
    return next(new Error("Invalid launch date", { cause: 400 }));
  }

  const newLaunch = addLaunch({
    ...launch,
    launchDate,
  });
  return res.status(201).json(newLaunch);
}

function httpAbortLaunch(req, res, next) {
  const launchId = Number(req.params.id);

  if (!existsLaunchById(launchId) || !isUpcomingLaunchById(launchId)) {
    return next(
      new Error("No upcoming launch with that ID was found", { cause: 404 })
    );
  }

  const abortedLaunch = abortLaunchById(launchId);
  return res.status(200).json(abortedLaunch);
}

module.exports = {
  httpGetAllLaunches,
  httpAddLaunch,
  httpAbortLaunch,
};
