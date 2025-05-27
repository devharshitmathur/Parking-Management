import { Module } from '@nestjs/common';
import { AttendantsService } from './attendants.service';
import { AttendantsController } from './attendants.controller';
import { Attendant } from './entities/attendant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
      TypeOrmModule.forFeature([Attendant]),
      PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.register({
        secret: 'monoparking', // Replace with your own secret key
        signOptions: { expiresIn: '1d' }, // Set your desired expiration time
      }),
    ],
  controllers: [AttendantsController],
  providers: [AttendantsService],
   exports: [AttendantsModule],
})
export class AttendantsModule {}
