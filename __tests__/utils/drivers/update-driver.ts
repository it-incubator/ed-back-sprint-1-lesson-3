import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { getDriverDto } from './get-driver-dto';
import { DRIVERS_PATH } from '../../../src/drivers/constants/drivers.paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { ResourceType } from '../../../src/core/types/resource-type';
import { DriverAttributes } from '../../../src/drivers/dto/driver-attributes';
import { DriverUpdateInput } from '../../../src/drivers/dto/driver.input';

export async function updateDriver(
  app: Express,
  driverId: string,
  driverAttributes?: Partial<DriverAttributes>,
): Promise<void> {
  // В обновлении JSON:API требует data.id, который должен совпадать с id в URL.
  const testDriverData: DriverUpdateInput = {
    data: {
      type: ResourceType.Drivers,
      id: driverId,
      attributes: { ...getDriverDto(), ...driverAttributes },
    },
  };

  await request(app)
    .put(`${DRIVERS_PATH}/${driverId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.NoContent);
}
