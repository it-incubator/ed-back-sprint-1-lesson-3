import { Request, Response } from 'express';
import { DriverCreateInput } from '../../dto/driver.input';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';
import { Driver } from '../../types/driver';
import { mapToDriverViewModel } from '../mappers/map-to-driver-view-model.util';
import { mapDriverAttributesToDriver } from '../mappers/map-driver-attributes-to-driver.util';

export async function createDriverHandler(
  req: Request<{}, {}, DriverCreateInput>,
  res: Response,
) {
  try {
    // Проекция входных атрибутов -> доменная модель; дату создания добавляем здесь.
    const newDriver: Driver = {
      ...mapDriverAttributesToDriver(req.body.data.attributes),
      createdAt: new Date(),
    };

    const createdDriver = await driversRepository.create(newDriver);
    const driverViewModel = mapToDriverViewModel(createdDriver);
    res.status(HttpStatus.Created).send(driverViewModel);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
