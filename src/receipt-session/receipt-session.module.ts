import { ReceiptSessionService } from './receipt-session.service'
import { ReceiptSessionController } from './receipt-session.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { PermissionModule } from '/permission/permission.module'
import { ReceiptModule } from '/receipt/receipt.module'
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module'
import { ReceiptSessionEntity } from './entities/receipt-session.entity'
import { ReceiptSessionReflect } from './provider/receipt-session.proto'
import { ReceiptSessionRepository } from './provider/receipt-session.repository'

@Module({
  imports: [TypeOrmModule.forFeature([ReceiptSessionEntity]),
    PermissionModule,
    ReceiptModule,],
  controllers: [ReceiptSessionController],
  providers: [ReceiptSessionService, ReceiptSessionReflect, ReceiptSessionRepository],
  exports: [ReceiptSessionService, ReceiptSessionReflect, ReceiptSessionRepository],
})
export class ReceiptSessionModule { }
