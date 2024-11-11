const { getAllPlanets } = require("../../models/planets.model");

async function httpGetAllPlanets(req, res, next) {
  try {
    return res.status(200).json(await getAllPlanets());
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  httpGetAllPlanets,
};
