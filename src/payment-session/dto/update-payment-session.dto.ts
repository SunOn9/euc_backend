import { PartialType } from '@nestjs/swagger';
import { CreatePaymentSessionDto } from './create-payment-session.dto';

export class UpdatePaymentSessionDto extends PartialType(CreatePaymentSessionDto) {}
