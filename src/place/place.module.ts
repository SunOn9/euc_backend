import { PlaceService } from './place.service'
import { PlaceController } from './place.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { PlaceEntity } from './entities/place.entity'
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module'
import { PlaceReflect } from './provider/place.proto'
import { PlaceRepository } from './provider/place.repository'
import { PermissionModule } from '/permission/permission.module'

@Module({
  imports: [TypeOrmModule.forFeature([PlaceEntity]), PermissionModule],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceReflect, PlaceRepository],
  exports: [PlaceService, PlaceReflect, PlaceRepository],

})
export class PlaceModule { }
