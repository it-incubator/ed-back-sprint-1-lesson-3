import express, { Express } from 'express';
import { testingRouter } from './testing/routes/testing.route';
import { ridesRouter } from './rides/routers/rides.router';
import {
  DRIVERS_PATH,
  RIDES_PATH,
  TESTING_PATH,
} from './core/constants/paths.constants';
import { driversRouter } from './drivers/routers/drivers.router';

export const setupApp = (app: Express) => {
  app.use(express.json());

  // Каждый модуль подключается по своему базовому пути.
  app.use(DRIVERS_PATH, driversRouter);
  app.use(RIDES_PATH, ridesRouter);
  app.use(TESTING_PATH, testingRouter);
};
