import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum VehicleType {
  TwoWheeler = '2W',
  ThreeWheeler = '3W',
  FourWheeler = '4W',
  CommercialVehicle = 'CV',
  HeavyVehicle = 'HV',
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, nullable: true })
  number_plate?: string;

   @Column({ type: 'enum', enum: VehicleType, default: VehicleType.TwoWheeler })
  vehicle_type: VehicleType;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'char', length: 36, nullable: true })
  contractor_id?: string;

  @Column({ type: 'char', length: 36, nullable: true })
  created_by?: string;

  @Column({ type: 'char', length: 36, nullable: true })
  updated_by?: string;

  @Column({ type: 'char', length: 36, nullable: true })
  deleted_by?: string;

  @CreateDateColumn({ nullable: true })
  created_on?: Date;

  @UpdateDateColumn({ nullable: true })
  updated_on?: Date;

  @Column({ type: 'datetime', nullable: true })
  deleted_on?: Date;

  @Column({ type: 'tinyint', default: 0 })
  is_deleted: boolean;
}
