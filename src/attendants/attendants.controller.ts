import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AttendantsService } from './attendants.service';
import { AttendantLoginDto, CreateAttendantDto } from './dto/create-attendant.dto';
import { UpdateAttendantDto } from './dto/update-attendant.dto';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('attendants')
export class AttendantsController {
  constructor(private readonly attendantsService: AttendantsService) {}


  @Post('create-or-update')
    createOrUpdate(@Body() dto: CreateAttendantDto) {
      return this.attendantsService.createOrUpdateUser(dto);
    }
    
  
    @Get('getAll')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    findAll() {
      return this.attendantsService.findAll();
    }
  
    @Post('login')
    async login(@Body() dto: AttendantLoginDto) {
      return this.attendantsService.login(dto);
    }
  
    @Post('other-device-login')
    async forceLogin(@Body() dto: AttendantLoginDto) {
      return this.attendantsService.forceLogin(dto);
    }
  
  
    @Get('getOne/:id')
    findOne(@Param('id') id: string) {
      return this.attendantsService.findOne(id);
    }
  
    @Post('delete/:id')
    remove(@Param('id') id: string) {
      return this.attendantsService.remove(id);
    }

}
