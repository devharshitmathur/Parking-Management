import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
   imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'monoparking', // Replace with your own secret key
      signOptions: { expiresIn: '1d' }, // Set your desired expiration time
    }),
  ],
  controllers: [UsersController],
  providers: [UserService, JwtStrategy],
  exports: [UsersModule],
})
export class UsersModule {}
