import { Module } from '@nestjs/common';
import { MemberInClubService } from './member-in-club.service';
import { MemberInClubController } from './member-in-club.controller';

@Module({
  controllers: [MemberInClubController],
  providers: [MemberInClubService],
})
export class MemberInClubModule {}
