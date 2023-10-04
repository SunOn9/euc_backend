import { ClubFeeService } from './club-fee.service'
import { ClubFeeController } from './club-fee.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { PermissionModule } from '/permission/permission.module'
import { ClubFeeEntity } from './entities/club-fee.entity'
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module'
import { ClubFeeReflect } from './provider/club-fee.proto'
import { ClubFeeRepository } from './provider/club-fee.repository'

@Module({
  imports: [TypeOrmModule.forFeature([ClubFeeEntity]), PermissionModule],
  controllers: [ClubFeeController],
  providers: [ClubFeeService, ClubFeeReflect, ClubFeeRepository],
  exports: [ClubFeeService, ClubFeeReflect, ClubFeeRepository],
})
export class ClubFeeModule {}
