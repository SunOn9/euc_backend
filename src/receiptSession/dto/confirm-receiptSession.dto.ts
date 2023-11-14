import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Type } from 'class-transformer'
import { ConfirmReceiptSessionRequest } from '/generated/receiptSession/receiptSession.request'

export class ConfirmReceiptSessionRequestDto
  implements ConfirmReceiptSessionRequest
{
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id!: number
}
