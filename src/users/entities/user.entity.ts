// src/user/user.entity.ts
import { Contractor } from 'src/contractors/entities/contractor.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';


export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  CONTRACTOR = 'contractor',
  ATTENDANT = 'attendant',
}

export enum Contractor_Status {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column()
  password?: string;

    @Column({ type: 'enum', enum: Contractor_Status, default: Contractor_Status.INACTIVE })
  status: Contractor_Status;

  @Column({ length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CONTRACTOR })
  role: UserRole;

  @Column({ default: true })
  isFirstLogin: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  device_fingerprint?: string;

  @Column({ type: 'char', length: 36, nullable: true })
  created_by: string;

  @Column({ type: 'char', length: 36, nullable: true })
  updated_by: string;

  @Column({ type: 'char', length: 36, nullable: true })
  deleted_by: string;

  @CreateDateColumn()
  created_on: Date;

  @UpdateDateColumn()
  updated_on: Date;

  @Column({ type: 'datetime', nullable: true })
  deleted_on: Date;

  @Column({ type: 'tinyint', default: 0 })
  is_deleted: boolean;

}
