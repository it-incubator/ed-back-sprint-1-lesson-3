import {
  JsonApiListResponse,
  JsonApiSingleResponse,
} from '../../core/types/json-api';
import { ResourceType } from '../../core/types/resource-type';
import { Driver } from '../types/driver';

// Атрибуты водителя в ответе = все доменные поля Driver
// (name, phoneNumber, email, вложенный vehicle, createdAt). id выносится в обёртку.
export type DriverOutput = JsonApiSingleResponse<ResourceType.Drivers, Driver>;

export type DriverListOutput = JsonApiListResponse<
  ResourceType.Drivers,
  Driver
>;
