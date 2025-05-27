import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { ContractorsModule } from './contractors/contractors.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { JwtModule } from '@nestjs/jwt';
import { AttendantsModule } from './attendants/attendants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env variables available everywhere
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3306', 10), // ✅ convert to number
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // synchronize: true, // disable in prod
    }),
    JwtModule.register({
      secret: 'monoparking', // Replace with your own secret key
    }),
    UsersModule,
    ContractorsModule,
    VehiclesModule,
    AttendantsModule, // your module with User entity
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    if (this.dataSource.isInitialized) {
      console.log('✅ Database connected successfully!');
    } else {
      console.error('❌ Failed to connect to the database.');
    }
  }
}
