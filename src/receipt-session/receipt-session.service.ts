import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { CreateReceiptSessionDto } from './dto/create-receipt-session.dto'
import { UpdateReceiptSessionDto } from './dto/update-receipt-session.dto'

@Injectable()
export class ReceiptSessionService {
  create(createReceiptSessionDto: CreateReceiptSessionDto) {
    return 'This action adds a new receiptSession'
  }

  findAll() {
    return `This action returns all receiptSession`
  }

  findOne(id: number) {
    return `This action returns a #${id} receiptSession`
  }

  update(id: number, updateReceiptSessionDto: UpdateReceiptSessionDto) {
    return `This action updates a #${id} receiptSession`
  }

  remove(id: number) {
    return `This action removes a #${id} receiptSession`
  }
}
