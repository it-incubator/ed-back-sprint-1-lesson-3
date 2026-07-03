import { Request, Response } from 'express';
import { ridesRepository } from '../../repositories/rides.repository';
import { mapToRideListViewModel } from '../mappers/map-to-ride-list-view-model.util';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function getRideListHandler(req: Request, res: Response) {
  try {
    const rides = await ridesRepository.findAll();

    // Наружу отдаём JSON:API-список ({ meta, data: [...] }), а не «сырые» документы из БД.
    const rideViewModels = mapToRideListViewModel(rides);
    res.send(rideViewModels);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
