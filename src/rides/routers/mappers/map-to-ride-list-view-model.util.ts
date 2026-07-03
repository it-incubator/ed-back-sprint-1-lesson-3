import { WithId } from 'mongodb';
import { Ride } from '../../types/ride';
import { RideListOutput } from '../../dto/ride.output';
import { mapRideToResource } from './map-to-ride-view-model.util';

// Ответ со списком поездок (JSON:API list). Каждый элемент маппится тем же
// mapRideToResource, что и одиночный ресурс — без дублирования логики.
export function mapToRideListViewModel(rides: WithId<Ride>[]): RideListOutput {
  return {
    meta: {},
    data: rides.map(mapRideToResource),
  };
}
