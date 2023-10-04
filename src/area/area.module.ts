import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { AreaService } from './area.service'
import { AreaController } from './area.controller'
import { AreaEntity } from './entities/area.entity'
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module'
import { AreaRepository } from './provider/area.repository'
import { AreaReflect } from './provider/area.proto'
import { PermissionModule } from '/permission/permission.module'

@Module({
  imports: [TypeOrmModule.forFeature([AreaEntity]), PermissionModule],
  controllers: [AreaController],
  providers: [AreaService, AreaRepository, AreaReflect],
})
export class AreaModule {}
