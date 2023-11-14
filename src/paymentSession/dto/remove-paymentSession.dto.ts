import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Type } from 'class-transformer'
import { RemovePaymentSessionRequest } from '/generated/paymentSession/paymentSession.request'

export class RemovePaymentSessionRequestDto
  implements RemovePaymentSessionRequest
{
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id!: number
}
