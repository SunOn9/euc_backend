import { ClubFeeService } from './clubFee.service'
import { ClubFeeController } from './clubFee.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { PermissionModule } from '/permission/permission.module'
import { ClubFeeEntity } from './entities/clubFee.entity'
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module'
import { ClubFeeReflect } from './provider/clubFee.proto'
import { ClubFeeRepository } from './provider/clubFee.repository'

@Module({
  imports: [TypeOrmModule.forFeature([ClubFeeEntity]), PermissionModule],
  controllers: [ClubFeeController],
  providers: [ClubFeeService, ClubFeeReflect, ClubFeeRepository],
  exports: [ClubFeeService, ClubFeeReflect, ClubFeeRepository],
})
export class ClubFeeModule {}
