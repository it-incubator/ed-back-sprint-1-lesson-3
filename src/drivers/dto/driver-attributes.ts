import { VehicleFeature } from '../types/driver';

// Атрибуты водителя во входных запросах (JSON:API data.attributes).
// Поля плоские: машина приходит отдельными vehicle*-полями.
export type DriverAttributes = {
  name: string;
  phoneNumber: string;
  email: string;

  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleLicensePlate: string;
  vehicleDescription: string | null;
  vehicleFeatures: VehicleFeature[];
};
