import request from 'supertest';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { Express } from 'express';
import { createDriver } from '../drivers/create-driver';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { RIDES_PATH } from '../../../src/rides/constants/rides.paths';
import { getRideDto } from './get-ride-dto';
import { ResourceType } from '../../../src/core/types/resource-type';
import { RideAttributes } from '../../../src/rides/dto/ride-attributes';
import { RideCreateInput } from '../../../src/rides/dto/ride.input';
import { RideOutput } from '../../../src/rides/dto/ride.output';

export async function createRide(
  app: Express,
  rideAttributes?: Partial<RideAttributes>,
): Promise<RideOutput> {
  const driver = await createDriver(app);

  // id водителя лежит в JSON:API-ресурсе (data.id).
  const defaultRideData = getRideDto(driver.data.id);

  const testRideData: RideCreateInput = {
    data: {
      type: ResourceType.Rides,
      attributes: { ...defaultRideData, ...rideAttributes },
    },
  };

  const createdRideResponse = await request(app)
    .post(RIDES_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testRideData)
    .expect(HttpStatus.Created);

  return createdRideResponse.body;
}
