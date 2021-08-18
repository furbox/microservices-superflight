import { IPassenger } from './passenger.interface';
import { IWeather } from './weather.interface';

export interface IFlight extends Document {
  _id?: string;
  piloto: string;
  airplane: string;
  destinationCity: string;
  flightDate: Date;
  passengers: IPassenger[];
  wheater: IWeather[];
}
