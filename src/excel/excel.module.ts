import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { ExcelService } from './excel.service'
import { MemberModule } from '/member/member.module'

@Module({
  imports: [MemberModule],
  controllers: [],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}
