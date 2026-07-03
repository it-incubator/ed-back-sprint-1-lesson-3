import { body } from 'express-validator';
import { ResourceType } from '../../types/resource-type';

// Проверяет, что data.type в теле запроса равен ожидаемому типу ресурса.
export function resourceTypeValidation(resourceType: ResourceType) {
  return body('data.type')
    .isString()
    .equals(resourceType)
    .withMessage(`Resource type must be ${resourceType}`);
}
