import { body } from 'express-validator';
import { Currency } from '../types/ride';
import { ResourceType } from '../../core/types/resource-type';
import { resourceTypeValidation } from '../../core/middlewares/validation/resource-type.validation.middleware';

// В JSON:API атрибуты приходят внутри data.attributes, поэтому валидируем вложенные пути.
const clientNameValidation = body('data.attributes.clientName')
  .isString()
  .withMessage('clientName should be string')
  .trim()
  .isLength({ min: 3, max: 100 })
  .withMessage('Length of clientName is not correct');

const driverIdValidation = body('data.attributes.driverId')
  .isString()
  .withMessage('driverId must be a string')
  .trim()
  .isMongoId()
  .withMessage('driverId must be a valid ObjectId');

const priceValidation = body('data.attributes.price')
  .isFloat({ gt: 0 }) // цена должна быть числом больше 0
  .withMessage('price must be a positive number');

const currencyValidation = body('data.attributes.currency')
  .isString()
  .withMessage('currency should be string')
  .trim()
  .isIn(Object.values(Currency)) // только допустимые значения enum Currency
  .withMessage('currency must be either "usd" or "eur"');

const fromAddressValidation = body('data.attributes.fromAddress')
  .isString()
  .withMessage('fromAddress should be string')
  .trim()
  .isLength({ min: 10, max: 200 })
  .withMessage('Length of fromAddress is not correct');

const toAddressValidation = body('data.attributes.toAddress')
  .isString()
  .withMessage('toAddress should be string')
  .trim()
  .isLength({ min: 10, max: 200 })
  .withMessage('Length of toAddress is not correct');

// Набор middleware-валидаторов тела запроса на создание поездки (проверяем тип ресурса + атрибуты).
export const rideCreateInputValidation = [
  resourceTypeValidation(ResourceType.Rides),
  clientNameValidation,
  driverIdValidation,
  priceValidation,
  currencyValidation,
  fromAddressValidation,
  toAddressValidation,
];
