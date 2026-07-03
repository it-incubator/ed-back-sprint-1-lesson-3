import {
  JsonApiListResponse,
  JsonApiSingleResponse,
} from '../../core/types/json-api';
import { ResourceType } from '../../core/types/resource-type';
import { Ride } from '../types/ride';

// Атрибуты поездки в ответе = доменные поля Ride без служебных дат createdAt/updatedAt
// (наружу их не отдаём). id выносится в обёртку ресурса.
export type RideResourceAttributes = Omit<Ride, 'createdAt' | 'updatedAt'>;

export type RideOutput = JsonApiSingleResponse<
  ResourceType.Rides,
  RideResourceAttributes
>;

export type RideListOutput = JsonApiListResponse<
  ResourceType.Rides,
  RideResourceAttributes
>;
