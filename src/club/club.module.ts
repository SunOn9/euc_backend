import { ClubService } from './club.service'
import { ClubController } from './club.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { ClubEntity } from './entities/club.entity'
import { PermissionModule } from '/permission/permission.module'
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module'
import { ClubReflect } from './provider/club.proto'
import { ClubRepository } from './provider/club.repository'
import { AreaModule } from '/area/area.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([ClubEntity]),
    PermissionModule,
    AreaModule,
  ],
  controllers: [ClubController],
  providers: [ClubService, ClubReflect, ClubRepository],
  exports: [ClubService, ClubReflect, ClubRepository],
})
export class ClubModule {}
