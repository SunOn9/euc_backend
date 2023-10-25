import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { GetReceiptSessionConditionRequestDto } from './get-receipt-session-condition-request.dto'
import { UpdateReceiptSessionRequest, UpdateReceiptSessionDataRequest } from '/generated/receipt-session/receipt-session.request'


export class UpdateReceiptSessionRequestDto implements UpdateReceiptSessionRequest {
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetReceiptSessionConditionRequestDto

  @ApiProperty()
  @IsNotEmpty()
  data!: UpdateReceiptSessionDataRequest
}
