import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentSessionService } from './payment-session.service';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { UpdatePaymentSessionDto } from './dto/update-payment-session.dto';

@Controller('payment-session')
export class PaymentSessionController {
  constructor(private readonly paymentSessionService: PaymentSessionService) {}

  @Post()
  create(@Body() createPaymentSessionDto: CreatePaymentSessionDto) {
    return this.paymentSessionService.create(createPaymentSessionDto);
  }

  @Get()
  findAll() {
    return this.paymentSessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentSessionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentSessionDto: UpdatePaymentSessionDto) {
    return this.paymentSessionService.update(+id, updatePaymentSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentSessionService.remove(+id);
  }
}
