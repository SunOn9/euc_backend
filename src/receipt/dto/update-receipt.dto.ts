import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { GetReceiptConditionRequestDto } from './get-receipt-condition-request.dto'
import { UpdateReceiptRequest, UpdateReceiptDataRequest } from '/generated/receipt/receipt.request'

export class UpdateReceiptRequestDto implements UpdateReceiptRequest {
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetReceiptConditionRequestDto

  @ApiProperty()
  @IsNotEmpty()
  data!: UpdateReceiptDataRequest
}
