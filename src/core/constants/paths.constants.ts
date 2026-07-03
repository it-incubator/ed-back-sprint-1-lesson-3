// Базовые пути модулей (задаются при подключении роутеров в setup-app).
export const TESTING_PATH = '/api/testing';
export const DRIVERS_PATH = '/api/drivers';
export const RIDES_PATH = '/api/rides';

// Относительные под-пути внутри роутеров — чтобы нигде не хардкодить строки маршрутов.
export const ROUTE_PATHS = {
  ROOT: '',
  BY_ID: '/:id',
  RIDE_FINISH: '/:id/actions/finish',
  TESTING_ALL_DATA: '/all-data',
} as const;
