const app = require("../../src/app");
const request = require("supertest");
const {
  startMongoConnection,
  closeMongoConnection,
} = require("../../src/utils/connectMongo");
const { loadPlanets } = require("../../src/models/planets.model");

describe("Launches API", () => {
  beforeAll(async () => {
    await startMongoConnection();
    await loadPlanets();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  describe("GET /launches", () => {
    test("It should respond with 200", async () => {
      await request(app)
        .get("/launches")
        .expect("Content-type", /json/)
        .expect(200);
    });
  });

  describe("POST /launches", () => {
    const payload = {
      mission: "Some mission",
      rocket: "Some IS",
      target: "Kepler-442 b",
      launchDate: new Date("January 1, 2030"),
    };
    const url = "/launches";
    test("It should respond with 201", async () => {
      const response = await request(app).post(url).send(payload).expect(201);
      expect({
        ...response.body,
        launchDate: new Date(response.body.launchDate),
      }).toMatchObject(payload);
    });

    test("It should respond with 404 [Invalid planet]", async () => {
      const response = await request(app)
        .post(url)
        .send({ ...payload, target: "WrongPlanet" })
        .expect(404);

      expect(response.body).toStrictEqual({
        error: "No such planet was found",
      });
    });

    test("It should have upcoming set to true", async () => {
      const response = await request(app).post(url).send(payload).expect(201);
      expect({
        ...response.body,
        launchDate: new Date(response.body.launchDate),
      }).toMatchObject(payload);
      expect(response.body.upcoming).toBe(true);
    });

    test("It should catch missing required data", async () => {
      const requiredFields = ["mission", "rocket", "target", "launchDate"];
      const errObj = {
        error: "Missing required launch data",
      };
      let response;
      let reqBody;
      for (const field of requiredFields) {
        reqBody = {};
        for (const key in payload) {
          if (key !== field) {
            reqBody[key] = payload[key];
          }
        }

        response = await request(app).post(url).send(reqBody).expect(400);
        expect(response.body).toStrictEqual(errObj);
      }
    });

    test("It should catch invalid datetime", async () => {
      const response = await request(app)
        .post(url)
        .send({
          ...payload,
          launchDate: "wrong",
        })
        .expect(400);

      expect(response.body).toStrictEqual({ error: "Invalid launch date" });
    });
  });

  describe("DELETE /launches/:id", () => {
    const url = (id) => `/launches/${id}`;
    test("It should set upcoming to false", async () => {
      const launch = await request(app)
        .post("/launches")
        .send({
          mission: "Some mission",
          rocket: "Some IS",
          target: "Kepler-442 b",
          launchDate: new Date("January 1, 2030"),
        })
        .expect(201);

      const response = await request(app)
        .delete(url(launch.body.flightNumber))
        .expect(200);

      expect(response.body.ok).toBe(true);
    });

    test("It should respond with 400 [Invalid flight number]", async () => {
      const response = await request(app).delete(url("WrongId")).expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid flight number",
      });
    });

    test("It should respond with 404", async () => {
      const response = await request(app).delete(url(0)).expect(404);

      expect(response.body).toStrictEqual({
        error: "No upcoming matching launch was found",
      });
    });
  });
});
