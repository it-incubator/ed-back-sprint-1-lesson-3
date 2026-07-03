import request from 'supertest';
import express from 'express';
import { VehicleFeature } from '../../../src/drivers/types/driver';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DriverAttributes } from '../../../src/drivers/dto/driver-attributes';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { getDriverDto } from '../../utils/drivers/get-driver-dto';
import { clearDb } from '../../utils/clear-db';
import { createDriver } from '../../utils/drivers/create-driver';
import { DRIVERS_PATH } from '../../../src/drivers/constants/drivers.paths';
import { getDriverById } from '../../utils/drivers/get-driver-by-id';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { ResourceType } from '../../../src/core/types/resource-type';
import { SETTINGS } from '../../../src/settings/config';

describe('Driver API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctAttributes: DriverAttributes = getDriverDto();

  const adminToken = generateBasicAuthToken();

  // Оборачивает атрибуты в JSON:API-конверт создания.
  const createBody = (attributes: object) => ({
    data: { type: ResourceType.Drivers, attributes },
  });

  // Оборачивает атрибуты в JSON:API-конверт обновления (с data.id).
  const updateBody = (id: string, attributes: object) => ({
    data: { type: ResourceType.Drivers, id, attributes },
  });

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it(`❌ should not create driver when incorrect body passed; POST /api/drivers'`, async () => {
    await request(app)
      .post(DRIVERS_PATH)
      .send(createBody(correctAttributes))
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send(
        createBody({
          name: '   ', // empty string
          phoneNumber: '    ', // empty string
          email: 'invalid email', // incorrect email
          vehicleMake: '', // empty string
          vehicleModel: 'A6',
          vehicleYear: 2020,
          vehicleLicensePlate: 'XYZ-456',
          vehicleDescription: null,
          vehicleFeatures: [],
        }),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send(
        createBody({
          name: 'Feodor',
          phoneNumber: '', // empty string
          email: 'feodor@example.com',
          vehicleModel: '', // empty string
          vehicleLicensePlate: '', // empty string
          vehicleMake: '', // empty string
          vehicleYear: 2020,
          vehicleDescription: null,
          vehicleFeatures: [],
        }),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send(
        createBody({
          name: 'Feodor',
          email: 'feodor@example.com',
          phoneNumber: '', // empty string
          vehicleModel: '', // empty string
          vehicleLicensePlate: '', // empty string
          vehicleMake: '', // empty string
          vehicleYear: 2020,
          vehicleDescription: null,
          vehicleFeatures: [],
        }),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(4);

    // check что никто не создался
    const driverListResponse = await request(app)
      .get(DRIVERS_PATH)
      .set('Authorization', adminToken);
    expect(driverListResponse.body.data).toHaveLength(0);
  });

  it('❌ should not update driver when incorrect data passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app, correctAttributes);
    const createdDriverId = createdDriver.data.id;

    const invalidDataSet1 = await request(app)
      .put(`${DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', generateBasicAuthToken())
      .send(
        updateBody(createdDriverId, {
          name: '   ',
          phoneNumber: '    ',
          email: 'invalid email',
          vehicleMake: '',
          vehicleModel: 'A6',
          vehicleYear: 2020,
          vehicleLicensePlate: 'XYZ-456',
          vehicleDescription: null,
          vehicleFeatures: [],
        }),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`${DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', generateBasicAuthToken())
      .send(
        updateBody(createdDriverId, {
          name: 'Ted',
          email: 'ted@example.com',
          vehicleMake: 'Audi',
          vehicleYear: 2020,
          vehicleDescription: null,
          vehicleFeatures: [],
          phoneNumber: '', // empty string
          vehicleModel: '', // empty string
          vehicleLicensePlate: '', // empty string
        }),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(3);

    const invalidDataSet3 = await request(app)
      .put(`${DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', generateBasicAuthToken())
      .send(
        updateBody(createdDriverId, {
          name: 'A', //too short
          phoneNumber: '987-654-3210',
          email: 'feodor@example.com',
          vehicleMake: 'Audi',
          vehicleModel: 'A6',
          vehicleYear: 2020,
          vehicleLicensePlate: 'XYZ-456',
          vehicleDescription: null,
          vehicleFeatures: [],
        }),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    const driverResponse = await getDriverById(app, createdDriverId);
    expect(driverResponse).toEqual(createdDriver);
  });

  it('❌ should not update driver when incorrect features passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app, correctAttributes);
    const createdDriverId = createdDriver.data.id;

    await request(app)
      .put(`${DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', generateBasicAuthToken())
      .send(
        updateBody(createdDriverId, {
          name: 'Ted',
          phoneNumber: '987-654-3210',
          email: 'ted@example.com',
          vehicleMake: 'Audi',
          vehicleModel: 'A6',
          vehicleYear: 2020,
          vehicleLicensePlate: 'XYZ-456',
          vehicleDescription: null,
          vehicleFeatures: [
            VehicleFeature.ChildSeat,
            'invalid-feature' as VehicleFeature,
            VehicleFeature.WiFi,
          ],
        }),
      )
      .expect(HttpStatus.BadRequest);

    const driverResponse = await getDriverById(app, createdDriverId);
    expect(driverResponse).toEqual(createdDriver);
  });
});
