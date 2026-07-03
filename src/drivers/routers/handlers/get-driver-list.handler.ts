import { Request, Response } from 'express';
import { driversRepository } from '../../repositories/drivers.repository';
import { mapToDriverListViewModel } from '../mappers/map-to-driver-list-view-model.util';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function getDriverListHandler(req: Request, res: Response) {
  try {
    const drivers = await driversRepository.findAll();
    // Наружу отдаём JSON:API-список ({ meta, data: [...] }), а не «сырые» документы из БД.
    const driverViewModels = mapToDriverListViewModel(drivers);
    res.send(driverViewModels);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
