import { Currency } from '../types/ride';

// Атрибуты поездки во входном запросе на создание (JSON:API data.attributes).
export type RideAttributes = {
  clientName: string;
  price: number;
  currency: Currency;
  driverId: string;
  fromAddress: string;
  toAddress: string;
};
