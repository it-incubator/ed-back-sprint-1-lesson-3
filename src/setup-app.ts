import express, { Express } from 'express';
import { testingRouter } from './testing/routes/testing.route';
import { ridesRoute } from './rides/routes/rides.route';
import { DRIVERS_PATH, RIDES_PATH, TESTING_PATH } from './core/paths/paths';
import { driversRouter } from './drivers/routers/drivers.router';

export const setupApp = async (app: Express) => {
  app.use(express.json());

  app.use(DRIVERS_PATH, driversRouter);
  app.use(RIDES_PATH, ridesRoute);
  app.use(TESTING_PATH, testingRouter);

  return app;
};
