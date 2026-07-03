import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard.middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation.middleware';
import { ROUTE_PATHS } from '../../core/constants/paths.constants';
import { rideInputDtoValidation } from '../validation/ride.input-dto.validation-middlewares';
import { createRideHandler } from './handlers/create-ride.handler';
import { getRideListHandler } from './handlers/get-ride-list.handler';
import { getRideHandler } from './handlers/get-ride.handler';
import { finishRideHandler } from './handlers/finish-ride.handler';

export const ridesRouter = Router({});

// Все эндпоинты поездок доступны только супер-админу (Basic Auth).
ridesRouter.use(superAdminGuardMiddleware);

// Каждая цепочка: валидация -> проверка её результата -> handler.
// Пути маршрутов берём из констант ROUTE_PATHS, а не из строковых литералов.
ridesRouter
  .get(ROUTE_PATHS.ROOT, getRideListHandler)

  .get(
    ROUTE_PATHS.BY_ID,
    idValidation,
    inputValidationResultMiddleware,
    getRideHandler,
  )

  .post(
    ROUTE_PATHS.ROOT,
    rideInputDtoValidation,
    inputValidationResultMiddleware,
    createRideHandler,
  )

  .post(
    ROUTE_PATHS.RIDE_FINISH,
    idValidation,
    inputValidationResultMiddleware,
    finishRideHandler,
  );
