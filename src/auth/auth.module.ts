import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './entities/auth.entity';
import { AuthReflect } from './provider/auth.proto';
import { AuthRepository } from './provider/auth.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AuthEntity])],
  controllers: [AuthController],
  providers: [AuthService, AuthReflect, AuthRepository],
  exports: [AuthService, AuthReflect, AuthRepository],
})
export class AuthModule {}
