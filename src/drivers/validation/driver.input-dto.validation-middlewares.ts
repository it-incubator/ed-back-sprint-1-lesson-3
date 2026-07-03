import { body } from 'express-validator';
import { VehicleFeature } from '../types/driver';
import { ResourceType } from '../../core/types/resource-type';
import { resourceTypeValidation } from '../../core/middlewares/validation/resource-type.validation.middleware';
import { dataIdMatchValidation } from '../../core/middlewares/validation/params-id.validation.middleware';

// В JSON:API атрибуты приходят внутри data.attributes, поэтому валидируем вложенные пути.
const nameValidation = body('data.attributes.name')
  .isString()
  .withMessage('name should be string')
  .trim()
  .isLength({ min: 2, max: 15 })
  .withMessage('Length of name is not correct');

const phoneNumberValidation = body('data.attributes.phoneNumber')
  .isString()
  .withMessage('phoneNumber should be string')
  .trim()
  .isLength({ min: 8, max: 15 })
  .withMessage('Length of phoneNumber is not correct');

const emailValidation = body('data.attributes.email')
  .isString()
  .withMessage('email should be string')
  .trim()
  .isLength({ min: 5, max: 100 })
  .withMessage('Length of email is not correct')
  .isEmail();

const vehicleMakeValidation = body('data.attributes.vehicleMake')
  .isString()
  .withMessage('vehicleMake should be string')
  .trim()
  .isLength({ min: 3, max: 100 })
  .withMessage('Length of vehicleMake is not correct');

const vehicleModelValidation = body('data.attributes.vehicleModel')
  .isString()
  .withMessage('vehicleModel should be string')
  .trim()
  .isLength({ min: 2, max: 100 })
  .withMessage('Length of vehicleModel is not correct');

// Получаем текущий год
const currentYear = new Date().getFullYear();
const vehicleYearValidation = body('data.attributes.vehicleYear')
  .isInt({ min: 1980, max: currentYear })
  .withMessage('vehicleYear should be real year');

const vehicleLicensePlateValidation = body(
  'data.attributes.vehicleLicensePlate',
)
  .isString()
  .withMessage('vehicleLicensePlate should be string')
  .trim()
  .isLength({ min: 6, max: 10 })
  .withMessage('Length of vehicleLicensePlate is not correct');

const vehicleDescriptionValidation = body('data.attributes.vehicleDescription')
  .optional({ nullable: true }) // Позволяет значению быть null
  .isString()
  .withMessage('vehicleDescription should be string')
  .trim()
  .isLength({ min: 10, max: 200 })
  .withMessage('Length of vehicleDescription is not correct');

const vehicleFeaturesValidation = body('data.attributes.vehicleFeatures')
  .isArray()
  .withMessage('vehicleFeatures should be array')
  .optional() // Позволяет массиву быть пустым
  .custom((vehicleFeatures: Array<VehicleFeature>) => {
    if (vehicleFeatures.length) {
      const validFeatures = Object.values(VehicleFeature);

      vehicleFeatures.forEach((feature) => {
        if (!validFeatures.includes(feature)) {
          throw new Error(
            'vehicleFeatures should contain values of VehicleFeature',
          );
        }
      });
    }
    return true;
  });

const attributesValidation = [
  nameValidation,
  phoneNumberValidation,
  emailValidation,
  vehicleMakeValidation,
  vehicleModelValidation,
  vehicleYearValidation,
  vehicleLicensePlateValidation,
  vehicleDescriptionValidation,
  vehicleFeaturesValidation,
];

// Создание: проверяем тип ресурса + атрибуты.
export const driverCreateInputValidation = [
  resourceTypeValidation(ResourceType.Drivers),
  ...attributesValidation,
];

// Обновление: дополнительно проверяем, что data.id совпадает с id в URL.
export const driverUpdateInputValidation = [
  resourceTypeValidation(ResourceType.Drivers),
  dataIdMatchValidation,
  ...attributesValidation,
];
