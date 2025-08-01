import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './api/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/auth/auth.module';
import { AuthMechanism, DataSource } from 'typeorm';
import { User } from '@entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

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
  }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        return {
          secret,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  //constructor(private dataSource: DataSource) 
}
