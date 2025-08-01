import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './api/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/auth.module';
import { AuthMechanism, DataSource } from 'typeorm';
import { User } from '@entities/user.entity';

@Module({
  imports: [UsersModule, AuthModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'postgres',
    entities: [User],
    synchronize: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  //constructor(private dataSource: DataSource) 
}
