import { HttpStatus, Injectable } from '@nestjs/common';
import { FlightDTO } from './dto/flight.dto';
import { IFlight } from '../common/interfaces/flight.interface';
import { InjectModel } from '@nestjs/mongoose';
import { FLIGHT } from '../common/models/models';
import { Model } from 'mongoose';
import axios from 'axios';
import * as moment from 'moment';
import { ILocation } from '../common/interfaces/location.interface';
import { IWeather } from '../common/interfaces/weather.interface';

@Injectable()
export class FlightService {
  constructor(
    @InjectModel(FLIGHT.name) private readonly model: Model<IFlight>,
  ) {}

  async create(flightDTO: FlightDTO): Promise<IFlight> {
    const newFlight = new this.model(flightDTO);
    return await newFlight.save();
  }
  async findAll(): Promise<IFlight[]> {
    return await this.model.find().populate('passengers');
  }
  async findOne(id: string): Promise<IFlight> {
    const flight = await this.model.findById(id).populate('passengers');
    const location: ILocation = await this.getLocation(flight.destinationCity);
    const weather: IWeather[] = await this.getWeather(
      location.woeid,
      flight.flightDate,
    );
    return this.assing(flight, weather);
  }
  assing(
    { _id, piloto, airplane, destinationCity, flightDate, passengers }: IFlight,
    weather: IWeather[],
  ): IFlight {
    return Object.assign({
      _id,
      piloto,
      airplane,
      destinationCity,
      flightDate,
      passengers,
      weather,
    });
  }
  async getWeather(woeid: number, flightDate: Date): Promise<IWeather[]> {
    const dateFormat = moment.utc(flightDate).format();
    const year = dateFormat.substring(0, 4);
    const month = dateFormat.substring(5, 7);
    const day = dateFormat.substring(8, 10);
    const { data } = await axios.get(
      `https://www.metaweather.com/api/location/${woeid}/${year}/${month}/${day}/`,
    );
    return data;
  }
  async getLocation(destinationCity: string): Promise<ILocation> {
    const { data } = await axios.get(
      `https://www.metaweather.com/api/location/search/?query=${destinationCity}`,
    );
    return data[0];
  }
  async update(id: string, flightDTO: FlightDTO): Promise<IFlight> {
    return await this.model.findByIdAndUpdate(id, flightDTO, { new: true });
  }
  async delete(id: string) {
    await this.model.findByIdAndDelete(id);
    return {
      status: HttpStatus.OK,
      msg: 'Delete',
    };
  }
  async addPassanger(flightId: string, passengerId: string): Promise<IFlight> {
    return await this.model
      .findByIdAndUpdate(
        flightId,
        {
          $addToSet: { passangers: passengerId },
        },
        { new: true },
      )
      .populate('passengers');
  }
}
