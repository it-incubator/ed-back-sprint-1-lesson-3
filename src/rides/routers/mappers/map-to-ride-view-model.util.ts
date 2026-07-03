import { WithId } from 'mongodb';
import { Ride } from '../../types/ride';
import { RideOutput, RideResourceAttributes } from '../../dto/ride.output';
import { JsonApiResource } from '../../../core/types/json-api';
import { ResourceType } from '../../../core/types/resource-type';

// Превращает документ поездки из БД в JSON:API-ресурс: _id -> строковый id.
// Служебные даты createdAt/updatedAt наружу не отдаём (отбрасываем при деструктуризации).
// Используется и для одной поездки, и для списка.
export function mapRideToResource(
  ride: WithId<Ride>,
): JsonApiResource<ResourceType.Rides, RideResourceAttributes> {
  return {
    type: ResourceType.Rides,
    id: ride._id.toString(),
    attributes: {
      clientName: ride.clientName,
      driver: ride.driver,
      vehicle: ride.vehicle,
      price: ride.price,
      currency: ride.currency,
      startedAt: ride.startedAt,
      finishedAt: ride.finishedAt,
      addresses: ride.addresses,
    },
  };
}

// Ответ с одной поездкой (JSON:API single resource).
export function mapToRideViewModel(ride: WithId<Ride>): RideOutput {
  return { data: mapRideToResource(ride) };
}
