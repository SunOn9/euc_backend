import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Type } from 'class-transformer'
import { ConfirmPaymentSessionRequest } from '/generated/paymentSession/paymentSession.request'

export class ConfirmPaymentSessionRequestDto
  implements ConfirmPaymentSessionRequest
{
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id!: number
}
