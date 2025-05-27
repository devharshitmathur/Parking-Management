import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, QrScanDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post('create-or-update')
  createOrUpdate(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.createOrUpdate(createVehicleDto);
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
