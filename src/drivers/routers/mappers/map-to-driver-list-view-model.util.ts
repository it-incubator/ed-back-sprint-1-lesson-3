import { WithId } from 'mongodb';
import { Driver } from '../../types/driver';
import { DriverListOutput } from '../../dto/driver.output';
import { mapDriverToResource } from './map-to-driver-view-model.util';

// Ответ со списком водителей (JSON:API list). Каждый элемент маппится тем же
// mapDriverToResource, что и одиночный ресурс — без дублирования логики.
export function mapToDriverListViewModel(
  drivers: WithId<Driver>[],
): DriverListOutput {
  return {
    meta: {},
    data: drivers.map(mapDriverToResource),
  };
}
