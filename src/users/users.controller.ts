import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post('create-or-update')
  createOrUpdate(@Body() dto: CreateUserDto) {
    return this.usersService.createOrUpdateUser(dto);
  }

  @Get('getAll')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll() {
    return this.usersService.findAll();
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.usersService.login(dto);
  }

  @Post('other-device-login')
  async forceLogin(@Body() dto: LoginDto) {
    return this.usersService.forceLogin(dto);
  }


  @Get('getOne/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('delete/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
