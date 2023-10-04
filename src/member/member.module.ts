import { MemberService } from './member.service'
import { MemberController } from './member.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemberEntity } from './entities/member.entity'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
