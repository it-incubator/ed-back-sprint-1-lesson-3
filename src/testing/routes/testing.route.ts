import { Router } from 'express';
import { truncateDbHandler } from './handlers/truncate-db.handler';
import { ROUTE_PATHS } from '../../core/constants/paths.constants';

export const testingRouter = Router({});

testingRouter.delete(ROUTE_PATHS.TESTING_ALL_DATA, truncateDbHandler);
