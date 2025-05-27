import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

export enum Contractor_Status {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}
@Entity('contractors')
export class Contractor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: true })
  company_name: string;

  @Column({ type: 'enum', enum: Contractor_Status, default: Contractor_Status.INACTIVE })
  status: Contractor_Status;

  @Column({ length: 20, nullable: true })
  contact_number: string;

  @Column({ type: 'int', nullable: true })
  allowed_locations: number;

  @Column({ type: 'int', nullable: true })
  allowed_attendants_per_location: number;

  @CreateDateColumn()
  created_on: Date;

  @UpdateDateColumn()
  updated_on: Date;

  @Column({ type: 'datetime', nullable: true })
  deleted_on: Date;

  @Column({ type: 'tinyint', default: 0 })
  is_deleted: boolean;

}