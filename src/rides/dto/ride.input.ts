import { JsonApiCreateRequest } from '../../core/types/json-api';
import { ResourceType } from '../../core/types/resource-type';
import { RideAttributes } from './ride-attributes';

// Тело запроса на создание поездки: { data: { type, attributes } }.
export type RideCreateInput = JsonApiCreateRequest<
  ResourceType.Rides,
  RideAttributes
>;
