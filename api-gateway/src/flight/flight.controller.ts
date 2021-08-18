import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { FlightDTO } from './dto/flight.dto';
import { IFlight } from '../common/interfaces/flight.interface';
import { FlightMSG, PassengerMSG } from '../common/constants';
import { Observable } from 'rxjs';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('flight')
@UseGuards(JwtAuthGuard)
@Controller('api/v2/flight')
export class FlightController {
  constructor(private readonly clientproxy: ClientProxySuperFlights) {}
  private _clientProxyFlight = this.clientproxy.clientProxyFlight();
  private _clientProxyPassenger = this.clientproxy.clientProxyPassenger();

  @Post()
  @ApiOperation({ summary: 'Create a flight' })
  create(@Body() flightDTO: FlightDTO): Observable<IFlight> {
    return this._clientProxyFlight.send(FlightMSG.CREATE, flightDTO);
  }
  @Get()
  @ApiOperation({ summary: 'Get all flights' })
  findAll(): Observable<IFlight[]> {
    return this._clientProxyFlight.send(FlightMSG.FIND_ALL, '');
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get flight by id' })
  findOne(@Param('id') id: string): Observable<IFlight> {
    return this._clientProxyFlight.send(FlightMSG.FIND_ONE, id);
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update flight by id' })
  update(
    @Param('id') id: string,
    @Body() flightDTO: FlightDTO,
  ): Observable<IFlight> {
    return this._clientProxyFlight.send(FlightMSG.UPDATE, {
      id,
      flightDTO,
    });
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete flight by id' })
  delete(@Param('id') id: string): Observable<IFlight> {
    return this._clientProxyFlight.send(FlightMSG.DELETE, id);
  }
  @Post(':flightId/:passenger/:passengerId')
  @ApiOperation({ summary: 'Add passengers a flight by id' })
  async addPassenger(
    @Param('flightId') flightId: string,
    @Param('passengerId') passengerId: string,
  ) {
    const passenger = await this._clientProxyPassenger.send(
      PassengerMSG.FIND_ONE,
      passengerId,
    );
    if (!passenger)
      throw new HttpException('Passenger not found', HttpStatus.NOT_FOUND);

    return this._clientProxyFlight.send(FlightMSG.ADD_PASSENGER, {
      flightId,
      passengerId,
    });
  }
}
