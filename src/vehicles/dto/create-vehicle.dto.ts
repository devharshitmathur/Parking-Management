import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { VehicleType } from '../entities/vehicle.entity';

export class CreateVehicleDto {
@ApiProperty({description: 'Vehicle ID',example: 'uuid-string' })
  id?: string;

    @ApiProperty({ required: false, description: 'Vehicle Number Plate',example: 'KA 01 AB 1234' })
  @IsOptional()
  @IsString()
  number_plate?: string;

  @ApiProperty({ description: 'Vehicle Type',default: VehicleType.TwoWheeler })
    @IsEnum(VehicleType)
  vehicle_type: VehicleType;

  @ApiProperty({ required: false, description: 'Phone Number',example: '9874561235' })
  @IsOptional()
  @IsString()
  phone?: string;


  @IsOptional()
  @IsUUID()
  contractor_id?: string;

  created_on?: string;
  updated_on?: string;
}

// qr-scan.dto.ts
export class QrScanDto {
  number_plate: string;
  vehicle_type: string;
  phone: string;
  created_on: string;
}

