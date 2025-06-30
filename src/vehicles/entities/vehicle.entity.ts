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

  @Column()
  parkingLocationId: string;

  @Column()
  contractor_id: string;

  @Column({ nullable: true })
  plateNumber: string;

  @Column()
  vehicle_type: '2W' | '4W';

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: false })
  isCheckedOut: boolean;

  @Column({ type: 'datetime' })
  checkInTime: Date;

  @Column({ type: 'datetime', nullable: true })
  checkOutTime: Date;

  @Column({ nullable: true, type: 'float' })
  totalHours: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  paymentAmount: number;

  @Column({ nullable: true })
  receiptId: string;

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
