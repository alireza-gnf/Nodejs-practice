const {
  getAllLaunches,
  scheduleNewLaunch,
  getLaunchByFlightNumber,
  abortLaunch,
} = require("../../models/launches.model");

const { getPaginationValues } = require("../../utils/pagination");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPaginationValues(req.query);

  return res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddLaunch(req, res, next) {
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

  try {
    const newLaunch = await scheduleNewLaunch({ ...launch, launchDate });
    return res.status(201).json(newLaunch);
  } catch (e) {
    return next(e);
  }
}

async function httpAbortLaunch(req, res, next) {
  const flightNumber = Number(req.params.id);
  if (isNaN(flightNumber)) {
    return next(new Error("Invalid flight number", { cause: 400 }));
  }

  const launch = await getLaunchByFlightNumber(flightNumber);
  if (!launch || !launch.upcoming) {
    return next(
      new Error("No upcoming matching launch was found", { cause: 404 })
    );
  }

  const isAborted = await abortLaunch(launch);
  return res.status(200).json({ ok: isAborted });
}

module.exports = {
  httpGetAllLaunches,
  httpAddLaunch,
  httpAbortLaunch,
};
