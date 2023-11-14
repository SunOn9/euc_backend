import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { GetReceiptSessionConditionRequestDto } from './get-receiptSession-condition-request.dto'
import {
  UpdateReceiptSessionRequest,
  UpdateReceiptSessionDataRequest,
} from '/generated/receiptSession/receiptSession.request'

export class UpdateReceiptSessionRequestDto
  implements UpdateReceiptSessionRequest
{
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetReceiptSessionConditionRequestDto

  @ApiProperty()
  @IsNotEmpty()
  data!: UpdateReceiptSessionDataRequest
}
