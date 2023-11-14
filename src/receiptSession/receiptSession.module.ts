import { ReceiptSessionService } from './receiptSession.service'
import { ReceiptSessionController } from './receiptSession.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { PermissionModule } from '/permission/permission.module'
import { ReceiptModule } from '/receipt/receipt.module'
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module'
import { ReceiptSessionEntity } from './entities/receiptSession.entity'
import { ReceiptSessionReflect } from './provider/receiptSession.proto'
import { ReceiptSessionRepository } from './provider/receiptSession.repository'
import { ClubModule } from '/club/club.module'
import { forwardRef } from '@nestjs/common/utils/forward-ref.util'

@Module({
  imports: [
    TypeOrmModule.forFeature([ReceiptSessionEntity]),
    PermissionModule,
    forwardRef(() => ReceiptModule),
    ClubModule,
  ],
  controllers: [ReceiptSessionController],
  providers: [
    ReceiptSessionService,
    ReceiptSessionReflect,
    ReceiptSessionRepository,
  ],
  exports: [
    ReceiptSessionService,
    ReceiptSessionReflect,
    ReceiptSessionRepository,
  ],
})
export class ReceiptSessionModule {}
