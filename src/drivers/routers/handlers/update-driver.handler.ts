import { Request, Response } from 'express';
import { DriverUpdateInput } from '../../dto/driver.input';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { mapDriverAttributesToDriver } from '../mappers/map-driver-attributes-to-driver.util';

export async function updateDriverHandler(
  req: Request<{ id: string }, {}, DriverUpdateInput>,
  res: Response,
) {
  try {
    const id = req.params.id;
    // Важно дождаться промис через await: без него driver — это Promise (всегда truthy),
    // и проверка "не найден" ниже никогда бы не сработала.
    const driver = await driversRepository.findById(id);

    if (!driver) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );
      return;
    }

    // В репозиторий передаём доменный объект (проекцию атрибутов), а не сам DTO.
    await driversRepository.update(
      id,
      mapDriverAttributesToDriver(req.body.data.attributes),
    );
    res.sendStatus(HttpStatus.NoContent);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
