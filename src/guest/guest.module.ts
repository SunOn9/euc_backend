import { GuestService } from './guest.service'
import { GuestController } from './guest.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GuestEntity } from './entities/guest.entity'
import { PermissionModule } from '/permission/permission.module'
import { GuestReflect } from './provider/guest.proto'
import { GuestRepository } from './provider/guest.repository'
import { ClubModule } from '/club/club.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([GuestEntity]),
    PermissionModule,
    ClubModule,
  ],
  controllers: [GuestController],
  providers: [GuestService, GuestReflect, GuestRepository],
  exports: [GuestService, GuestReflect, GuestRepository],
})
export class GuestModule {}
