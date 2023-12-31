import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Type } from 'class-transformer'
import { RemoveReceiptSessionRequest } from '/generated/receiptSession/receiptSession.request'

export class RemoveReceiptSessionRequestDto
  implements RemoveReceiptSessionRequest
{
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id!: number
}
