import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Contractor_Status, UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  @IsString()
  user_name: string;

  @ApiProperty()
  @IsString()
  contractor_name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  phone_number: string;

  status?: Contractor_Status.ACTIVE | Contractor_Status.INACTIVE;

  @ApiProperty({ enum: UserRole, default: UserRole.CONTRACTOR })
  role: UserRole;

  @ApiProperty()
  is_first_login: boolean;

  @ApiProperty()
  device_fingerprint?: string;

  @ApiProperty()
  subscription_plan_id?: string;

  created_by?: string;

  updated_by?: string;

  deleted_by?: string;
}

export class LoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password?: string;

  // @ApiProperty()
  // device_fingerprint?: string;
}
