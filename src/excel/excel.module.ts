import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { ExcelService } from './excel.service'
import { MemberModule } from '/member/member.module'
import { ExcelController } from './excel.controller'
import { PermissionModule } from '/permission/permission.module'

@Module({
  imports: [MemberModule, PermissionModule],
  controllers: [ExcelController],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}
