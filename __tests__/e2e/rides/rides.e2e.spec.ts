import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { RIDES_PATH } from '../../../src/rides/constants/rides.paths';
import { clearDb } from '../../utils/clear-db';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { createRide } from '../../utils/rides/create-ride';
import { getRideById } from '../../utils/rides/get-ride-by-id';
import { SETTINGS } from '../../../src/settings/config';

describe('Rides API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('✅ should create ride; POST /api/rides', async () => {
    await createRide(app);
  });

  it('✅ should return rides list; GET /api/rides', async () => {
    await createRide(app);

    const rideListResponse = await request(app)
      .get(RIDES_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    // В JSON:API список ресурсов лежит в поле data.
    expect(rideListResponse.body.data).toBeInstanceOf(Array);
    expect(rideListResponse.body.data).toHaveLength(2);
  });

  it('✅ should return ride by id; GET /api/rides/:id', async () => {
    const createdRide = await createRide(app);

    const getRide = await getRideById(app, createdRide.data.id);

    expect(getRide).toEqual(createdRide);
  });

  it('✅ should finish ride; POST /api/rides/:id/actions/finish', async () => {
    const createdRide = await createRide(app);

    await request(app)
      .post(`${RIDES_PATH}/${createdRide.data.id}/actions/finish`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    const getRide = await getRideById(app, createdRide.data.id);

    // После завершения меняется только finishedAt, остальные атрибуты те же.
    expect(getRide.data.attributes).toEqual({
      ...createdRide.data.attributes,
      finishedAt: expect.any(String),
    });
  });
});
