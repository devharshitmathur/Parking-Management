import { Injectable } from '@nestjs/common';
import { AttendantLoginDto, CreateAttendantDto } from './dto/create-attendant.dto';
import { UpdateAttendantDto } from './dto/update-attendant.dto';
import { Attendant } from './entities/attendant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { WriteResponse } from 'src/shared/response';
import * as argon2 from 'argon2';

@Injectable()
export class AttendantsService {
   constructor(
     @InjectRepository(Attendant)
     private readonly attendantRepo: Repository<Attendant>,
     private readonly jwt: JwtService,
   ) {}
   async validateUserById(userId: any) {
     return this.attendantRepo.findOne({
       where: { id: userId },
     });
   }
   async createOrUpdateUser(dto: CreateAttendantDto) {
     // Check for duplicate email (for create or update to a new email)
     const existingUserWithEmail = await this.attendantRepo.findOne({
       where: { email: dto.email, is_deleted: false },
     });
 
     if (dto.id === null || dto.id === undefined) {
       delete dto.id;
       // CREATE operation
       if (existingUserWithEmail) {
         return WriteResponse(400, null, 'Email already exists');
       }
 
       if (!dto.password) {
         return WriteResponse(400, null, 'Password is required');
       }
       const hashedPassword = await argon2.hash(dto.password);
       const newUser = this.attendantRepo.create({
         ...dto,
         password: hashedPassword,
       });
       await this.attendantRepo.save(newUser);
 
       const { password, ...result } = newUser;
       return WriteResponse(200, result, 'User created successfully');
     } else {
       // UPDATE operation
       const user = await this.attendantRepo.findOne({ where: { id: dto.id } });
 
       if (!user) {
         return WriteResponse(404, null, 'User not found');
       }
 
       // Check if the new email is used by another user
       if (existingUserWithEmail && existingUserWithEmail.id !== dto.id) {
         return WriteResponse(400, null, 'Email already in use by another user');
       }
 
       // If password is provided, update it
       if (dto.password) {
         dto.password = await argon2.hash(dto.password);
       } else {
         delete dto.password; // prevent overwriting password with undefined
       }
 
       await this.attendantRepo.update(dto.id, dto);
       const updatedUser = await this.attendantRepo.findOne({
         where: { id: dto.id },
       });
       if (!updatedUser) {
         return WriteResponse(500, null, 'Something went wrong');
       }
 
       const { password, ...result } = updatedUser;
       return WriteResponse(200, result, 'User updated successfully');
     }
   }
 
   // async login(dto: LoginDto) {
   //   const user = await this.attendantRepo.findOne({ where: { email: dto.email } });
 
   //   if (!user || !user.password || !dto.password) {
   //     return WriteResponse(401, null, 'Invalid credentials');
   //   }
 
   //   const isValid = await argon2.verify(user.password, dto.password);
   //   if (!isValid) {
   //     return WriteResponse(401, null, 'Invalid credentials');
   //   }
 
   //   const payload = { sub: user.id, role: user.role };
   //   const access_token = this.jwt.sign(payload);
   //   const result = {
   //     access_token,
    
   //       id: user.id,
   //       name: user.name,
   //       email: user.email,
   //       phone_number: user.phone_number,
   //       role: user.role,
 
   //   };
 
   //   return WriteResponse(200, result, 'Login successful');
   // }
 
 async login(dto: AttendantLoginDto) {
   const user = await this.attendantRepo.findOne({ where: { email: dto.email } });
 
   if (!user || !user.password || !dto.password) {
     return WriteResponse(401, null, 'Invalid credentials');
   }
 
   const isValid = await argon2.verify(user.password, dto.password);
   if (!isValid) {
     return WriteResponse(401, null, 'Invalid credentials');
   }
 
   // ✅ Check if device is same or different
   if (user.device_fingerprint && user.device_fingerprint !== dto.device_fingerprint) {
     // Already logged in from another device
     return WriteResponse(409, null, 'You are already logged in from another device. Do you want to logout from the old device?');
   }
 
   // ✅ First login or same device: update fingerprint and login
   user.device_fingerprint = dto.device_fingerprint;
 await this.attendantRepo.update(user.id, { device_fingerprint: dto.device_fingerprint });
 
 
   const payload = { sub: user.id, role: user.role };
   const access_token = this.jwt.sign(payload);
 
   const result = {
     access_token,
     id: user.id,
     name: user.name,
     email: user.email,
     phone_number: user.phone_number,
     role: user.role,
   };
 
   return WriteResponse(200, result, 'Login successful');
 }
 
 
 async forceLogin(dto: AttendantLoginDto) {
   const user = await this.attendantRepo.findOne({ where: { email: dto.email,is_deleted: false } });
 
   if (!user || !user.password || !dto.password) {
     return WriteResponse(401, null, 'Invalid credentials');
   }
 
   const isValid = await argon2.verify(user.password, dto.password);
   if (!isValid) {
     return WriteResponse(401, null, 'Invalid credentials');
   }
 
   // ✅ Override fingerprint and login
   user.device_fingerprint = dto.device_fingerprint;
   await this.attendantRepo.update(user.id, { device_fingerprint: dto.device_fingerprint });
 
   const payload = { sub: user.id, role: user.role };
   const access_token = this.jwt.sign(payload);
 
   const result = {
     access_token,
     id: user.id,
     name: user.name,
     email: user.email,
     phone_number: user.phone_number,
     role: user.role,
   };
 
   return WriteResponse(200, result, 'Old device logged out. Login successful');
 }
 
 
   async findAll() {
     try {
       const users = await this.attendantRepo.find({ where: { is_deleted: false } });
       users.forEach((user) => delete user.password);
       if (users.length === 0) {
         return WriteResponse(404, null, 'Users not found');
       }
       return WriteResponse(200, users, 'Users found successfully');
     } catch (error) {
       console.error(error);
       return WriteResponse(500, null, 'Something went wrong');
     }
   }
 
   async findOne(id: string) {
     try {
       const user = await this.attendantRepo.findOne({
         where: { id, is_deleted: false },
       });
       if (!user) {
         return WriteResponse(404, null, 'User not found');
       }
       delete user.password;
       return WriteResponse(200, user, 'User found successfully');
     } catch (error) {
       console.error(error);
       return WriteResponse(500, null, 'Something went wrong');
     }
   }
 
   async remove(id: string) {
     try {
       const user = await this.attendantRepo.findOne({
         where: { id, is_deleted: false },
       });
       if (!user) {
         return WriteResponse(404, null, 'User not found');
       }
       await this.attendantRepo.update(id, { is_deleted: true });
       return WriteResponse(200, null, 'User deleted successfully');
     } catch (error) {
       console.error(error);
       return WriteResponse(500, null, 'Something went wrong');
     }
   }
}
