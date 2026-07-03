import { DriverInputDto } from '../../dto/driver.input.dto';
import { Driver } from '../../types/driver';

// Проекция входного DTO на доменную модель водителя.
// Возвращаем поля без служебного createdAt: при создании его добавит handler,
// а при обновлении дату создания трогать не нужно.
// Благодаря этому мапперу плоский DTO не «протекает» в репозиторий/БД —
// туда попадает уже готовый доменный объект.
export function mapDriverInputDtoToDriver(
  dto: DriverInputDto,
): Omit<Driver, 'createdAt'> {
  return {
    name: dto.name,
    phoneNumber: dto.phoneNumber,
    email: dto.email,
    vehicle: {
      make: dto.vehicleMake,
      model: dto.vehicleModel,
      year: dto.vehicleYear,
      licensePlate: dto.vehicleLicensePlate,
      description: dto.vehicleDescription,
      features: dto.vehicleFeatures,
    },
  };
}
