import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReceiptSessionService } from './receipt-session.service';
import { CreateReceiptSessionDto } from './dto/create-receipt-session.dto';
import { UpdateReceiptSessionDto } from './dto/update-receipt-session.dto';

@Controller('receipt-session')
export class ReceiptSessionController {
  constructor(private readonly receiptSessionService: ReceiptSessionService) {}

  @Post()
  create(@Body() createReceiptSessionDto: CreateReceiptSessionDto) {
    return this.receiptSessionService.create(createReceiptSessionDto);
  }

  @Get()
  findAll() {
    return this.receiptSessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receiptSessionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReceiptSessionDto: UpdateReceiptSessionDto) {
    return this.receiptSessionService.update(+id, updateReceiptSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receiptSessionService.remove(+id);
  }
}
