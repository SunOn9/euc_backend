import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Type } from 'class-transformer'
import { DonePaymentSessionRequest } from '/generated/paymentSession/paymentSession.request'

export class DonePaymentSessionRequestDto implements DonePaymentSessionRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id!: number
}
