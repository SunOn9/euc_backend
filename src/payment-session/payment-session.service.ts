import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto'
import { UpdatePaymentSessionDto } from './dto/update-payment-session.dto'

@Injectable()
export class PaymentSessionService {
  create(createPaymentSessionDto: CreatePaymentSessionDto) {
    return 'This action adds a new paymentSession'
  }

  findAll() {
    return `This action returns all paymentSession`
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentSession`
  }

  update(id: number, updatePaymentSessionDto: UpdatePaymentSessionDto) {
    return `This action updates a #${id} paymentSession`
  }

  remove(id: number) {
    return `This action removes a #${id} paymentSession`
  }
}
