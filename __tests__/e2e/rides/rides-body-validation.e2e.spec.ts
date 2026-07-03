import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { clearDb } from '../../utils/clear-db';
import { RIDES_PATH } from '../../../src/rides/constants/rides.paths';
import { Currency } from '../../../src/rides/types/ride';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { ResourceType } from '../../../src/core/types/resource-type';
import { SETTINGS } from '../../../src/settings/config';

describe('Rides API body validation check', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  // Оборачивает атрибуты в JSON:API-конверт создания поездки.
  const createBody = (attributes: object) => ({
    data: { type: ResourceType.Rides, attributes },
  });

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  // Закрываем соединение с БД, чтобы процесс тестов корректно завершался.
  afterAll(async () => {
    await stopDb();
  });

  it(`❌ should not create ride when incorrect body passed; POST /api/rides'`, async () => {
    await request(app)
      .post(RIDES_PATH)
      .send({})
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post(RIDES_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send(
        createBody({
          clientName: '   ', // empty string
          price: 'bla bla', // not a number
          currency: 1, // not a string
          fromAddress: '', // empty string
          toAddress: true, // not a string
          driverId: 'bam', //not a valid ObjectId
        }),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(6);

    const invalidDataSet2 = await request(app)
      .post(RIDES_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send(
        createBody({
          clientName: 'LA', // short string
          price: 0, // can not be 0
          currency: 'byn', // not in Currency
          fromAddress: 'street', // short string
          driverId: 0, //can not be 0
          toAddress: 'test address',
        }),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(5);

    const invalidDataSet3 = await request(app)
      .post(RIDES_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send(
        createBody({
          driverId: 5000, //driver should be a valid ObjectId string
          clientName: 'Sam',
          price: 100,
          currency: Currency.USD,
          fromAddress: 'test address',
          toAddress: 'test address',
        }),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    // check что никто не создался
    const riderListResponse = await request(app)
      .get(RIDES_PATH)
      .set('Authorization', adminToken);

    expect(riderListResponse.body.data).toHaveLength(0);
  });
});
