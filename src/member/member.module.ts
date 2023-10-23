import { MemberService } from './member.service'
import { MemberController } from './member.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemberEntity } from './entities/member.entity'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { PermissionModule } from '/permission/permission.module'
import { MemberRepository } from './provider/member.repository'
import { MemberReflect } from './provider/member.proto'
import { MemberInClubEntity } from './entities/member-in-club.entity'
import { ClubModule } from '/club/club.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberEntity, MemberInClubEntity]),
    PermissionModule,
    ClubModule,
  ],
  controllers: [MemberController],
  providers: [MemberService, MemberRepository, MemberReflect],
  exports: [MemberService, MemberRepository, MemberReflect],
})
export class MemberModule {}
