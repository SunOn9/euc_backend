import { MemberInClubService } from './member-in-club.service'
import { MemberInClubController } from './member-in-club.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'

@Module({
  controllers: [MemberInClubController],
  providers: [MemberInClubService],
})
export class MemberInClubModule {}
