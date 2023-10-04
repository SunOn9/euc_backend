import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserEntity } from './entities/user.entity'
import { UserReflect } from './provider/user.proto'
import { UserRepository } from './provider/user.repository'
import { PermissionModule } from '/permission/permission.module'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), PermissionModule],
  controllers: [UserController],
  providers: [UserService, UserReflect, UserRepository],
  exports: [UserService, UserReflect, UserRepository],
})
export class UserModule {}
