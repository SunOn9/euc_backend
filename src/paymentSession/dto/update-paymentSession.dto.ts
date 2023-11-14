import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { GetPaymentSessionConditionRequestDto } from './get-paymentSession-condition-request.dto'
import {
  UpdatePaymentSessionRequest,
  UpdatePaymentSessionDataRequest,
} from '/generated/paymentSession/paymentSession.request'

export class UpdatePaymentSessionRequestDto
  implements UpdatePaymentSessionRequest
{
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetPaymentSessionConditionRequestDto

  @ApiProperty()
  @IsNotEmpty()
  data!: UpdatePaymentSessionDataRequest
}
