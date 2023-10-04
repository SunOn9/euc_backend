import { PlaceService } from './place.service'
import { PlaceController } from './place.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'

@Module({
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {}
