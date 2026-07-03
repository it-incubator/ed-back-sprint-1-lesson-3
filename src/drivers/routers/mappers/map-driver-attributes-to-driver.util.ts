import { DriverAttributes } from '../../dto/driver-attributes';
import { Driver } from '../../types/driver';

// Проекция входных атрибутов на доменную модель водителя.
// Возвращаем поля без служебного createdAt: при создании его добавит handler,
// а при обновлении дату создания трогать не нужно.
// Благодаря этому мапперу плоские атрибуты не «протекают» в репозиторий/БД —
// туда попадает уже готовый доменный объект (с вложенным vehicle).
export function mapDriverAttributesToDriver(
  attributes: DriverAttributes,
): Omit<Driver, 'createdAt'> {
  return {
    name: attributes.name,
    phoneNumber: attributes.phoneNumber,
    email: attributes.email,
    vehicle: {
      make: attributes.vehicleMake,
      model: attributes.vehicleModel,
      year: attributes.vehicleYear,
      licensePlate: attributes.vehicleLicensePlate,
      description: attributes.vehicleDescription,
      features: attributes.vehicleFeatures,
    },
  };
}
