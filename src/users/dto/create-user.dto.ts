import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Contractor_Status } from '../entities/user.entity';

export class CreateUserDto {
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

status?: Contractor_Status.ACTIVE | Contractor_Status.INACTIVE;
  
}

export class LoginDto {
    @ApiProperty()
  email: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  device_fingerprint?: string;
}

