import { EventService } from './event.service'
import { EventController } from './event.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { EventReflect } from './provider/event.proto'
import { EventRepository } from './provider/event.repository'
import { EventEntity } from './entities/event.entity'
import { PermissionModule } from '/permission/permission.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity]), PermissionModule],
  controllers: [EventController],
  providers: [EventService, EventReflect, EventRepository],
})
export class EventModule {}
