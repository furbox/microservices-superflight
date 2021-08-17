import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { PassengerDTO } from './dto/passenger.dto';
import { Observable } from 'rxjs';
import { IPassenger } from '../common/interfaces/passenger.interface';
import { PassengerMSG } from '../common/constants';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('passenger')
@Controller('api/v2/passenger')
export class PassengerController {
  constructor(private readonly clientproxy: ClientProxySuperFlights) {}
  private _clientProxyPassenger = this.clientproxy.clientProxyPassenger();

  @Post()
  @ApiOperation({ summary: 'Create a passenger' })
  create(@Body() passengerDTO: PassengerDTO): Observable<IPassenger> {
    return this._clientProxyPassenger.send(PassengerMSG.CREATE, passengerDTO);
  }
  @Get()
  @ApiOperation({ summary: 'Get all passengers' })
  findAll(): Observable<IPassenger[]> {
    return this._clientProxyPassenger.send(PassengerMSG.FIND_ALL, '');
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get passenger by id' })
  findOne(@Param('id') id: string): Observable<IPassenger> {
    return this._clientProxyPassenger.send(PassengerMSG.FIND_ONE, id);
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update passenger by id' })
  update(
    @Param('id') id: string,
    @Body() passengerDTO: PassengerDTO,
  ): Observable<IPassenger> {
    return this._clientProxyPassenger.send(PassengerMSG.UPDATE, {
      id,
      passengerDTO,
    });
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete passenger by id' })
  delete(@Param('id') id: string): Observable<IPassenger> {
    return this._clientProxyPassenger.send(PassengerMSG.DELETE, id);
  }
}
