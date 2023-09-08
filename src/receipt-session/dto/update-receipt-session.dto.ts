import { PartialType } from '@nestjs/swagger';
import { CreateReceiptSessionDto } from './create-receipt-session.dto';

export class UpdateReceiptSessionDto extends PartialType(CreateReceiptSessionDto) {}
