import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { GetPaymentConditionRequestDto } from './get-payment-condition-request.dto'
import { UpdatePaymentRequest, UpdatePaymentDataRequest } from '/generated/payment/payment.request'


export class UpdatePaymentRequestDto implements UpdatePaymentRequest {
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetPaymentConditionRequestDto

  @ApiProperty()
  @IsNotEmpty()
  data!: UpdatePaymentDataRequest
}
