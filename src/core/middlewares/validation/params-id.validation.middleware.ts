import { body, param } from 'express-validator';

export const idValidation = param('id')
  .exists()
  .withMessage('ID is required') // Проверка на наличие
  .isString()
  .withMessage('ID must be a string') // Проверка, что это строка
  .isMongoId()
  .withMessage('Incorrect format of ObjectId');

// Для JSON:API-обновления: id в теле (data.id) должен совпадать с id в URL.
export const dataIdMatchValidation = body('data.id')
  .exists()
  .withMessage('ID in body is required')
  .custom((value, { req }) => {
    if (value !== req.params?.id) {
      throw new Error('ID in URL and body must match');
    }
    return true;
  });
