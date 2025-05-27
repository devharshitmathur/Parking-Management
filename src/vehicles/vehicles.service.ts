import { Injectable } from '@nestjs/common';
import { CreateVehicleDto, QrScanDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WriteResponse } from 'src/shared/response';
import * as QRCode from 'qrcode'; // import QR generator
import nodeHtmlToImage from 'node-html-to-image';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
  ) {}
//   async create(createVehicleDto: CreateVehicleDto) {
//     try {

//       const existingVehicle = await this.vehiclesRepository.findOne({
//         where: { number_plate: createVehicleDto.number_plate },
//       });
//       if (existingVehicle) {
//        return WriteResponse(400, false,'Vehicle already exists');
//       }
//       const vehicle = await this.vehiclesRepository.save({
//         ...createVehicleDto,
//       });
// // Generate QR code data
//     const qrData = {
//       number_plate: vehicle.number_plate,
//       vehicle_type: vehicle.vehicle_type,
//       phone: vehicle.phone,
//       created_on: vehicle.created_on, // ensure this is returned by repo
//     };

//     const qrString = JSON.stringify(qrData);

//     // Generate QR code as Data URL (image in base64)
//     const qrCode = await QRCode.toDataURL(qrString);

//     // Optionally, save this QR base64 string in DB or return with response
//     await this.processQrScan(createVehicleDto);

//     return WriteResponse(200, { ...vehicle, qrCode }, 'Vehicle created successfully');
//       // return WriteResponse(200, vehicle, 'Vehicle created successfully');
//     } catch (error) {
//       console.error(error);
//       return WriteResponse(500, false, 'Something went wrong');
//     }
//   }
async createOrUpdate(createVehicleDto: CreateVehicleDto) {
  try {
    const { id, number_plate } = createVehicleDto;

    // Check if number_plate already exists for another vehicle
    const existingByPlate = await this.vehiclesRepository.findOne({
      where: { number_plate },
    });

    if (createVehicleDto.id) {
      // Update flow
      const existingVehicle = await this.vehiclesRepository.findOne({ where: { id } });

      if (!existingVehicle) {
        return WriteResponse(404, false, 'Vehicle not found');
      }

      if (existingByPlate && existingByPlate.id !== id) {
        return WriteResponse(400, false, 'Number plate already exists for another vehicle');
      }

      const updatedVehicle = await this.vehiclesRepository.save({
        ...existingVehicle,
        ...createVehicleDto,
      });

      // Generate QR code
      const qrData = {
        number_plate: updatedVehicle.number_plate,
        vehicle_type: updatedVehicle.vehicle_type,
        phone: updatedVehicle.phone,
        created_on: updatedVehicle.created_on,
      };
      const qrString = JSON.stringify(qrData);
      const qrCode = await QRCode.toDataURL(qrString);
      await this.processQrScan(createVehicleDto);

      return WriteResponse(200, { ...updatedVehicle, qrCode }, 'Vehicle updated successfully');
    } else {
      delete createVehicleDto.id;
      // Create flow
      if (existingByPlate) {
        return WriteResponse(400, false, 'Vehicle already exists');
      }

      const vehicle = await this.vehiclesRepository.save({
        ...createVehicleDto,
      });

      // Generate QR code
      const qrData = {
        number_plate: vehicle.number_plate,
        vehicle_type: vehicle.vehicle_type,
        phone: vehicle.phone,
        created_on: vehicle.created_on,
      };
      const qrString = JSON.stringify(qrData);
      const qrCode = await QRCode.toDataURL(qrString);
      // await this.processQrScan(vehicle);

      return WriteResponse(200, { ...vehicle, qrCode }, 'Vehicle created successfully');
    }
  } catch (error) {
    console.error(error);
    return WriteResponse(500, false, 'Something went wrong');
  }
}



async processQrScan(data: CreateVehicleDto) {
    // const imagePath = path.join(__dirname, '..', 'qr-images', `${data.number_plate}.png`);
     const dirPath = path.join(process.cwd(), 'qr-images');
  const sanitizedPlate = data.number_plate!.replace(/\s+/g, '_');
  const imagePath = path.join(dirPath, `${sanitizedPlate}.png`);
 // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
    await nodeHtmlToImage({
      output: imagePath,
     html: `
  <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f8fa;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 400px;
          margin: auto;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          padding: 25px;
        }
        h2 {
          color: #2c3e50;
          text-align: center;
          margin-bottom: 20px;
          font-weight: 700;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e1e4e8;
          font-size: 16px;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #34495e;
        }
        .value {
          color: #7f8c8d;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Vehicle Information</h2>
        <div class="info-row">
          <div class="label">Number Plate:</div>
          <div class="value">${data.number_plate}</div>
        </div>
        <div class="info-row">
          <div class="label">Vehicle Type:</div>
          <div class="value">${data.vehicle_type}</div>
        </div>
        <div class="info-row">
          <div class="label">Phone:</div>
          <div class="value">${data.phone ?? 'N/A'}</div>
        </div>
        <div class="info-row">
          <div class="label">Created On:</div>
          <div class="value">${data.created_on ? new Date().toLocaleDateString() : 'N/A'}</div>
        </div>
      </div>
    </body>
  </html>
`,

    });

    return {
      message: 'QR data image saved',
      image: `/qr-images/${data.number_plate}.png`,
    };
  }


  async findAll() {
    try {
      const vehicles = await this.vehiclesRepository.find();
      if(!vehicles) {
        return WriteResponse(404, false, 'Vehicles not found');
      } 
      return WriteResponse(200, vehicles, 'Vehicles found successfully');
    } catch (error) {
      console.error(error);
      return WriteResponse(500, false, 'Something went wrong');
    }
  }

  async findOne(id: string) {
    try {
      const vehicle = await this.vehiclesRepository.findOne({ where: { id: id } });
      if (!vehicle) {
        return WriteResponse(404, false, 'Vehicle not found');
      }
      return WriteResponse(200, vehicle, 'Vehicle found successfully');
    } catch (error) {
      console.error(error);
      return WriteResponse(500, false, 'Something went wrong');
    }
  }


  async remove(id: string) {
    try {
      const vehicle = await this.vehiclesRepository.findOne({ where: { id: id } });
      if (!vehicle) {
        return WriteResponse(404, false, 'Vehicle not found');
      }
      await this.vehiclesRepository.update(id, { is_deleted: true });
      return WriteResponse(200, false, 'Vehicle deleted successfully');
    } catch (error) {
      console.error(error);
      return WriteResponse(500, false, 'Something went wrong');
    }
  }
}
