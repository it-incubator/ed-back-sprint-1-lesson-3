import { WithId } from 'mongodb';
import { RideAttributes } from '../../dto/ride-attributes';
import { Ride } from '../../types/ride';
import { Driver } from '../../../drivers/types/driver';

// Проекция входных атрибутов (+ данные найденного водителя) на доменную модель поездки.
// Служебные даты жизненного цикла (createdAt/startedAt/…) не выставляем здесь —
// их добавит handler, чтобы маппер отвечал только за перенос данных.
// Благодаря этому в репозиторий уходит готовый доменный объект, а не «сырые» атрибуты.
export function mapRideAttributesToRide(
  attributes: RideAttributes,
  driver: WithId<Driver>,
): Omit<Ride, 'createdAt' | 'updatedAt' | 'startedAt' | 'finishedAt'> {
  return {
    clientName: attributes.clientName,
    driver: {
      id: driver._id.toString(),
      name: driver.name,
    },
    // Данные машины копируем из водителя, а не из запроса.
    vehicle: {
      licensePlate: driver.vehicle.licensePlate,
      name: `${driver.vehicle.make} ${driver.vehicle.model}`,
    },
    price: attributes.price,
    currency: attributes.currency,
    addresses: {
      from: attributes.fromAddress,
      to: attributes.toAddress,
    },
  };
}
