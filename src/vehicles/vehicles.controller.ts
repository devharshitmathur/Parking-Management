import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, QrScanDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
// import * as fs from 'fs';
import * as FormData from 'form-data';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
const fs = require('fs');
const path = require('path');


@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
       @InjectRepository(Vehicle)
        private readonly vehiclesRepository: Repository<Vehicle>,
        private readonly httpService: HttpService
  ) {}

  // @Post('create-or-update')
  // createOrUpdate(@Body() createVehicleDto: CreateVehicleDto) {
  //   return this.vehiclesService.createOrUpdate(createVehicleDto);
  // }

//   @Post('checkin-with-image')
// @UseInterceptors(FileInterceptor('image'))
// async checkInWithImage(
// @UploadedFile() file: any,
//   @Body() body: { parkingLocationId: string; contractor_id: string; vehicle_type: '2W' | '4W' },
// ) {
//   // 1. Save Image (local or S3)
//   const filename = `${Date.now()}-${file.originalname}`;
//   // const filepath = `./uploads/${filename}`;
//   const filepath = path.join(process.cwd(), 'uploads', filename);
//   console.log("filepath----",filepath);
  
//   try{

  
//   const formData = new FormData();
// formData.append('upload', fs.createReadStream(filepath)); // 👈 This is correct key

// const headers = formData.getHeaders();
// headers['Authorization'] = 'Token e3fff7794f03b9d53f1a7c0bf42f2ea740e6f6bd'; // ✅ Use your actual key

// const response = await lastValueFrom(
//   this.httpService.post(
//     'https://api.platerecognizer.com/v1/plate-reader/',
//     formData,
//     { headers }
//   )
// );

//   console.log('ANPR Response:', response.data);
//   var plateNumber = response.data.results[0]?.plate || null;

//   if (!plateNumber) {
//     throw new BadRequestException('Could not recognize plate number.');
//   }

//   // Proceed with the rest of your logic
// } catch (error) {
//   console.error('ANPR API Error:', error);
//   throw new Error(`ANPR API Error: ${error.response?.data?.message || error.message}`);
// }


//   // 3. Insert record in MySQL
//   const vehicle = await this.vehiclesRepository.save({
//     parkingLocationId: body.parkingLocationId,
//     contractorId: body.contractor_id,
//     vehicleNumber: plateNumber,
//     vehicleType: body.vehicle_type,
//     imageUrl: `/uploads/${filename}`,
//     isCheckedOut: false,
//     checkInTime: new Date(),
//     receiptId: `RCPT-${Date.now()}`
//   });

//   return {
//     success: true,
//     vehicleId: vehicle.id,
//     vehicleNumber: plateNumber,
//     receiptId: vehicle.receiptId,
//   };
// }

@Post('checkin-with-image')
@UseInterceptors(FileInterceptor('image'))
async checkInWithImage(
  @UploadedFile() file: any,
  @Body() body: { parkingLocationId: string; contractor_id: string; vehicle_type: '2W' | '4W' },
) {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = `${Date.now()}-${file.originalname}`;
  const filepath = path.join(uploadsDir, filename);

  try {
    // Save image to disk
    await fs.promises.writeFile(filepath, file.buffer);

    // Prepare FormData for ANPR API
    const formData = new FormData();
    formData.append('upload', fs.createReadStream(filepath));

    const headers = formData.getHeaders();
    headers['Authorization'] = 'Token e3fff7794f03b9d53f1a7c0bf42f2ea740e6f6bd'; // Replace with secure storage in prod

    // Send to ANPR API
    const response = await lastValueFrom(
      this.httpService.post(
        'https://api.platerecognizer.com/v1/plate-reader/',
        formData,
        { headers }
      )
    );

    console.log('ANPR Response:', response.data);
    const plateNumber = response.data.results[0]?.plate || null;

    if (!plateNumber) {
      throw new BadRequestException('Could not recognize plate number.');
    }

    // Save vehicle record in DB
    const vehicle = await this.vehiclesRepository.save({
      parkingLocationId: body.parkingLocationId,
      contractor_id: body.contractor_id,
      vehicleNumber: plateNumber,
      vehicleType: body.vehicle_type,
      imageUrl: `/uploads/${filename}`,
      isCheckedOut: false,
      checkInTime: new Date(),
      receiptId: `RCPT-${Date.now()}`,
    });

    return {
      success: true,
      vehicleId: vehicle.id,
      vehicleNumber: plateNumber,
      receiptId: vehicle.receiptId,
    };
  } catch (error) {
    console.error('ANPR API Error:', error?.response?.data || error.message);
    throw new BadRequestException(
      `ANPR API Error: ${error?.response?.data?.detail || error.message}`,
    );
  }
}

  // vehicle.controller.ts
// @Post('scan')
// scanQr(@Body() data: QrScanDto) {
//   return this.vehiclesService.processQrScan(data);
// }


  @Get('getAll')
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get('getOne/:id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }


  @Post('delete/:id')
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
