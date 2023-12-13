import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { ExcelService } from './excel.service'
import { MemberModule } from '/member/member.module'
import { ExcelController } from './excel.controller'
import { PermissionModule } from '/permission/permission.module'
import { ReceiptSessionModule } from '/receiptSession/receiptSession.module'
import { PaymentSessionModule } from '/paymentSession/paymentSession.module'

@Module({
  imports: [MemberModule, PermissionModule, PaymentSessionModule, ReceiptSessionModule],
  controllers: [ExcelController],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule { }
