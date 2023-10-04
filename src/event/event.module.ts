import { EventService } from './event.service'
import { EventController } from './event.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'

@Module({
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
