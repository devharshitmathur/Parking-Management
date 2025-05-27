import { ApiProperty } from '@nestjs/swagger';
import { Contractor_Status } from '../entities/contractor.entity';

export class CreateContractorDto {
  @ApiProperty({ description: 'Linked User ID for the contractor', example: 'uuid-string' })
  user_id: string;

  @ApiProperty({ required: false, description: 'Company name of the contractor' })
  company_name?: string;

  @ApiProperty({ required: false, description: 'Contact number of the contractor' })
  contact_number?: string;

  @ApiProperty({ required: false, description: 'How many parking locations allowed?' })
  allowed_locations?: number;

  @ApiProperty({ required: false, description: 'Max attendants allowed per location' })
  allowed_attendants_per_location?: number;

  @ApiProperty({ required: false })
  created_by?: string;

  status?: Contractor_Status.ACTIVE | Contractor_Status.INACTIVE;

 
  updated_by?: string;

 
  deleted_by?: string;


  created_on?: Date;


  updated_on?: Date;


  deleted_on?: Date;


  is_deleted?: boolean;
}
