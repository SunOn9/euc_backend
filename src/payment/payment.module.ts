import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module'
import { PaymentEntity } from './entities/payment.entity'
import { PermissionModule } from '/permission/permission.module'
import { PaymentReflect } from './provider/payment.proto'
import { PaymentRepository } from './provider/payment.repository'

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity]), PermissionModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentReflect, PaymentRepository],
  exports: [PaymentService, PaymentReflect, PaymentRepository]
})
export class PaymentModule { }
