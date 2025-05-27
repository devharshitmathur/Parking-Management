import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Contractor_Status } from 'src/contractors/entities/contractor.entity';

export class CreateAttendantDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  contractor_id: string;

  status?: Contractor_Status.ACTIVE | Contractor_Status.INACTIVE;
}

export class AttendantLoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  device_fingerprint?: string;
}
