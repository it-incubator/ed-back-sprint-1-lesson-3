import { Router } from 'express';
import { getDriverListHandler } from './handlers/get-driver-list.handler';
import { getDriverHandler } from './handlers/get-driver.handler';
import { createDriverHandler } from './handlers/create-driver.handler';
import { updateDriverHandler } from './handlers/update-driver.handler';
import { deleteDriverHandler } from './handlers/delete-driver.handler';
import { idValidation } from '../../core/middlewares/validation/params-id.validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { ROUTE_PATHS } from '../../core/constants/paths.constants';
import { driverInputDtoValidation } from '../validation/driver.input-dto.validation-middlewares';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard.middleware';

export const driversRouter = Router({});

// Все эндпоинты водителей доступны только супер-админу (Basic Auth).
driversRouter.use(superAdminGuardMiddleware);

// Каждая цепочка: валидация -> проверка её результата -> handler.
// Пути маршрутов берём из констант ROUTE_PATHS, а не из строковых литералов.
driversRouter
  .get(ROUTE_PATHS.ROOT, getDriverListHandler)

  .get(
    ROUTE_PATHS.BY_ID,
    idValidation,
    inputValidationResultMiddleware,
    getDriverHandler,
  )

  .post(
    ROUTE_PATHS.ROOT,
    driverInputDtoValidation,
    inputValidationResultMiddleware,
    createDriverHandler,
  )

  .put(
    ROUTE_PATHS.BY_ID,
    idValidation,
    driverInputDtoValidation,
    inputValidationResultMiddleware,
    updateDriverHandler,
  )

  .delete(
    ROUTE_PATHS.BY_ID,
    idValidation,
    inputValidationResultMiddleware,
    deleteDriverHandler,
  );
