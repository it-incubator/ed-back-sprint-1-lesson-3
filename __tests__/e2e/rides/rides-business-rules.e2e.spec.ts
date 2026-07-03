import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { DRIVERS_PATH } from '../../../src/drivers/constants/drivers.paths';
import { RIDES_PATH } from '../../../src/rides/constants/rides.paths';
import { clearDb } from '../../utils/clear-db';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { createDriver } from '../../utils/drivers/create-driver';
import { getRideDto } from '../../utils/rides/get-ride-dto';
import { ResourceType } from '../../../src/core/types/resource-type';
import { RideCreateInput } from '../../../src/rides/dto/ride.input';
import { SETTINGS } from '../../../src/settings/config';

// Проверяем бизнес-правило: у водителя не может быть двух активных поездок одновременно,
// а занятого (с активной поездкой) водителя нельзя удалить.
describe('Rides API business rules', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  // Собирает JSON:API-тело запроса на создание поездки для указанного водителя.
  const rideRequestFor = (driverId: string): RideCreateInput => ({
    data: {
      type: ResourceType.Rides,
      attributes: getRideDto(driverId),
    },
  });

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('❌ should not create a second ride for a busy driver; DELETE busy driver is also forbidden', async () => {
    // 1. Создаём водителя и первую (активную) поездку для него.
    const driver = await createDriver(app);
    const driverId = driver.data.id;

    const firstRideResponse = await request(app)
      .post(RIDES_PATH)
      .set('Authorization', adminToken)
      .send(rideRequestFor(driverId))
      .expect(HttpStatus.Created);

    const rideId = firstRideResponse.body.data.id;

    // 2. Вторую поездку тому же водителю создать нельзя — он уже занят.
    await request(app)
      .post(RIDES_PATH)
      .set('Authorization', adminToken)
      .send(rideRequestFor(driverId))
      .expect(HttpStatus.BadRequest);

    // 3. Занятого водителя удалить нельзя.
    await request(app)
      .delete(`${DRIVERS_PATH}/${driverId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest);

    // 4. Завершаем поездку — водитель снова свободен.
    await request(app)
      .post(`${RIDES_PATH}/${rideId}/actions/finish`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    // 5. Теперь новая поездка снова доступна.
    await request(app)
      .post(RIDES_PATH)
      .set('Authorization', adminToken)
      .send(rideRequestFor(driverId))
      .expect(HttpStatus.Created);
  });
});
