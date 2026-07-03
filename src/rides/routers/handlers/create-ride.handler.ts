import { Request, Response } from 'express';
import { RideCreateInput } from '../../dto/ride.input';
import { driversRepository } from '../../../drivers/repositories/drivers.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { ridesRepository } from '../../repositories/rides.repository';
import { Ride } from '../../types/ride';
import { mapToRideViewModel } from '../mappers/map-to-ride-view-model.util';
import { mapRideAttributesToRide } from '../mappers/map-ride-attributes-to-ride.util';

export async function createRideHandler(
  req: Request<{}, {}, RideCreateInput>,
  res: Response,
) {
  try {
    const attributes = req.body.data.attributes;
    const driverId = attributes.driverId;

    // Поездку можно создать только для существующего водителя.
    const driver = await driversRepository.findById(driverId);

    if (!driver) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([
            { field: 'driverId', message: 'Driver not found' },
          ]),
        );

      return;
    }

    // Бизнес-правило: у водителя не может быть двух активных поездок сразу.
    const activeRide = await ridesRepository.findActiveRideByDriverId(driverId);

    if (activeRide) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([
            { field: 'driverId', message: 'The driver is currently on a job' },
          ]),
        );

      return;
    }

    // Проекция атрибутов + данные водителя -> доменная модель; служебные даты добавляем здесь.
    const newRide: Ride = {
      ...mapRideAttributesToRide(attributes, driver),
      createdAt: new Date(),
      updatedAt: null,
      startedAt: new Date(),
      finishedAt: null,
    };

    const createdRide = await ridesRepository.create(newRide);
    const rideViewModel = mapToRideViewModel(createdRide);

    res.status(HttpStatus.Created).send(rideViewModel);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
