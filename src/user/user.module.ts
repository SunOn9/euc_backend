import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserReflect } from './provider/user.proto';
import { UserRepository } from './provider/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, UserReflect, UserRepository],
  exports: [UserService, UserReflect, UserRepository],
})
export class UserModule {}
