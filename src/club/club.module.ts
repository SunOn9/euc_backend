import { ClubService } from './club.service'
import { ClubController } from './club.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'

@Module({
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
