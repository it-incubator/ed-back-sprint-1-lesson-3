import { WithId } from 'mongodb';
import { Driver } from '../../types/driver';
import { DriverOutput } from '../../dto/driver.output';
import { JsonApiResource } from '../../../core/types/json-api';
import { ResourceType } from '../../../core/types/resource-type';

// Превращает документ водителя из БД в JSON:API-ресурс: _id -> строковый id,
// остальные поля (Driver) уходят в attributes. Используется и для одного водителя, и для списка.
export function mapDriverToResource(
  driver: WithId<Driver>,
): JsonApiResource<ResourceType.Drivers, Driver> {
  return {
    type: ResourceType.Drivers,
    id: driver._id.toString(),
    attributes: {
      name: driver.name,
      phoneNumber: driver.phoneNumber,
      email: driver.email,
      vehicle: driver.vehicle,
      createdAt: driver.createdAt,
    },
  };
}

// Ответ с одним водителем (JSON:API single resource).
export function mapToDriverViewModel(driver: WithId<Driver>): DriverOutput {
  return { data: mapDriverToResource(driver) };
}
