import { ReceiptService } from './receipt.service'
import { ReceiptController } from './receipt.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReceiptEntity } from './entities/receipt.entity'
import { PermissionModule } from '/permission/permission.module'
import { ReceiptReflect } from './provider/receipt.proto'
import { ReceiptRepository } from './provider/receipt.repository'
import { ReceiptSessionModule } from '../receiptSession/receiptSession.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([ReceiptEntity]),
    PermissionModule,
    ReceiptSessionModule,
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService, ReceiptReflect, ReceiptRepository],
  exports: [ReceiptService, ReceiptReflect, ReceiptRepository],
})
export class ReceiptModule {}
