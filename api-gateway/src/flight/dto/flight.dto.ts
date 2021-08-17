import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FlightDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly piloto: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly airplane: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly destinationCity: string;
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly flightDate: Date;
}
